/*
- no validation needed
- no add & remove of fields needed
*/

import {
  INITIALIZE_TEMPLATE_DATA,
  UPDATE_TEMPLATE_FIELD_BY_KEY
} from '../reducers/templateForm';

export function initializeTemplateDataFromRange() {
  return (dispatch, getState) => {
    const { range } = getState();
    dispatch(initializeTemplateData(
      range.get('testRangeSets').size,
      range.get('homeworkRangeSets').size
    ));
  };
}

export function initializeTemplateData(numOfTest, numOfHomework) {
  return {
    type: INITIALIZE_TEMPLATE_DATA,
    payload: { numOfTest, numOfHomework }
  };
}

export function updateTemplateFieldByKey(fieldKey, value) {
  return {
    type: UPDATE_TEMPLATE_FIELD_BY_KEY,
    payload: { fieldKey, value }
  };
}
