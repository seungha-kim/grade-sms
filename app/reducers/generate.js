// @flow
import { Record } from 'immutable';

export const UPDATE_DEST_DIR = 'UPDATE_DEST_DIR';
export const UPDATE_GENERATING = 'UPDATE_GENERATING';

export class State extends Record({
  destDir: '',
  generating: false
}) {}

const initialState = new State();

export default function generate(state: State = initialState, action: any) {
  switch (action.type) {
    case UPDATE_DEST_DIR:
      return state.set('destDir', action.payload);
    case UPDATE_GENERATING:
      return state.set('generating', action.payload);
    default:
      return state;
  }
}
