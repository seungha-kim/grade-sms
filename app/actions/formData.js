import xlsx from 'xlsx';
import { remote } from 'electron';
import debounce from 'lodash.debounce';

import {
  SELECT_FILE,
  UPDATE_RANGE,
  UPDATE_RANGE_PREVIEW,
  UPDATE_RANGE_ERROR,
  ADD_TEST,
  REMOVE_TEST,
  ADD_HOMEWORK,
  REMOVE_HOMEWORK
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

function queryDataRange(rangeString: string) {
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

function updateRange(instanceKey, range) {
  return {
    type: UPDATE_RANGE,
    payload: {
      instanceKey,
      range
    }
  };
}

function updateRangeError(instanceKey, errorText) {
  return {
    type: UPDATE_RANGE_ERROR,
    payload: {
      instanceKey,
      errorText
    }
  };
}

function updateRangePreview(instanceKey, queried) {
  return {
    type: UPDATE_RANGE_PREVIEW,
    payload: {
      instanceKey,
      queried
    }
  };
}

// updateRange: (fieldKey, key, value) => void
// controlled input update + async preview
export function updateRangeThunk(instanceKey: string, range: string) {
  return (dispatch) => {
    dispatch(updateRange(instanceKey, range));
    if (debounced[instanceKey] == null) {
      debounced[instanceKey] = debounce((r: string) => {
        // query and update
        const queried: Array<string> = queryDataRange(r);
        if (queried == null || queried.length !== 2) {
          dispatch(updateRangeError(instanceKey, '잘못된 범위입니다.'));
        } else {
          dispatch(updateRangePreview(instanceKey, queried.join(' ~ ')));
        }
      }, 1000);
    }
    debounced[instanceKey](range);
  };
}

  // addTest = () => {
  //   this.setState({
  //     testRanges: this.state.testRanges.concat([newTestData()])
  //   });
  // }

  // addHomework = () => {
  //   this.setState({
  //     homeworkRanges: this.state.homeworkRanges.concat([newFieldData()])
  //   });
  // }
