// @flow

import { Record } from 'immutable';

export const UPDATE_SOURCE_DIR = 'UPDATE_SOURCE_DIR';
export const UPDATE_SOURCE_DIR_ERROR_TEXT = 'UPDATE_SOURCE_DIR_ERROR_TEXT';
export const UPDATE_TEMPLATE_STRING = 'UPDATE_TEMPLATE_STRING';

export class State extends Record({
  sourceDir: null,
  sourceDirErrorText: null,
  messageTemplateString: '',
  renderedExampleMessage: '',
  messageTemplateError: false,
  exampleBytes: 0
}) {
  sourceDir: ?string;
  sourceDirErrorText: ?string;
  messageTemplateString: string;
  renderedExampleMessage: string;
  messageTemplateError: boolean;
  exampleBytes: number;
}

const initialState = new State();

export default function send(state: State = initialState, action: any) {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_SOURCE_DIR:
      return state.set('sourceDir', payload).set('sourceDirErrorText', null);
    case UPDATE_SOURCE_DIR_ERROR_TEXT:
      return state.set('sourceDirErrorText', payload).set('sourceDir', null);
    case UPDATE_TEMPLATE_STRING:
      return state
        .set('messageTemplateError', payload.messageTemplateError || false)
        .set('messageTemplateString', payload.messageTemplateString)
        .set('renderedExampleMessage', payload.renderedExampleMessage)
        .set('exampleBytes', payload.exampleBytes);
    default:
      return state;
  }
}
