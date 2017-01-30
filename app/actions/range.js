import xlsx from 'xlsx';
import { remote } from 'electron';
import debounce from 'lodash.debounce';
import _ from 'lodash';

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

let workbook = null;
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
  if (left == null || right == null) return;
  const leftValue = left.v;
  const rightValue = right.v;
  if (leftValue == null || rightValue == null) return;
  return [JSON.stringify(leftValue), JSON.stringify(rightValue)];
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
    allRangesDecoded.forEach(range => {
      for (let col = range.s.c; col <= range.e.c; col += 1) {
        for (let row = range.s.r; row < range.e.r; row += 1) {
          const cellName = xlsx.utils.encode_cell({ c: col, r: row });
          if (sheet[cellName] == null) blankCells.push(cellName);
        }
      }
    });
    if (blankCells.length !== 0) {
      messages.push(`범위 내에 빈 셀이 존재합니다 : ${blankCells.join(', ')}${RESET_TEXT}`);
      dispatch(updateDataValidation(messages.join('\n'), false));
      return;
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
    messages.push(`검색된 모든 반 : \n${Object.keys(classes).join('\n')}`);
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
    // TODO: 출결에 따라 제외?
    const classesMap = {};
    // individual
    const ids = rangeMap(
      formData.get('privacyRangeSet').get('id').get('range'),
      ad => sheet[ad].v.toString()
    );
    const names = rangeMap(
      formData.get('privacyRangeSet').get('name').get('range'),
      ad => sheet[ad].v
    );
    const schools = rangeMap(
      formData.get('privacyRangeSet').get('school').get('range'),
      ad => sheet[ad].v
    );
    const phones = rangeMap(
      formData.get('privacyRangeSet').get('phone').get('range'),
      ad => sheet[ad].v
    );
    const individual = _.zipWith(
      ids, names, schools, phones,
      (id, name, school, phone) => ({ id, name, school, phone }));
    const tests = formData.get('testRangeSets').map(trs => {
      const testClasses = rangeMap(
        trs.get('fields').get('class').get('range'),
        ad => sheet[ad].v
      );
      const testGrades = rangeMap(
        trs.get('fields').get('grade').get('range'),
        ad => sheet[ad].v
      );
      testClasses.forEach(c => {
        classesMap[c] = true;
      });
      const individualGrade = _.zipObject(ids, testGrades);
      const individualClass = _.zipObject(ids, testClasses);
      const statIntermediate = _.chain(ids)
        .zip(testGrades, testClasses)
        .map(([id, grade, cls]) => ({ id, grade: parseFloat(grade), cls }))
        .filter(({ grade }) => !Number.isNaN(grade))
        .values();

      const totalRank = _.chain(statIntermediate)
        .sortBy(({ grade }) => grade)
        .map(({ id }) => id)
        .value();
      const totalAvg = _.chain(statIntermediate)
        .map(({ grade }) => grade)
        .thru(arr => _.sum(arr) / arr.length)
        .value();
      const classRank = _.chain(statIntermediate)
        .reduce((acc, { id, cls, grade }) => {
          acc[cls] = acc[cls] || []; // eslint-disable-line
          acc[cls].push({ id, grade });
          return acc;
        }, {})
        .transform((result, value, cls) => {
          result[cls] = _.chain(value) // eslint-disable-line
            .sortBy(({ grade }) => grade)
            .map(({ id }) => id)
            .value();
        }, {})
        .value();
      const classAvg = _.chain(statIntermediate)
        .reduce((acc, { grade, cls }) => {
          acc[cls] = acc[cls] || []; // eslint-disable-line
          acc[cls].push(grade);
          return acc;
        }, {})
        .transform((result, value, key) => {
          result[key] = _.sum(value) / value.length; // eslint-disable-line
        }, {})
        .value();
      return {
        individualGrade,
        individualClass,
        totalRank,
        totalAvg,
        classRank,
        classAvg
      };
    }).toJS();
    const homeworks = formData.get('homeworkRangeSets').map(hr => {
      const grades = rangeMap(
        hr.get('fields').get('grade').get('range'),
        ad => sheet[ad].v
      );
      const classes = rangeMap(
        hr.get('fields').get('class').get('range'),
        ad => sheet[ad].v
      );
      const individualGrade = _.zipObject(ids, grades);
      const statIntermediate = _.chain(ids)
        .zip(grades, classes)
        .map(([id, grade, cls]) => ({ id, grade: parseFloat(grade), cls }))
        .filter(({ grade }) => !Number.isNaN(grade))
        .value();
      const totalAvg = _.chain(statIntermediate)
        .map(({ grade }) => grade)
        .thru(arr => _.sum(arr) / arr.length)
        .value();
      const classAvg = _.chain(statIntermediate)
        .reduce((acc, { grade, cls }) => {
          acc[cls] = acc[cls] || []; // eslint-disable-line
          acc[cls].push(grade);
          return acc;
        }, {})
        .transform((result, value, key) => {
          result[key] = _.sum(value) / value.length; // eslint-disable-line
        }, {})
        .value();
      return {
        individualGrade,
        totalAvg,
        classAvg
      };
    }).toJS();
    dispatch({
      type: UPDATE_STAT,
      payload: {
        classes: Array.from(Object.keys(classesMap)),
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
