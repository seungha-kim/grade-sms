// @flow
import { Record } from 'immutable';

export const UPDATE_DEST_DIR = 'UPDATE_DEST_DIR';
export const UPDATE_GENERATING = 'UPDATE_GENERATING';
export const PROGRESS_GENERATING = 'PROGRESS_GENERATING';

export class State extends Record({
  destDir: '',
  generating: false,
  progress: 0
}) {}

const initialState = new State();

export default function generate(state: State = initialState, action: any) {
  switch (action.type) {
    case UPDATE_DEST_DIR:
      return state.set('destDir', action.payload);
    case UPDATE_GENERATING:
      return state.set('generating', action.payload);
    case PROGRESS_GENERATING:
      return state.update('progress', p => p + 1);
    default:
      return state;
  }
}
