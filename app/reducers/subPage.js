import { Record } from 'immutable';

export const VISIBLE_SETTING_PAGE = 'VISIBLE_SETTING_PAGE';
export const INVISIBLE_SETTING_PAGE = 'INVISIBLE_SETTING_PAGE';
export const VISIBLE_SEND_PAGE = 'VISIBLE_SEND_PAGE';
export const INVISIBLE_SEND_PAGE = 'INVISIBLE_SEND_PAGE';

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
    case VISIBLE_SEND_PAGE:
      return state.set('send', true);
    case INVISIBLE_SEND_PAGE:
      return state.set('send', false);
    case VISIBLE_SETTING_PAGE:
      return state.set('setting', true);
    case INVISIBLE_SETTING_PAGE:
      return state.set('setting', false);
    default:
      return state;
  }
}
