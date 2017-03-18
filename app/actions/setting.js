import { remote } from 'electron';
import path from 'path';
import fs from 'fs';
import S3 from 'aws-sdk/clients/s3';
import axios from 'axios';

import {
  UPDATE_SETTING_FIELD_VALUE,
  UPDATE_SETTING_LOADING,
  UPDATE_SETTING_VALIDITY,
  INITIALIZE_SETTING
} from '../reducers/setting';
import {
  closeSettingPage
} from '../actions/subPage';
import {
  validatePhoneNumber
} from '../utils/phoneNumber';

const REGION = 'ap-northeast-2';

export function validateSetting() {
  return (dispatch, getState) => {
    dispatch(updateSettingLoading());
    const { setting } = getState();
    const result = {
      s3Bucket: null,
      accessKeyId: null,
      secretAccessKey: null,
      urloAccessKey: null,
      munjanaraId: null,
      munjanaraPassword: null,
      senderPhoneNumber: null
    };
    if (!validatePhoneNumber(setting.senderPhoneNumber.value)) {
      result.senderPhoneNumber = '발신 번호의 형식이 올바르지 않습니다.';
    }
    return Promise.all([
      new Promise(resolve => {
        // aws
        const s3 = new S3({
          accessKeyId: setting.accessKeyId.value,
          secretAccessKey: setting.secretAccessKey.value,
          region: REGION
        });
        s3.getBucketLocation({ Bucket: setting.s3Bucket.value }, (err) => {
          const ERROR_TEXT = 'AWS 관련 값들 중 하나가 올바르지 않습니다.';
          if (err) {
            result.s3Bucket = ERROR_TEXT;
            result.accessKeyId = ERROR_TEXT;
            result.secretAccessKey = ERROR_TEXT;
          }
          resolve();
        });
      }),
      // URLO
      axios.get('https://urlo.cc/auth', {
        params: {
          access_key: setting.urloAccessKey.value // FIXME
        }
      }).catch(() => {
        const ERROR_TEXT = '값이 올바르지 않습니다.';
        result.urloAccessKey = ERROR_TEXT;
      }),
      // 문자나라
      axios.get('https://www.munjanara.co.kr/MSG/send/web_admin_send.htm', {
        params: {
          call_type: 1,
          userid: setting.munjanaraId.value,
          passwd: setting.munjanaraPassword.value
        }
      }).then(res => {
        console.log(res);
        if (res.data.split('|')[1] !== '0') {
          const ERROR_TEXT = '문자나라 관련 값들 중 하나가 올바르지 않습니다.';
          result.munjanaraId = ERROR_TEXT;
          result.munjanaraPassword = ERROR_TEXT;
        }
        return true;
      })
    ]).then(() => {
      dispatch(updateSettingValidity(result));
      return Object.values(result).every(v => v == null);
    }).catch(err => {
      throw err;
    });
  };
}

export function saveSetting() {
  return (dispatch, getState) => {
    validateSetting()(dispatch, getState).then(valid => {
      if (valid) {
        const userDataDir = remote.app.getPath('userData');
        const settingPath = path.join(userDataDir, 'jsm-report.json');
        const { setting } = getState();
        const data = JSON.stringify({
          s3Bucket: setting.s3Bucket.value,
          accessKeyId: setting.accessKeyId.value,
          secretAccessKey: setting.secretAccessKey.value,
          urloAccessKey: setting.urloAccessKey.value,
          munjanaraId: setting.munjanaraId.value,
          munjanaraPassword: setting.munjanaraPassword.value,
          senderPhoneNumber: setting.senderPhoneNumber.value
        });
        fs.writeFile(settingPath, data, err => {
          if (err) throw err;
          dispatch(closeSettingPage());
        });
      }
      return true;
    }).catch(err => {
      throw err;
    });
  };
}

export function loadSetting() {
  return (dispatch) => {
    const userDataDir = remote.app.getPath('userData');
    const settingPath = path.join(userDataDir, 'jsm-report.json');
    fs.readFile(settingPath, { encoding: 'utf-8' }, (err, data) => {
      if (err) throw err;
      dispatch(initializeSetting(JSON.parse(data)));
    });
  };
}

type SavedSetting = {
  s3Bucket: ?string,
  accessKeyId: ?string,
  secretAccessKey: ?string,
  urloAccessKey: ?string,
  munjanaraId: ?string,
  munjanaraPassword: ?string
};

export function initializeSetting(setting: SavedSetting) {
  return {
    type: INITIALIZE_SETTING,
    payload: setting
  };
}

export function updateSettingFieldValue(field, value) {
  return {
    type: UPDATE_SETTING_FIELD_VALUE,
    payload: { field, value }
  };
}

export function updateSettingLoading() {
  return {
    type: UPDATE_SETTING_LOADING
  };
}

type ErrorTexts = {
  s3Bucket: ?string,
  accessKeyId: ?string,
  secretAccessKey: ?string,
  urloAccessKey: ?string,
  munjanaraId: ?string,
  munjanaraPassword: ?string
};

export function updateSettingValidity(errorTexts: ErrorTexts) {
  return {
    type: UPDATE_SETTING_VALIDITY,
    payload: errorTexts
  };
}
