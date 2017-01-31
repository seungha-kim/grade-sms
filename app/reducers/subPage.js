import { Record } from 'immutable';

export const OPEN_SETTING_PAGE = 'OPEN_SETTING_PAGE';
export const CLOSE_SETTING_PAGE = 'CLOSE_SETTING_PAGE';
export const OPEN_SEND_PAGE = 'OPEN_SEND_PAGE';
export const CLOSE_SEND_PAGE = 'CLOSE_SEND_PAGE';

export class State extends Record({
  setting: false,
  send: false
}) {
  setting: boolean;
  send: boolean;
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
    default:
      return state;
  }
}
