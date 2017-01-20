// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import counter from './counter';
import step from './step';
import xlsx from './xlsx';
import errorMessage from './errorMessage';

const rootReducer = combineReducers({
  counter,
  routing,
  step,
  xlsx,
  errorMessage
});

export default rootReducer;
