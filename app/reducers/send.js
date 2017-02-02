// @flow

import { Record } from 'immutable';

export const UPDATE_SOURCE_DIR = 'UPDATE_SOURCE_DIR';
export const UPDATE_SOURCE_DIR_ERROR_TEXT = 'UPDATE_SOURCE_DIR_ERROR_TEXT';
export const UPDATE_TEMPLATE_STRING = 'UPDATE_TEMPLATE_STRING';
export const UPDATE_SEND_LOG = 'UPDATE_SEND_LOG';
export const DONE = 'DONE';
export const UPDATE_TEST_PHONE_NUMBER = 'UPDATE_TEST_PHONE_NUMBER';
export const DISABLE_SEND_BUTTON = 'DISABLE_SEND_BUTTON';

type LogType = {
  id: string,
  text: string
};

export class State extends Record({
  sourceDir: null,
  sourceDirErrorText: null,
  messageTemplateString: '',
  renderedExampleMessage: '',
  messageTemplateError: false,
  exampleBytes: 0,
  log: null, // 로그 한 건,
  done: false,
  testPhoneNumber: '',
  cannotSend: false
}) {
  sourceDir: ?string;
  sourceDirErrorText: ?string;
  messageTemplateString: string;
  renderedExampleMessage: string;
  messageTemplateError: boolean;
  exampleBytes: number;
  log: LogType;
  done: boolean;
  testPhoneNumber: string;
  cannotSend: boolean;
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
    case UPDATE_SEND_LOG:
      return state.set('log', payload);
    case DONE:
      return state.set('done', true); // FIXME: 다시 켰을 때 done 상태가 아니도록
    case UPDATE_TEST_PHONE_NUMBER:
      return state.set('testPhoneNumber', payload);
    case DISABLE_SEND_BUTTON:
      return state.set('cannotSend', true);
    default:
      return state;
  }
}
