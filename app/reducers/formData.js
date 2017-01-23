import I from 'immutable';

export const SELECT_FILE = 'SELECT_FILE';

export const UPDATE_RANGE = 'UPDATE_RANGE';

export const UPDATE_RANGE_PREVIEW = 'UPDATE_RANGE_PREVIEW';
export const UPDATE_RANGE_ERROR = 'UPDATE_RANGE_ERROR';

export const ADD_TEST = 'ADD_TEST';
export const REMOVE_TEST = 'REMOVE_TEST';

export const ADD_HOMEWORK = 'ADD_HOMEWORK';
export const REMOVE_HOMEWORK = 'REMOVE_HOMEWORK';

const defaultRangeField = I.Map({
  range: '',
  errorText: null,
  queried: null,
  loading: false,
  fieldKey: null
});

function newRangeField() {
  return defaultRangeField.set('fieldKey', Math.random());
}

function newTestRangeFieldSet() {
  return I.Map({
    fields: I.Map({
      class: newRangeField(),
      attendance: newRangeField(),
      grade: newRangeField(),
    }),
    setKey: Math.random()
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
  homeworkRanges: I.List(),
  allRangesValid: false
});

export function traverseAllFields(state, traverseFunction) {
  state.get('privacyRangeSet').forEach(traverseFunction);
  state.get('testRangeSets').forEach(s => s.get('fields').forEach(traverseFunction));
  state.get('homeworkRanges').forEach(traverseFunction);
}

function updateAllFields(state, updateFunction) {
  return state
    .update('privacyRangeSet', rangeSet =>
      rangeSet.map(updateFunction))
    .update('testRangeSets', rangeSets =>
      rangeSets.map(rangeSet =>
        rangeSet.update('fields', fields =>
          fields.map(updateFunction))))
    .update('homeworkRanges', ranges =>
      ranges.map(updateFunction));
}

function updateAllFieldsByKey(state, fieldKey, updateFunction) {
  let valid = true;
  function ifMatchThenUpdate(f) {
    const newField = f.get('fieldKey') === fieldKey ? f.update(updateFunction) : f;
    valid = valid && !newField.get('loading') && newField.get('errorText') == null && newField.get('range') !== '';
    return newField;
  }
  return updateAllFields(state, ifMatchThenUpdate).set('allRangesValid', valid);
}

export default function xlsx(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SELECT_FILE:
      return state.set('filePath', payload);
    case UPDATE_RANGE:
      return updateAllFieldsByKey(state, payload.fieldKey, field => (
        field
          .set('range', payload.range)
          .set('loading', true)
          .set('errorText', undefined)
      )).set('dirty', true);
    case UPDATE_RANGE_PREVIEW:
      return updateAllFieldsByKey(state, payload.fieldKey, field => (
        field
          .set('queried', payload.queried)
          .set('loading', false)
          .set('errorText', undefined)
      ));
    case UPDATE_RANGE_ERROR:
      return updateAllFieldsByKey(state, payload.fieldKey, field => (
        field
          .set('queried', undefined)
          .set('errorText', payload.errorText)
          .set('loading', false)
      ));
    case ADD_TEST:
      return state.update('testRangeSets', trl => trl.push(newTestRangeFieldSet()));
    case REMOVE_TEST:
      return state.update('testRangeSets', trl => trl.filter(f => f.get('setKey') !== payload));
    case ADD_HOMEWORK:
      return state.update('homeworkRanges', r => r.push(newRangeField()));
    case REMOVE_HOMEWORK:
      return state.update('homeworkRanges', hr => hr.filter(f => f.get('fieldKey') !== payload));
    default:
      return state;
  }
}
