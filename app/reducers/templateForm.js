import I from 'immutable';

export const INITIALIZE_TEMPLATE_DATA = 'INITIALIZE_TEMPLATE_DATA';
export const UPDATE_TEMPLATE_FIELD_BY_KEY = 'UPDATE_TEMPLATE_FIELD_BY_KEY';

let count = 0;

function newKey() {
  count += 1;
  return count;
}

class Field extends I.Record({
  value: '',
  fieldKey: null
}) {}

function newField() {
  return new Field({
    fieldKey: newKey()
  });
}

class TestFieldSet extends I.Record({
  number: null, // Field
  name: null, // Field
  setKey: null
}) {}

function newTestFieldSet() {
  return new TestFieldSet({
    number: newField(),
    name: newField(),
    setKey: newKey()
  });
}

class HomeworkFieldSet extends I.Record({
  number: null, // Field
  name: null, // Field
  setKey: null
}) {}

function newHomeworkFieldSet() {
  return new HomeworkFieldSet({
    number: newField(),
    name: newField(),
    setKey: newKey()
  });
}

class MiscFieldSet extends I.Record({
  title: newField(), // invariant field
  period: newField(), // invariant field
  notice: newField(), // invariant field
}) {}

export class TemplateForm extends I.Record({
  misc: new MiscFieldSet(),
  tests: null,
  homeworks: null
}) {
  updateFieldByKey(fieldKey: number, newValue: string) {
    function ifMatchThenUpdate(f: Field) {
      return f.fieldKey === fieldKey
        ? f.set('value', newValue)
        : f;
    }
    return this
      .update('misc', misc => misc.map(ifMatchThenUpdate))
      .update('tests', tests => tests.map(t => t
        .update('number', ifMatchThenUpdate)
        .update('name', ifMatchThenUpdate)))
      .update('homeworks', homeworks => homeworks.map(h => h
        .update('number', ifMatchThenUpdate)
        .update('name', ifMatchThenUpdate)));
  }
}

function newState(numOfTest, numOfHomework) {
  const tests = [];
  for (let i = 0; i < numOfTest; i += 1) {
    tests.push(newTestFieldSet());
  }
  const homeworks = [];
  for (let i = 0; i < numOfHomework; i += 1) {
    homeworks.push(newHomeworkFieldSet());
  }
  return new TemplateForm({
    tests: I.List(tests),
    homeworks: I.List(homeworks)
  });
}

export default function templateDate(state = null, { type, payload }) {
  switch (type) {
    case INITIALIZE_TEMPLATE_DATA:
      return newState(payload.numOfTest, payload.numOfHomework);
    case UPDATE_TEMPLATE_FIELD_BY_KEY:
      return state.updateFieldByKey(payload.fieldKey, payload.value);
    default:
      return state;
  }
}
