import { remote } from 'electron';
import mkdirp from 'mkdirp';
import path from 'path';
import fs from 'fs';
import { createHash } from 'crypto';

import { newError } from './errorMessage';
import { render } from '../utils/template';
import {
  UPDATE_DEST_DIR
} from '../reducers/generate';
import { nextStep } from '../actions/step';

export function defaultDestDir() {
  return (dispatch, getState) => {
    const { templateForm } = getState();
    const docPath = remote.app.getPath('documents');
    const dir = templateForm.misc.period.value.replace(/[^0-9]/g, '');
    dispatch(updateDestDir(path.join(docPath, 'sms_report', dir)));
  };
}

function updateDestDir(destDir) {
  return {
    type: UPDATE_DEST_DIR,
    payload: destDir
  };
}

function mkdirpPromise(destDir) {
  return new Promise((resolve) => {
    mkdirp(destDir, (err) => {
      if (err) {
        throw err;
      } else {
        resolve(destDir);
      }
    });
  });
}

export function generateReports() {
  return (dispatch, getState) => {
    const { templateForm, stat, generate } = getState();
    const destDir = generate.destDir;
    mkdirpPromise(destDir).then(() => {
      stat.individual.forEach((ind, i) => {
        try {
          const rendered = render(stat, templateForm, i);
          const hashString = createHash('sha256').update(rendered).digest('hex').slice(0, 8);
          const fileName = `${ind.id}_${hashString}.html`;
          fs.writeFileSync(path.join(destDir, fileName), rendered);
        } catch (e) {
          console.log(`error: ${ind.id}`);
          console.error(e);
        }
      });
      dispatch(nextStep()); // FIXME: 에러 볼 수 있도록
      return true;
    }).catch(err => {
      console.error(err);
      dispatch(newError(err.toString()));
    });
  };
}
