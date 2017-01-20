// @flow
import { SELECT_FILE } from '../actions/xlsx';

export type xlsxStateType = {
  xlsx: ?string
};

type actionType = {
  type: string,
  payload: string
};

export default function xlsx(state: ?string = null, action: actionType) {
  const { type, payload } = action;
  switch (type) {
    case SELECT_FILE:
      return payload;
    default:
      return state;
  }
}
