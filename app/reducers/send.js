// @flow

import { Record } from 'immutable';

export const INITIALIZE_SEND_STATE = 'INITIALIZE_SEND_STATE';
export const UPDATE_SOURCE_DIR = 'UPDATE_SOURCE_DIR';
export const UPDATE_SOURCE_DIR_ERROR_TEXT = 'UPDATE_SOURCE_DIR_ERROR_TEXT';
export const UPDATE_TEMPLATE_STRING = 'UPDATE_TEMPLATE_STRING';
export const UPDATE_SEND_LOG = 'UPDATE_SEND_LOG';
export const DONE = 'DONE';
export const UPDATE_TEST_PHONE_NUMBER = 'UPDATE_TEST_PHONE_NUMBER';
export const DISABLE_SEND_BUTTON = 'DISABLE_SEND_BUTTON';
export const ENABLE_SEND_BUTTON = 'ENABLE_SEND_BUTTON';
export const COMPLETE_INDIVIDUAL_SEND = 'COMPLETE_INDIVIDUAL_SEND';
export const UPDATE_TOTAL_COUNT = 'UPDATE_TOTAL_COUNT';
export const UPDATE_TARGET_CLASS_LIST = 'UPDATE_TARGET_CLASS_LIST';
export const UPDATE_TARGET_CLASS = 'UPDATE_TARGET_CLASS';

type LogType = {
  id: string,
  text: string
};

type TargetClassList = Array<string>;

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
  cannotSend: false,
  sendCount: 0,
  totalCount: null,
  targetClassList: null,
  targetClass: undefined,
  targetCount: 0
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
  sendCount: number;
  totalCount: ?number;
  targetClassList: ?TargetClassList;
  targetClass: ?string;
  targetCount: number;
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
      return state.set('done', true);
    case UPDATE_TEST_PHONE_NUMBER:
      return state.set('testPhoneNumber', payload);
    case DISABLE_SEND_BUTTON:
      return state.set('cannotSend', true);
    case ENABLE_SEND_BUTTON:
      return state.set('cannotSend', false);
    case COMPLETE_INDIVIDUAL_SEND:
      return state.update('sendCount', c => c + 1);
    case UPDATE_TOTAL_COUNT:
      return state.set('totalCount', payload);
    case INITIALIZE_SEND_STATE:
      return initialState;
    case UPDATE_TARGET_CLASS_LIST:
      return state.set('targetClassList', payload);
    case UPDATE_TARGET_CLASS:
      return state.set('targetClass', payload.targetClass).set('targetCount', payload.targetCount);
    default:
      return state;
  }
}
