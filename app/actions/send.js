import { remote } from 'electron';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import { TextEncoder } from 'text-encoding';

import S3 from 'aws-sdk/clients/s3';
import addYears from 'date-fns/add_years';
import axios from 'axios';

import {
  openSettingPage,
  openSelectSourceDirPage,
  closeMessageTemplate,
  openSendPage
} from './subPage';

import {
  UPDATE_SOURCE_DIR,
  UPDATE_SOURCE_DIR_ERROR_TEXT,
  UPDATE_TEMPLATE_STRING,
  UPDATE_SEND_LOG,
  DONE,
  UPDATE_TEST_PHONE_NUMBER,
  DISABLE_SEND_BUTTON
} from '../reducers/send';

import {
  PLAN_FILE_NAME,
  MESSAGE_TEMPLATE_FILE_NAME,
  LOG_FILE_NAME,
  RESULT_RECORD_FILE_NAME
} from '../utils/fileNames';

const encoder = new TextEncoder('euc-kr', { NONSTANDARD_allowLegacyEncoding: true });

function munjanaraEncoder(input) {
  return Buffer.from(encoder.encode(input))
    .toString('hex')
    .replace(/([a-f0-9]{2})/g, '%$1')
    .toUpperCase();
}

function UploadError(message) {
  this.name = 'UploadError';
  this.message = message || '업로드 에러';
}
UploadError.prototype = new Error();
UploadError.prototype.constructor = UploadError;

function UrlError(message) {
  this.name = 'UrlError';
  this.message = message || 'URL 에러';
}
UrlError.prototype = new Error();
UrlError.prototype.constructor = UrlError;

function SmsError(message) {
  this.name = 'SmsError';
  this.message = message || 'SMS 에러';
}
SmsError.prototype = new Error();
SmsError.prototype.constructor = SmsError;

function checkSmsError(result) {
  if (result === '9') {
    return true;
  } else if (result === '4') {
    throw new SmsError('문자나라 잔액이 충분하지 않습니다.');
  } else if (result === '6') {
    throw new SmsError('발신 번호가 잘못되었습니다.');
  } else if (result === '13') {
    throw new SmsError('보내는 번호가 사전 등록되지 않았습니다. 문자나라 홈페이지에서 발신번호 사전 등록이 필요합니다.');
  } else {
    throw new SmsError(`문자나라 에러코드 : ${result}`);
  }
}

export function onCommandOpenSelectSourceDirPage() { // T.T
  return (dispatch, getState) => {
    const { setting } = getState();
    if (setting.valid()) {
      dispatch(openSelectSourceDirPage());
    } else {
      alert('외부 서비스 설정이 제대로 되지 않았습니다. 설정을 한 뒤 [메뉴 - 성적표 발송]을 실행해주세요.');
      dispatch(openSettingPage());
    }
  };
}

export function showOpenDialog() {
  return (dispatch) => {
    try {
      console.log('showOpenDialog start');
      const [dir] = remote.dialog.showOpenDialog({ properties: ['openDirectory'] });
      const planPath = path.join(dir, PLAN_FILE_NAME);
      // 발송 계획 파일 구조 : `app/actions/generate.js` 참고
      const parsed = JSON.parse(fs.readFileSync(planPath, { encoding: 'utf-8' }));
      const files = fs.readdirSync(dir);
      const matched = parsed.items.every(([, , , , fileName]) => files.includes(fileName));
      if (matched) {
        dispatch(updateSourceDir(dir));
      } else {
        dispatch(updateSourceDirErrorText('성적표 폴더가 손상된 것 같습니다. 성적표를 다시 생성해주세요.'));
      }
    } catch (e) {
      dispatch(updateSourceDirErrorText(`입력된 폴더가 올바르지 않습니다 : ${e.toString()}`));
    }
  };
}

export function updateSourceDir(sourceDir) {
  return {
    type: UPDATE_SOURCE_DIR,
    payload: sourceDir
  };
}

export function updateSourceDirErrorText(errorText) {
  return {
    type: UPDATE_SOURCE_DIR_ERROR_TEXT,
    payload: errorText
  };
}

export function initializeTemplateStringIfBlanked() {
  return (dispatch, getState) => {
    const { send } = getState();
    if (send.messageTemplateString === '') {
      dispatch(renderExampleMessage('정상모 수학 성적표 {{이름}}({{원번}})'));
    }
  };
}

export function updateTemplateString(
  messageTemplateString,
  renderedExampleMessage,
  messageTemplateError,
  exampleBytes
) {
  return {
    type: UPDATE_TEMPLATE_STRING,
    payload: {
      messageTemplateString,
      messageTemplateError,
      renderedExampleMessage,
      exampleBytes
    }
  };
}

export function renderExampleMessage(templateString) {
  return (dispatch) => {
    try {
      const rendered = handlebars.compile(templateString)({
        이름: '김승하',
        원번: '12345',
        학교: '영광고'
      });
      const exampleMessage = `${rendered}\ngoo.gl/oEx6gx`;
      const buffer = encoder.encode(exampleMessage);
      dispatch(updateTemplateString(templateString, exampleMessage, false, buffer.length));
    } catch (err) {
      console.error(err);
      dispatch(updateTemplateString(templateString, '', true, 0));
    }
  };
}

export function updateSendLog(id, text) {
  return {
    type: UPDATE_SEND_LOG,
    payload: { id, text }
  };
}

export function sendMessage(receiver, text, callback) {
  return (dispatch, getState) => {
    const { setting } = getState();
    const smsId = setting.munjanaraId.value;
    const smsPasswd = setting.munjanaraPassword.value;
    const sender = '010-6330-3082'.replace(/[^0-9]/g, ''); // FIXME
    axios
      .get('https://www.munjanara.co.kr/MSG/send/web_admin_send.htm', {
        params: {
          userid: smsId,
          passwd: smsPasswd,
          sender,
          receiver: receiver.replace(/[^0-9]/g, ''),
          encode: 1,
          message: munjanaraEncoder(text),
          allow_mms: 1
        }
      })
      .then(res => {
        // 결과값|유료잔액|전송수|예약유무|전달값
        const [result, remain] = res.data.split('|');
        checkSmsError(result);
        callback(null, remain);
        return remain;
      })
      .catch(err => {
        callback(err);
      });
  };
}

// FIXME: 실패건 다시 보낼 수 있도록 수정 (템플릿 저장하는 등 분리)
export function sendReports() {
  return (dispatch, getState) => {
    const really = confirm('총 n 명에게 메시지가 발송됩니다. 정말 발송하시겠습니까?');
    if (!really) return;
    const { send, setting } = getState();
    const sourceDir = send.sourceDir;
    const messageTemplateFilePath = path.join(sourceDir, MESSAGE_TEMPLATE_FILE_NAME);
    fs.writeFileSync(messageTemplateFilePath, send.messageTemplateString);

    const planPath = path.join(sourceDir, PLAN_FILE_NAME);
    // 발송 계획 파일 구조 : `app/actions/generate.js` 참고
    const plan = JSON.parse(fs.readFileSync(planPath, { encoding: 'utf-8' }));
    const googleKey = setting.googleApiKey.value;
    const bucket = setting.s3Bucket.value;
    const region = 'ap-northeast-2';
    const host = `https://s3.${region}.amazonaws.com`;
    const accessKeyId = setting.accessKeyId.value;
    const secretAccessKey = setting.secretAccessKey.value;
    const s3 = new S3({
      accessKeyId,
      secretAccessKey,
      s3DisableBodySigning: false,
      region
    });
    const renderer = handlebars.compile(send.messageTemplateString);

    function process(item) {
      const [id, name, school, phone, fileName] = item;
      const html = fs.readFileSync(path.join(sourceDir, fileName));
      const s3LocalPath = `${plan.dt}/${fileName}`;
      const params = {
        Bucket: bucket,
        Body: html,
        Key: s3LocalPath,
        ACL: 'public-read',
        ContentType: 'text/html',
        Expires: addYears(new Date(), 1)
      };
      // HTML 파일 업로드
      new Promise((resolve, reject) => {
        s3.putObject(params, err => {
          if (err) reject(new UploadError(err.toString()));
          else resolve();
        });
      })
      // URL 생성
      .then(() => axios
        .post(`https://www.googleapis.com/urlshortener/v1/url?key=${googleKey}`, {
          longUrl: `${host}/${bucket}/${s3LocalPath}`
        })
        .then(({ data: { id: shortUrl } }) => shortUrl)
        .catch(err => {
          throw new UrlError(err.toString());
        }))
      // 문자 전송 https://www.munjanara.co.kr/_support/web_admin_guide.htm
      .then(shortUrl => new Promise((resolve, reject) => {
        const text = `${renderer({ 이름: name, 원번: id, 학교: school })}\n${shortUrl}`;
        dispatch(sendMessage(phone, text, (err, remain) => {
          if (err) reject(err);
          else resolve({ shortUrl, remain });
        }));
      }))
      .then(({ shortUrl, remain }) => {
        // 성공
        const logMessage = `성공:${id}:${name}:${phone}:${shortUrl}:잔액:${remain}`;
        // 파일1 기록
        fs.appendFile(
          path.join(sourceDir, LOG_FILE_NAME),
          logMessage
        );
        // 파일2 기록
        fs.appendFile(
          path.join(sourceDir, RESULT_RECORD_FILE_NAME),
          `${JSON.stringify([id, 'success'])}\n`
        );
        // UI 업데이트
        dispatch(updateSendLog(id, logMessage));
        return id;
      })
      .catch(err => {
        // 실패
        const logMessage = `실패:${id}:${name}:${phone}:${err.toString()}`;

        // 파일1 기록
        fs.appendFile(
          path.join(sourceDir, LOG_FILE_NAME),
          logMessage
        );
        // 파일2 기록
        fs.appendFile(
          path.join(sourceDir, RESULT_RECORD_FILE_NAME),
          `${JSON.stringify([id, 'fail', err.name])}\n`
        );
        // UI 업데이트
        dispatch(updateSendLog(id, logMessage));
        throw err; // TODO: 괜찮은가?
      });
    }

    let i = 0;
    const task = setInterval(() => {
      if (i >= plan.items.length) {
        clearInterval(task);
        // TODO: 스팸필터에 대한 설명
        dispatch({ type: DONE });
      } else {
        process(plan.items[i]);
        i += 1;
      }
    }, 1111);
  };
}

export function updateTestPhoneNumber(payload) {
  return {
    type: UPDATE_TEST_PHONE_NUMBER,
    payload
  };
}

export function disableSendButton() {
  return {
    type: DISABLE_SEND_BUTTON
  };
}

export function smsTestAndSend() {
  const testString = '한글, English, 1234';
  return (dispatch, getState) => {
    const { send } = getState();
    const receiver = send.testPhoneNumber;
    dispatch(disableSendButton());
    dispatch(sendMessage(receiver, testString, err => {
      if (err) {
        alert(`테스트 문자를 발송하는 도중에 에러가 발생했습니다: ${err.toString()}`);
      } else {
        const goAhead = confirm(`"${testString}"과 같은 문자를 받으셨다면 확인 버튼을 눌러 성적표를 발송하세요. 글자가 이상하게 보이는 등의 문제가 생기면 개발자에게 연락하세요.`);
        if (goAhead) {
          dispatch(closeMessageTemplate());
          dispatch(openSendPage());
          dispatch(sendReports());
        }
      }
    }));
  };
}
