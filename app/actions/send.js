import { remote } from 'electron';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import { TextEncoder } from 'text-encoding';

import {
  UPDATE_SOURCE_DIR,
  UPDATE_SOURCE_DIR_ERROR_TEXT,
  UPDATE_TEMPLATE_STRING
} from '../reducers/send';

const encoder = new TextEncoder('euc-kr', { NONSTANDARD_allowLegacyEncoding: true });

/*
    plan.json 구조 (`app/actions/generate.js` 참고)
    const items = [
      [id, phone, fileName]
    ]
    const plan = {
      dt: format(new Date(), 'YYYYMMDDHHmmss'),
      items
    };
*/
export function showOpenDialog() {
  return (dispatch) => {
    try {
      console.log('showOpenDialog start');
      const [dir] = remote.dialog.showOpenDialog({ properties: ['openDirectory'] });
      const planPath = path.join(dir, 'plan.json');
      const parsed = JSON.parse(fs.readFileSync(planPath, { encoding: 'utf-8' }));
      const files = fs.readdirSync(dir);
      const matched = parsed.items.every(([, , fileName]) => files.includes(fileName));
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
