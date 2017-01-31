import { remote } from 'electron';
import path from 'path';
import fs from 'fs';
import S3 from 'aws-sdk/clients/s3';
import axios from 'axios';

import {
  UPDATE_SETTING_FIELD_VALUE,
  UPDATE_SETTING_LOADING,
  UPDATE_SETTING_VALIDITY,
  INITIALIZE_VALID_SETTING
} from '../reducers/setting';

const REGION = 'ap-northeast-2';

export function validateSetting() {
  return (dispatch, getState) => {
    const { setting } = getState();
    const result = {
      s3Bucket: null,
      accessKeyId: null,
      secretAccessKey: null,
      googleApiKey: null,
      munjanaraId: null,
      munjanaraPassword: null
    };
    Promise.all([
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
      // google
      axios.get('https://www.googleapis.com/urlshortener/v1/url', {
        params: {
          shortUrl: 'http://goo.gl/fbsS',
          key: setting.googleApiKey.value
        }
      }).catch(() => {
        const ERROR_TEXT = '값이 올바르지 않습니다.';
        result.googleApiKey = ERROR_TEXT;
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
      return true;
    }).catch(err => {
      throw err;
    });
  };
}

export function loadSetting() {
  return (dispatch) => {
    const userDataDir = remote.app.getPath('userData');
    const settingPath = path.join(userDataDir, 'setting.json');
    fs.readFile(settingPath, { encoding: 'utf-8' }, (err, data) => {
      if (err) throw err;
      dispatch(initializeValidSetting(JSON.parse(data)));
    });
  };
}

type SavedSetting = {
  s3Bucket: ?string,
  accessKeyId: ?string,
  secretAccessKey: ?string,
  googleApiKey: ?string,
  munjanaraId: ?string,
  munjanaraPassword: ?string
};

export function initializeValidSetting(setting: SavedSetting) {
  return {
    type: INITIALIZE_VALID_SETTING,
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
  googleApiKey: ?string,
  munjanaraId: ?string,
  munjanaraPassword: ?string
};

export function updateSettingValidity(errorTexts: ErrorTexts) {
  return {
    type: UPDATE_SETTING_VALIDITY,
    payload: errorTexts
  };
}
