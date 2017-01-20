// @flow
import xlsx from 'xlsx';
import { remote } from 'electron';

let workbook = null;

export const SELECT_FILE = 'SELECT_FILE';

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

export function queryDataRange(rangeString: string) {
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
