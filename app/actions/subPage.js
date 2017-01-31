import {
  OPEN_SEND_PAGE,
  OPEN_SETTING_PAGE,
  CLOSE_SEND_PAGE,
  CLOSE_SETTING_PAGE
} from '../reducers/subPage';

export function openSendPage() {
  return {
    type: OPEN_SEND_PAGE
  };
}

export function closeSendPage() {
  return {
    CLOSE_SEND_PAGE
  };
}

export function openSettingPage() {
  return {
    type: OPEN_SETTING_PAGE
  };
}

export function closeSettingPage() {
  return {
    type: CLOSE_SETTING_PAGE
  };
}

