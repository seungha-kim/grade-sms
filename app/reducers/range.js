import I from 'immutable';

export const SELECT_FILE = 'SELECT_FILE';

export const UPDATE_RANGE = 'UPDATE_RANGE';

export const UPDATE_RANGE_PREVIEW = 'UPDATE_RANGE_PREVIEW';
export const UPDATE_RANGE_ERROR = 'UPDATE_RANGE_ERROR';

export const ADD_TEST = 'ADD_TEST';
export const REMOVE_TEST = 'REMOVE_TEST';

export const ADD_HOMEWORK = 'ADD_HOMEWORK';
export const REMOVE_HOMEWORK = 'REMOVE_HOMEWORK';

export const RESET_FORM_DATA = 'RESET_FORM_DATA';
export const UPDATE_DATA_VALIDATION = 'UPDATE_DATA_VALIDATION';

export const UPDATE_SHEET_NAMES = 'UPDATE_SHEET_NAMES';
export const UPDATE_SELECTED_SHEET = 'UPDATE_SELECTED_SHEET';

let count = 0;
function newKey() {
  count += 1;
  return count;
}

const defaultRangeField = I.Map({
  range: '',
  errorText: null,
  queried: null,
  loading: false,
  fieldKey: null
});

function newRangeField() {
  return defaultRangeField.set('fieldKey', newKey());
}

function newTestRangeFieldSet() {
  return I.Map({
    fields: I.Map({
      class: newRangeField(),
      attendance: newRangeField(),
      grade: newRangeField(),
    }),
    setKey: newKey()
  });
}

function newHomeworkRangeFieldSet() {
  return I.Map({
    fields: I.Map({
      class: newRangeField(),
      grade: newRangeField(),
    }),
    setKey: newKey()
  });
}

const initialState = I.Map({
  filePath: null,
  dirty: false,
  privacyRangeSet: I.Map({
    name: newRangeField(),
    school: newRangeField(),
    id: newRangeField(),
    phone: newRangeField()
  }),
  testRangeSets: I.List.of(newTestRangeFieldSet()),
  homeworkRangeSets: I.List(),
  allRangesValid: false,
  allDataValid: false,
  dataValidationMessage: '',
  sheetNames: null,
  selectedSheetIndex: null
});

export function traverseAllFields(state, traverseFunction) {
  state.get('privacyRangeSet').forEach(traverseFunction);
  state.get('testRangeSets').forEach(s => s.get('fields').forEach(traverseFunction));
  state.get('homeworkRangeSets').forEach(s => s.get('fields').forEach(traverseFunction));
}

function updateAllFields(state, updateFunction) {
  return state
    .update('privacyRangeSet', rangeSet =>
      rangeSet.map(updateFunction))
    .update('testRangeSets', rangeSets =>
      rangeSets.map(rangeSet =>
        rangeSet.update('fields', fields =>
          fields.map(updateFunction))))
    .update('homeworkRangeSets', rangeSets =>
      rangeSets.map(rangeSet =>
        rangeSet.update('fields', fields =>
          fields.map(updateFunction))));
}

function updateAllFieldsByKey(state, fieldKey, updateFunction) {
  function ifMatchThenUpdate(f) {
    return f.get('fieldKey') === fieldKey ? f.update(updateFunction) : f;
  }
  return updateAllFields(state, ifMatchThenUpdate);
}

function validateRanges(state) {
  let valid = true;
  traverseAllFields(state, f => {
    valid = valid && !f.get('loading') && f.get('errorText') == null && f.get('range') !== '';
  });
  return state.set('allRangesValid', valid);
}

export default function xlsx(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case RESET_FORM_DATA:
      return initialState;
    case SELECT_FILE:
      return state
        .set('filePath', payload)
        .set('selectedSheetIndex', null);
    case UPDATE_RANGE:
      return updateAllFieldsByKey(state, payload.fieldKey, field => (
        field
          .set('range', payload.range)
          .set('loading', true)
          .set('errorText', undefined)
      )).set('dirty', true).set('allRangesValid', false);
    case UPDATE_RANGE_PREVIEW:
      return updateAllFieldsByKey(state, payload.fieldKey, field => (
        field
          .set('queried', payload.queried)
          .set('loading', false)
          .set('errorText', undefined)
      )).update(validateRanges);
    case UPDATE_RANGE_ERROR:
      return updateAllFieldsByKey(state, payload.fieldKey, field => (
        field
          .set('queried', undefined)
          .set('errorText', payload.errorText)
          .set('loading', false)
      ));
    case ADD_TEST:
      return state.update('testRangeSets', trs => trs.push(newTestRangeFieldSet())).set('allRangesValid', false);
    case REMOVE_TEST:
      return state.update('testRangeSets', trs => trs.filter(f => f.get('setKey') !== payload)).update(validateRanges);
    case ADD_HOMEWORK:
      return state.update('homeworkRangeSets', hrs => hrs.push(newHomeworkRangeFieldSet())).set('allRangesValid', false);
    case REMOVE_HOMEWORK:
      return state.update('homeworkRangeSets', hrs => hrs.filter(f => f.get('setKey') !== payload)).update(validateRanges);
    case UPDATE_DATA_VALIDATION:
      return state
        .set('dataValidationMessage', payload.dataValidationMessage)
        .set('allDataValid', payload.allDataValid);
    case UPDATE_SHEET_NAMES:
      return state.set('sheetNames', payload);
    case UPDATE_SELECTED_SHEET:
      return state.set('selectedSheetIndex', payload);
    default:
      return state;
  }
}
