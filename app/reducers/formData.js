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
  nameRange: newRangeField(),
  schoolRange: newRangeField(),
  idRange: newRangeField(),
  phoneRange: newRangeField(),
  testRangeSets: I.List.of(newTestRangeFieldSet()),
  homeworkRangeSets: I.List()
});

function updateByInstanceKey(state, fieldKey, updateFunction) {
  let intermediate = state;
  [
    'nameRange',
    'schoolRange',
    'idRange',
    'phoneRange'
  ].forEach(fieldName => {
    if (intermediate.get(fieldName).get('fieldKey') === fieldKey) {
      intermediate = intermediate.update(fieldName, updateFunction);
    }
  });
  return intermediate
    .update('testRangeSets', rangeSets =>
      rangeSets.map(rangeSet =>
        rangeSet.update('fields', fields =>
          fields.map(rangeField => (
            rangeField.get('fieldKey') === fieldKey
            ? rangeField.update(updateFunction)
            : rangeField))
        )))
    .update('homeworkRangeSets', rangeSets =>
      rangeSets.map(rangeSet =>
        rangeSet.update('fields', fields =>
          fields.map(rangeField => (
            rangeField.get('fieldKey') === fieldKey
            ? rangeField.update(updateFunction)
            : rangeField))
        )));
}

export default function xlsx(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SELECT_FILE:
      return state.set('filePath', payload);
    case UPDATE_RANGE:
      return updateByInstanceKey(state, payload.fieldKey, field => (
        field
          .set('range', payload.range)
          .set('loading', true)
      ));
    case UPDATE_RANGE_PREVIEW:
      return updateByInstanceKey(state, payload.fieldKey, field => (
        field
          .set('queried', payload.queried)
          .set('loading', false)
      ));
    case UPDATE_RANGE_ERROR:
      return updateByInstanceKey(state, payload.fieldKey, field => (
        field
          .set('errorText', payload.errorText)
          .set('loading', false)
      ));
    case ADD_TEST:
      return state.update('testRangeSets', trl => trl.push(newTestRangeFieldSet()));
    case REMOVE_TEST:
      return state.update('testRangeSets', trl => trl.filter(f => f.get('setKey') !== payload));
    default:
      return state;
  }
}
