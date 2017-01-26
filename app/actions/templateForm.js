/*
- no validation needed
- no add & remove of fields needed
*/

import {
  INITIALIZE_TEMPLATE_DATA,
  UPDATE_TEMPLATE_FIELD_BY_KEY,
  PREVIEW_NEXT_STUDENT,
  PREVIEW_PREVIOUS_STUDENT
} from '../reducers/templateForm';

export function initializeTemplateDataFromRange() {
  return (dispatch, getState) => {
    const { range, stat: { individual } } = getState();
    dispatch(initializeTemplateData(
      range.get('testRangeSets').size,
      range.get('homeworkRangeSets').size,
      individual.length
    ));
  };
}

export function initializeTemplateData(numOfTest, numOfHomework, numOfStudents) {
  return {
    type: INITIALIZE_TEMPLATE_DATA,
    payload: { numOfTest, numOfHomework, numOfStudents }
  };
}

export function updateTemplateFieldByKey(fieldKey, value) {
  return {
    type: UPDATE_TEMPLATE_FIELD_BY_KEY,
    payload: { fieldKey, value }
  };
}

export function previewNextStudent() {
  return {
    type: PREVIEW_NEXT_STUDENT
  };
}

export function previewPreviousStudent() {
  return {
    type: PREVIEW_PREVIOUS_STUDENT
  };
}
