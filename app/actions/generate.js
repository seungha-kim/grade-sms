import { remote } from 'electron';
import mkdirp from 'mkdirp';
import path from 'path';
import fs from 'fs';
import { createHash } from 'crypto';
import format from 'date-fns/format';

import { newError } from './errorMessage';
import { render, defaultDestBaseDir } from '../utils/template';
import {
  UPDATE_DEST_DIR,
  UPDATE_GENERATING,
  PROGRESS_GENERATING
} from '../reducers/generate';
import { nextStep } from '../actions/step';
import { PLAN_FILE_NAME } from '../utils/fileNames';

export function defaultDestDir() {
  return (dispatch) => {
    const dir = format(new Date(), 'YYYYMMDDHHmmss');
    dispatch(updateDestDir(path.join(defaultDestBaseDir(), dir)));
  };
}

function updateDestDir(destDir) {
  return {
    type: UPDATE_DEST_DIR,
    payload: destDir
  };
}

export function generateReports() {
  return (dispatch, getState) => {
    dispatch(updateGenerating(true));
    const { templateForm, stat, generate } = getState();
    const destDir = generate.destDir;
    const plan = {
      dt: format(new Date(), 'YYYYMMDDHHmmss'),
      items: []
    };
    mkdirp(destDir, err => {
      if (err) throw err;
      function* iter() {
        for (let i = 0; i < stat.individual.length; i += 1) {
          const ind = stat.individual[i];
          yield new Promise(resolve => {
            setTimeout(() => {
              const rendered = render(stat, templateForm, i);
              const hashString = createHash('sha256').update(rendered).digest('hex').slice(0, 8);
              const fileName = `${ind.id}_${hashString}.html`;
              fs.writeFile(path.join(destDir, fileName), rendered, { encoding: 'utf-8' }, errr => {
                if (errr) throw errr;
                plan.items.push([ind.id, ind.phone, fileName]);
                dispatch({ type: PROGRESS_GENERATING });
                resolve();
              });
            }, 16);
          });
        }
      }
      Promise.all(iter())
        .then(() => new Promise(resolve => {
          fs.writeFile(path.join(destDir, PLAN_FILE_NAME), JSON.stringify(plan), { encoding: 'utf-8' }, errr => {
            if (errr) throw errr;
            dispatch(nextStep());
            resolve();
          });
        }))
        .catch(errr => {
          console.error(errr);
          dispatch(newError(errr.toString()));
        });
      return true;
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
