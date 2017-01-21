// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import counter from './counter';
import step from './step';
import formData from './formData';
import errorMessage from './errorMessage';

const rootReducer = combineReducers({
  counter,
  routing,
  step,
  formData,
  errorMessage
});

export default rootReducer;
