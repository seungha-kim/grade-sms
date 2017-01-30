import { remote } from 'electron';
import mkdirp from 'mkdirp';
import path from 'path';
import fs from 'fs';
import { createHash } from 'crypto';
import format from 'date-fns/format';
import { newError } from './errorMessage';
import { render } from '../utils/template';
import {
  UPDATE_DEST_DIR,
  UPDATE_GENERATING,
  PROGRESS_GENERATING
} from '../reducers/generate';
import { nextStep } from '../actions/step';

export function defaultDestDir() {
  return (dispatch) => {
    const docPath = remote.app.getPath('documents');
    const dir = format(new Date(), 'YYYYMMDDHHmmss');
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
    dispatch(updateGenerating(true));
    const { templateForm, stat, generate } = getState();
    const destDir = generate.destDir;
    mkdirpPromise(destDir).then(() => {
      function* iter() {
        for (let i = 0; i < stat.individual.length; i += 1) {
          yield new Promise((resolve, reject) => {
            setTimeout(() => {
              const rendered = render(stat, templateForm, i);
              const hashString = createHash('sha256').update(rendered).digest('hex').slice(0, 8);
              const fileName = `${stat.individual[i].id}_${hashString}.html`;
              fs.writeFile(path.join(destDir, fileName), rendered, { encoding: 'utf-8' }, err => {
                if (err) reject(err);
                console.log(`generated: ${fileName}`);
                dispatch({ type: PROGRESS_GENERATING });
                resolve();
              });
            }, 16);
          });
        }
      }
      Promise.all(iter())
        .then(() => {
          dispatch(nextStep());
          return true;
        })
        .catch(err => {
          console.error(err);
          dispatch(newError(err.toString()));
        });
      return true;
    }).catch(err => {
      console.error(err);
      dispatch(newError(err.toString()));
    });
  };
}

export function showFolderSelectDialog() {
  return (dispatch) => {
    const [dir] = remote.dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (dir != null) {
      dispatch(updateDestDir(dir));
    }
  };
}

export function updateGenerating(value: boolean) {
  return {
    type: UPDATE_GENERATING,
    payload: value
  };
}
