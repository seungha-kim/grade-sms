import xlsx from 'xlsx';
import { remote } from 'electron';
import debounce from 'lodash.debounce';
import _ from 'lodash';

import { calculateRank } from '../utils/rank';
import {
  SELECT_FILE,
  UPDATE_RANGE,
  UPDATE_RANGE_PREVIEW,
  UPDATE_RANGE_ERROR,
  ADD_TEST,
  REMOVE_TEST,
  ADD_HOMEWORK,
  REMOVE_HOMEWORK,
  RESET_FORM_DATA,
  UPDATE_DATA_VALIDATION,
  UPDATE_SHEET_NAMES,
  UPDATE_SELECTED_SHEET,
  traverseAllFields
} from '../reducers/range';

import {
  UPDATE_STAT
} from '../reducers/stat';

import { validatePhoneNumber } from '../utils/phoneNumber';

let workbook = null;
let blankRowIndexes;
const debounced = {};
const RESET_TEXT = '\n엑셀 파일을 수정한 후 프로그램을 다시 실행해 주세요.';

export function selectFile(name: string) {
  return {
    type: SELECT_FILE,
    payload: name
  };
}

export function updateSheetNames(sheetNames: ?Array<string>) {
  return {
    type: UPDATE_SHEET_NAMES,
    payload: sheetNames
  };
}

export function updateSelectedSheet(sheetIndex: ?number) {
  return {
    type: UPDATE_SELECTED_SHEET,
    payload: sheetIndex
  };
}

export function showOpenDialog() {
  return (dispatch: () => void) => {
    remote.dialog.showOpenDialog({
      filters: [
        {
          name: 'Excel file (.xlsx, .xls, .ods)',
          extensions: ['xlsx', 'xls', 'ods']
        }
      ],
      properties: [
        'openFile'
      ]
    }, (filePaths: Array<string>) => {
      if (filePaths != null) {
        const f = filePaths[0];
        workbook = xlsx.readFile(f);
        dispatch(selectFile(f));
        dispatch(updateSheetNames(workbook.SheetNames.slice()));
      }
    });
  };
}

function queryDataRange(rangeString: ?string, sheet) {
  if (rangeString == null) return;
  const range = rangeString.split(':');
  if (range.length !== 2 || range[0] === '' || range[1] === '') return;
  const left = sheet[range[0]];
  const right = sheet[range[1]];
  const leftValue = left ? JSON.stringify(left.v) : '<빈칸>';
  const rightValue = right ? JSON.stringify(right.v) : '<빈칸>';
  return [leftValue, rightValue];
}

function updateRange(fieldKey, range) {
  return {
    type: UPDATE_RANGE,
    payload: {
      fieldKey,
      range
    }
  };
}

function updateRangeError(fieldKey, errorText) {
  return {
    type: UPDATE_RANGE_ERROR,
    payload: {
      fieldKey,
      errorText
    }
  };
}

function updateRangePreview(fieldKey, queried) {
  return {
    type: UPDATE_RANGE_PREVIEW,
    payload: {
      fieldKey,
      queried
    }
  };
}

export function updateRangeThunk(fieldKey: string, range: string) {
  return (dispatch) => {
    dispatch(updateRange(fieldKey, range));
    if (debounced[fieldKey] == null) {
      debounced[fieldKey] = debounce((r: string) => {
        dispatch(validateRange(fieldKey, r));
      }, 1000);
    }
    debounced[fieldKey](range);
  };
}

function validateRange(fieldKey, range) {
  return (dispatch, getState) => {
    if (workbook == null) return;
    const selectedSheetIndex = getState().range.get('selectedSheetIndex');
    const sheetName = workbook.SheetNames[selectedSheetIndex];
    const queried: Array<string> = queryDataRange(range, workbook.Sheets[sheetName]);
    if (queried == null || queried.length !== 2) {
      dispatch(updateRangeError(fieldKey, '잘못된 범위입니다.'));
    } else {
      dispatch(updateRangePreview(fieldKey, queried.join(' ~ ')));
    }
  };
}

function updateDataValidation(message, valid) {
  return {
    type: UPDATE_DATA_VALIDATION,
    payload: {
      dataValidationMessage: message,
      allDataValid: valid
    }
  };
}

export function revalidate() {
  return (dispatch, getState) => {
    const { range: formData } = getState();
    workbook = xlsx.readFile(formData.get('filePath'));
    dispatch(validateData());
  };
}


export function validateData() {
  return (dispatch, getState) => {
    const messages = [];
    const { range: formData } = getState();
    const selectedSheetIndex = formData.get('selectedSheetIndex');
    if (selectedSheetIndex == null) return;
    const sheetName = workbook.SheetNames[selectedSheetIndex];
    if (sheetName == null) return;
    const sheet = workbook.Sheets[sheetName];
    // 개수 맞는지 - 모든 range 가져와서 decode 후 개수 검사
    const ranges = [];
    traverseAllFields(formData, f => ranges.push(f.get('range')));
    const allRangesDecoded = ranges.map(xlsx.utils.decode_range);
    const length = allRangesDecoded
      .map(r => ((r.e.c - r.s.c) + 1) * ((r.e.r - r.s.r) + 1))
      .reduce((prev, cur) => (prev === cur ? cur : false));
    if (length === false) {
      dispatch(updateDataValidation('모든 범위의 크기가 같아야 합니다. 뒤로 돌아가 다시 확인해주세요.', false));
      return;
    }

    // 셀 중 빈칸이 있는지
    const blankCells = [];
    blankRowIndexes = new Set();
    allRangesDecoded.forEach(range => {
      for (let col = range.s.c; col <= range.e.c; col += 1) {
        for (let row = range.s.r, i = 0; row < range.e.r; row += 1, i += 1) {
          const cellName = xlsx.utils.encode_cell({ c: col, r: row });
          if (sheet[cellName] == null) {
            blankCells.push(cellName);
            blankRowIndexes.add(i);
          }
        }
      }
    });
    if (blankCells.length !== 0) {
      messages.push(`범위 내에 빈 셀이 존재합니다 : ${blankCells.join(', ')}`);
      messages.push('빈 셀이 존재하는 행은 모든 계산에서 제외됩니다.');
    }

    // 원번은 모두 자연수이고 중복된 게 없는지
    const idAddresses = rangeToAddresses(formData.get('privacyRangeSet').get('id').get('range'));
    const idSet = {};
    for (let i = 0; i < idAddresses.length; i += 1) {
      const id = sheet[idAddresses[i]].v;
      const parsed = parseInt(id, 10);
      if (Number.isNaN(parsed) || parsed < 1) {
        messages.push(`허용되지 않는 원번이 존재합니다 : ${id}${RESET_TEXT}`);
        dispatch(updateDataValidation(messages.join('\n'), false));
        return;
      }
      if (idSet[id] != null) {
        messages.push(`중복된 원번이 존재합니다 : ${id}${RESET_TEXT}`);
        dispatch(updateDataValidation(messages.join('\n'), false));
        return;
      }
      idSet[id] = true;
    }

    // '점수' 필드 중 범위를 벗어난 게 있는지
    const wrongGrades = [];
    const gradeRanges = formData
      .get('testRangeSets')
      .map(s => s.get('fields').get('grade').get('range'))
      .concat(
        formData
          .get('homeworkRangeSets')
          .map(s => s.get('fields').get('grade').get('range'))
      );
    gradeRanges.forEach(range => {
      const decoded = xlsx.utils.decode_range(range);
      for (let col = decoded.s.c; col <= decoded.e.c; col += 1) {
        for (let row = decoded.s.r; row < decoded.e.r; row += 1) {
          const cellName = xlsx.utils.encode_cell({ c: col, r: row });
          const grade = sheet[cellName];
          if (grade < 0 || grade > 100) wrongGrades.push(cellName);
        }
      }
    });
    if (wrongGrades.length !== 0) {
      messages.push(`허용되지 않는 점수 : ${wrongGrades.join(', ')}${RESET_TEXT}`);
      dispatch(updateDataValidation(messages.join('\n'), false));
      return;
    }

    // 검색된 모든 반
    const classes = {};
    const classRanges = formData
      .get('testRangeSets')
      .map(s => s.get('fields').get('class').get('range'));
    classRanges.forEach(range => {
      const decoded = xlsx.utils.decode_range(range);
      for (let col = decoded.s.c; col <= decoded.e.c; col += 1) {
        for (let row = decoded.s.r; row < decoded.e.r; row += 1) {
          const cellName = xlsx.utils.encode_cell({ c: col, r: row });
          const cls = sheet[cellName].v;
          classes[cls] = true;
        }
      }
    });
    messages.push(`\n검색된 모든 반 : \n${Object.keys(classes).join('\n')}`);

    // 전화번호 검사
    const phoneAddresses = rangeToAddresses(formData.get('privacyRangeSet').get('phone').get('range'));
    let wrongPhoneExists = false;
    phoneAddresses.forEach(pa => {
      const phone = sheet[pa].v;
      if (!validatePhoneNumber(phone)) {
        if (!wrongPhoneExists) {
          messages.push('\n잘못된 전화번호 :');
          wrongPhoneExists = true;
        }
        messages.push(`${phone} (${pa})`);
      }
    });
    if (wrongPhoneExists) {
      messages.push('경고: 잘못된 전화번호에 대한 성적표는 생성되지만, 발송은 되지 않습니다.');
    }

    messages.push('\n모든 검사 과정을 통과했습니다.');
    dispatch(updateDataValidation(messages.join('\n'), true));
  };
}

export function addTest() {
  return {
    type: ADD_TEST
  };
}

export function removeTest(fieldKey) {
  return {
    type: REMOVE_TEST,
    payload: fieldKey
  };
}

export function addHomework() {
  return {
    type: ADD_HOMEWORK
  };
}

export function removeHomework(fieldKey) {
  return {
    type: REMOVE_HOMEWORK,
    payload: fieldKey
  };
}

export function resetFormData() {
  return {
    type: RESET_FORM_DATA
  };
}

export function calculateStat() {
  return (dispatch, getState) => {
    const { range: formData } = getState();
    const selectedSheetIndex = formData.get('selectedSheetIndex');
    if (selectedSheetIndex == null) return;
    const sheetName = workbook.SheetNames[selectedSheetIndex];
    if (sheetName == null) return;
    const sheet = workbook.Sheets[sheetName];
    const ids = rangeMap(
      formData.get('privacyRangeSet').get('id').get('range'),
      ad => (sheet[ad] ? sheet[ad].v : null)
    );
    const names = rangeMap(
      formData.get('privacyRangeSet').get('name').get('range'),
      ad => (sheet[ad] ? sheet[ad].v : null)
    );
    const schools = rangeMap(
      formData.get('privacyRangeSet').get('school').get('range'),
      ad => (sheet[ad] ? sheet[ad].v : null)
    );
    const phones = rangeMap(
      formData.get('privacyRangeSet').get('phone').get('range'),
      ad => (sheet[ad] ? sheet[ad].v : null)
    );
    const testClassesZipped = _.zip(...formData.get('testRangeSets').map(trs =>
      rangeMap(
        trs.get('fields').get('class').get('range'),
        ad => (sheet[ad] ? sheet[ad].v : null)
      )
    ));
    const testGradesZipped = _.zip(...formData.get('testRangeSets').map(trs =>
      rangeMap(
        trs.get('fields').get('grade').get('range'),
        ad => (sheet[ad] ? sheet[ad].v : null)
      )
    ));
    const homeworkClassesZipped = _.zip(...formData.get('homeworkRangeSets').map(trs =>
      rangeMap(
        trs.get('fields').get('class').get('range'),
        ad => (sheet[ad] ? sheet[ad].v : null)
      )
    ));
    const homeworkGradesZipped = _.zip(...formData.get('homeworkRangeSets').map(trs =>
      rangeMap(
        trs.get('fields').get('grade').get('range'),
        ad => (sheet[ad] ? sheet[ad].v : null)
      )
    ));
    const individual = _.zipWith(
      ids, names, schools, phones,
      testClassesZipped, testGradesZipped, homeworkClassesZipped, homeworkGradesZipped,
      (id, name, school, phone, testClasses, testGrades, homeworkClasses, homeworkGrades) => ({
        id, name, school, phone, testClasses, testGrades, homeworkClasses, homeworkGrades
      })
    ).filter((v, i) => !blankRowIndexes.has(i));
    const classes = Array.from(individual.reduce((acc, { testClasses, homeworkClasses }) => {
      testClasses.forEach(cls => acc.add(cls));
      if (homeworkClasses != null) homeworkClasses.forEach(cls => acc.add(cls));
      return acc;
    }, new Set()));
    const totalTestRanksAll = _.chain(individual)
      .map(({ testGrades }) => testGrades)
      .thru(gs => _.zip(...gs))
      .map((testGradeArray) => {
        const objs = testGradeArray.map(grade => ({ grade }));
        calculateRank(objs, ({ grade }) => grade, (item, rank) => { item.rank = rank; }); // eslint-disable-line
        return objs.map(({ rank }) => rank);
      })
      .thru(gs => _.zip(...gs))
      .value();
    _.zip(individual, totalTestRanksAll).forEach(([ind, totalTestRanks]) => { ind.totalTestRanks = totalTestRanks; }); // eslint-disable-line
    const classTestRanksAll = _.chain(individual)
      .map(({ id, testGrades, testClasses }) =>
        _.zip(testGrades, testClasses)
          .map(([grade, cls]) => ({ grade, cls, id }))
      )
      .thru(gs => _.zip(...gs))
      .map(testGradeArray => {
        const classRankMap = {}; // id : classRank
        _.chain(testGradeArray)
          .groupBy('cls')
          .forOwn((classTestGradeArray) => {
            calculateRank(
              classTestGradeArray,
              ({ grade }) => grade,
              ({ id }, rank) => { classRankMap[id] = rank; }
            );
          })
          .value();
        return classRankMap;
      })
      .value();
    individual.forEach(ind => { ind.classTestRanks = classTestRanksAll.map(ctr => ctr[ind.id]); }); // eslint-disable-line
    const tests = formData.get('testRangeSets').toJS().map((trs, i) => {
      // 테스트 각각의 반평균 반석차 전체평균 전체석차
      const intermediate = individual
        .map(({ id, testClasses: tcs, testGrades: tgs }) => ({
          id, cls: tcs[i], grade: tgs[i]
        }))
        .filter(({ grade }) => Number.isFinite(grade)); // NOTE: 점수가 숫자가 아닌 경우는 빼고 계산
      const totalRank = _.chain(intermediate)
        .sortBy(['grade'])
        .reverse()
        .map(({ id }) => id)
        .value();
      const totalAvg = _.chain(intermediate)
        .map(({ grade }) => grade)
        .sum()
        .value() / intermediate.length;
      const classIntermediate = intermediate
        .reduce((acc, { id, cls, grade }) => {
          acc[cls] = acc[cls] || []; // eslint-disable-line
          acc[cls].push({ id, grade });
          return acc;
        }, {});
      const classRank = _.transform(classIntermediate, (acc, arr, cls) => {
        acc[cls] = _.chain(arr) // eslint-disable-line
          .sortBy(({ grade }) => grade)
          .reverse()
          .map(({ id }) => id)
          .value();
        return acc;
      }, {});
      const classAvg = _.transform(classIntermediate, (acc, arr, cls) => {
        acc[cls] = _.chain(arr) // eslint-disable-line
          .map(({ grade }) => grade)
          .sum()
          .value() / arr.length;
        return acc;
      }, {});
      return {
        totalRank,
        totalAvg,
        classRank,
        classAvg,
      };
    });
    const homeworks = formData.get('homeworkRangeSets').toJS().map((trs, i) => {
      // 테스트 각각의 반평균 반석차 전체평균 전체석차
      const intermediate = individual
        .map(({ id, homeworkClasses: hcs, homeworkGrades: hgs }) => ({
          id, cls: hcs[i], grade: hgs[i]
        }))
        .filter(({ grade }) => Number.isFinite(grade)); // NOTE: 점수가 숫자가 아닌 경우는 빼고 계산
      const totalRank = _.chain(intermediate)
        .sortBy(['grade'])
        .reverse()
        .map(({ id }) => id)
        .value();
      const totalAvg = _.chain(intermediate)
        .map(({ grade }) => grade)
        .sum()
        .value() / intermediate.length;
      const classIntermediate = intermediate
        .reduce((acc, { id, cls, grade }) => {
          acc[cls] = acc[cls] || []; // eslint-disable-line
          acc[cls].push({ id, grade });
          return acc;
        }, {});
      const classRank = _.transform(classIntermediate, (acc, arr, cls) => {
        acc[cls] = _.chain(arr) // eslint-disable-line
          .sortBy(({ grade }) => grade)
          .reverse()
          .map(({ id }) => id)
          .value();
        return acc;
      }, {});
      const classAvg = _.transform(classIntermediate, (acc, arr, cls) => {
        acc[cls] = _.chain(arr) // eslint-disable-line
          .map(({ grade }) => grade)
          .sum()
          .value() / arr.length;
        return acc;
      }, {});
      return {
        totalRank,
        totalAvg,
        classRank,
        classAvg
      };
    });
    dispatch({
      type: UPDATE_STAT,
      payload: {
        classes,
        individual,
        tests,
        homeworks,
      }
    });
  };
}

function rangeToAddresses(rangeString) {
  const result = [];
  const range = xlsx.utils.decode_range(rangeString);
  for (let c = range.s.c; c <= range.e.c; c += 1) {
    for (let r = range.s.r; r <= range.e.r; r += 1) {
      result.push(xlsx.utils.encode_cell({ c, r }));
    }
  }
  return result;
}

function rangeMap(rangeString, mapper) {
  return rangeToAddresses(rangeString).map(mapper);
}
