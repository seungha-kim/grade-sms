// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import counter from './counter';
import step from './step';
import range from './range';
import errorMessage from './errorMessage';
import stat from './stat';
import templateForm from './templateForm';

const rootReducer = combineReducers({
  counter,
  routing,
  step,
  range,
  errorMessage,
  stat,
  templateForm
});

export default rootReducer;
