import { UPDATE_SOURCE_DIR } from '../reducers/send';

export function updateSourceDir(sourceDir) {
  return {
    type: UPDATE_SOURCE_DIR,
    payload: sourceDir
  };
}
