import xlsx from 'xlsx';
import { remote } from 'electron';
import debounce from 'lodash.debounce';

import {
  nextStep
} from './step';

import {
  SELECT_FILE,
  UPDATE_RANGE,
  UPDATE_RANGE_PREVIEW,
  UPDATE_RANGE_ERROR,
  ADD_TEST,
  REMOVE_TEST,
  ADD_HOMEWORK,
  REMOVE_HOMEWORK,
  traverseAllFields
} from '../reducers/formData';

let workbook = null;
const debounced = {};

export function selectFile(name: string) {
  return {
    type: SELECT_FILE,
    payload: name
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
      }
    });
  };
}

function queryDataRange(rangeString: ?string) {
  if (rangeString == null) return;
  if (workbook == null) return; // FIXME
  const sheetName = workbook.SheetNames[0]; // FIXME
  if (sheetName == null) return;
  const sheet = workbook.Sheets[sheetName];
  // parse range
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
  return (dispatch) => {
    const queried: Array<string> = queryDataRange(range);
    if (queried == null || queried.length !== 2) {
      dispatch(updateRangeError(fieldKey, '잘못된 범위입니다.'));
    } else {
      dispatch(updateRangePreview(fieldKey, queried.join(' ~ ')));
    }
  };
}

function validateAllRangesIfDirty() {
  return (dispatch, getState) => {
    const { formData } = getState();
    if (formData.get('dirty') === true) {
      traverseAllFields(formData, f => dispatch(validateRange(f.get('fieldKey'), f.get('range'))));
    }
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

export function nextStepToDataRangeForm() {
  return dispatch => {
    dispatch(nextStep());
    dispatch(validateAllRangesIfDirty());
  };
}
