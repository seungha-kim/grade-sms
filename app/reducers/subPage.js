import { Record } from 'immutable';

export const OPEN_SETTING_PAGE = 'OPEN_SETTING_PAGE';
export const CLOSE_SETTING_PAGE = 'CLOSE_SETTING_PAGE';
export const OPEN_SEND_PAGE = 'OPEN_SEND_PAGE';
export const CLOSE_SEND_PAGE = 'CLOSE_SEND_PAGE';
export const OPEN_SELECT_SOURCE_DIR_PAGE = 'OPEN_SELECT_SOURCE_DIR_PAGE';
export const CLOSE_SELECT_SOURCE_DIR_PAGE = 'CLOSE_SELECT_SOURCE_DIR_PAGE';

export class State extends Record({
  selectSourceDir: false,
  setting: false,
  send: false,
  messageTemplate: true,
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
    default:
      return state;
  }
}
