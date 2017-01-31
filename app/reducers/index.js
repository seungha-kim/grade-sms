// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import counter from './counter';
import step from './step';
import range from './range';
import errorMessage from './errorMessage';
import stat from './stat';
import templateForm from './templateForm';
import generate from './generate';
import subPage from './subPage';
import setting from './setting';

const rootReducer = combineReducers({
  counter,
  routing,
  step,
  range,
  errorMessage,
  stat,
  templateForm,
  generate,
  subPage,
  setting
});

export default rootReducer;
