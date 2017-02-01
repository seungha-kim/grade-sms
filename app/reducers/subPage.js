import { Record } from 'immutable';

export const OPEN_SETTING_PAGE = 'OPEN_SETTING_PAGE';
export const CLOSE_SETTING_PAGE = 'CLOSE_SETTING_PAGE';
export const OPEN_SEND_PAGE = 'OPEN_SEND_PAGE';
export const CLOSE_SEND_PAGE = 'CLOSE_SEND_PAGE';
export const OPEN_SELECT_SOURCE_DIR_PAGE = 'OPEN_SELECT_SOURCE_DIR_PAGE';
export const CLOSE_SELECT_SOURCE_DIR_PAGE = 'CLOSE_SELECT_SOURCE_DIR_PAGE';
export const OPEN_MESSAGE_TEMPLATE = 'OPEN_MESSAGE_TEMPLATE';
export const CLOSE_MESSAGE_TEMPLATE = 'CLOSE_MESSAGE_TEMPLATE';

export class State extends Record({
  selectSourceDir: false,
  setting: false,
  send: false,
  messageTemplate: false,
}) {
  selectSourceDir: boolean;
  setting: boolean;
  send: boolean;
  messageTemplate: boolean;
}

const initialState = new State();

export default function subPage(state: State = initialState, action: any) {
  switch (action.type) {
    case OPEN_SEND_PAGE:
      return state.set('send', true);
    case CLOSE_SEND_PAGE:
      return state.set('send', false);
    case OPEN_SETTING_PAGE:
      return state.set('setting', true);
    case CLOSE_SETTING_PAGE:
      return state.set('setting', false);
    case OPEN_SELECT_SOURCE_DIR_PAGE:
      return state.set('selectSourceDir', true);
    case CLOSE_SELECT_SOURCE_DIR_PAGE:
      return state.set('selectSourceDir', false);
    case OPEN_MESSAGE_TEMPLATE:
      return state.set('messageTemplate', true);
    case CLOSE_MESSAGE_TEMPLATE:
      return state.set('messageTemplate', false);
    default:
      return state;
  }
}
