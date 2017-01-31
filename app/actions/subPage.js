import {
  VISIBLE_SEND_PAGE,
  VISIBLE_SETTING_PAGE,
  INVISIBLE_SEND_PAGE,
  INVISIBLE_SETTING_PAGE
} from '../reducers/subPage';

export function visibleSendPage() {
  return {
    type: VISIBLE_SEND_PAGE
  };
}

export function invisibleSendPage() {
  return {
    type: INVISIBLE_SEND_PAGE
  };
}

export function visibleSettingPage() {
  return {
    type: VISIBLE_SETTING_PAGE
  };
}

export function invisibleSettingPage() {
  return {
    type: INVISIBLE_SETTING_PAGE
  };
}

