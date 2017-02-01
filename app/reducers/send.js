// @flow

import { Record } from 'immutable';

const UPDATE_SOURCE_DIR = 'UPDATE_SOURCE_DIR';

class State extends Record({
  sourceDir: null
}) {
  sourceDir: ?string
}

const initialState = new State();

export default function send(state: State = initialState, action: any) {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_SOURCE_DIR:
      return state.set('sourceDir', payload);
    default:
      return state;
  }
}
