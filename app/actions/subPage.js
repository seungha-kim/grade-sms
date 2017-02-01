import {
  OPEN_SEND_PAGE,
  OPEN_SETTING_PAGE,
  CLOSE_SEND_PAGE,
  CLOSE_SETTING_PAGE,
  OPEN_SELECT_SOURCE_DIR_PAGE,
  CLOSE_SELECT_SOURCE_DIR_PAGE
} from '../reducers/subPage';

export function openSendPage() {
  return {
    type: OPEN_SEND_PAGE
  };
}

export function openSelectSourceDirPage() {
  return {
    type: OPEN_SELECT_SOURCE_DIR_PAGE
  };
}

export function closeSelectSourceDirPage() {
  return {
    type: CLOSE_SELECT_SOURCE_DIR_PAGE
  };
}
export function closeSendPage() {
  return {
    type: CLOSE_SEND_PAGE
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

