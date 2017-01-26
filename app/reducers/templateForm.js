// @flow
import {
  Record as IRecord,
  List as IList
} from 'immutable';

export const INITIALIZE_TEMPLATE_DATA = 'INITIALIZE_TEMPLATE_DATA';
export const UPDATE_TEMPLATE_FIELD_BY_KEY = 'UPDATE_TEMPLATE_FIELD_BY_KEY';
export const PREVIEW_NEXT_STUDENT = 'PREVIEW_NEXT_STUDENT';
export const PREVIEW_PREVIOUS_STUDENT = 'PREVIEW_PREVIOUS_STUDENT';

let count = 0;

function newKey() {
  count += 1;
  return count;
}

class Field extends IRecord({
  value: '',
  fieldKey: null,
  required: false,
  errorText: null
}) {
  value: string;
  fieldKey: number;
  required: boolean;
  errorText: ?string;
}

function newField(values: any) {
  return new Field(Object.assign({}, {
    fieldKey: newKey()
  }, values));
}

class TestFieldSet extends IRecord({
  number: null,
  name: null,
  setKey: null
}) {
  number: Field;
  name: Field;
  setKey: number;
}

function newTestFieldSet() {
  return new TestFieldSet({
    number: newField({ required: true }),
    name: newField({ required: true }),
    setKey: newKey()
  });
}

class HomeworkFieldSet extends IRecord({
  number: null,
  name: null,
  setKey: null
}) {
  number: Field;
  name: Field;
  setKey: number;
}

function newHomeworkFieldSet() {
  return new HomeworkFieldSet({
    number: newField({ required: true }),
    name: newField({ required: true }),
    setKey: newKey()
  });
}

class MiscFieldSet extends IRecord({
  title: newField({ required: true }), // invariant field
  period: newField({ required: true }), // invariant field
  notice: newField(), // invariant field
}) {
  title: Field;
  period: Field;
  notice: Field;
}

export class TemplateForm extends IRecord({
  misc: new MiscFieldSet(),
  tests: null,
  homeworks: null,
  allFieldsValid: false,
  numOfStudents: 0,
  currentIndex: 0,
}) {
  misc: MiscFieldSet;
  tests: IList<TestFieldSet>;
  homeworks: IList<HomeworkFieldSet>;
  allFieldsValid: boolean;
  numOfStudents: number;
  currentIndex: number;

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

  forEach(traverseFunction: (Field) => any) {
    this.misc.forEach(traverseFunction);
    this.tests.forEach(ts => {
      traverseFunction(ts.number);
      traverseFunction(ts.name);
    });
    this.homeworks.forEach(hs => {
      traverseFunction(hs.number);
      traverseFunction(hs.name);
    });
  }

  updateValidity() {
    let valid = true;
    this.forEach(f => {
      if (f.required) {
        valid = valid && f.value !== '';
      }
    });
    return this.set('allFieldsValid', valid);
  }
}

function newState(numOfTest, numOfHomework, numOfStudents) {
  const tests = [];
  for (let i = 0; i < numOfTest; i += 1) {
    tests.push(newTestFieldSet());
  }
  const homeworks = [];
  for (let i = 0; i < numOfHomework; i += 1) {
    homeworks.push(newHomeworkFieldSet());
  }
  return new TemplateForm({
    tests: IList(tests),
    homeworks: IList(homeworks),
    numOfStudents
  });
}

export default function templateDate(state: ?TemplateForm = null, { type, payload }: any) {
  switch (type) {
    case INITIALIZE_TEMPLATE_DATA:
      return newState(payload.numOfTest, payload.numOfHomework, payload.numOfStudents);
    case UPDATE_TEMPLATE_FIELD_BY_KEY:
      if (state != null && payload.fieldKey != null && payload.value != null) {
        return state.updateFieldByKey(payload.fieldKey, payload.value).updateValidity();
      }
      return state;
    case PREVIEW_NEXT_STUDENT:
      if (state == null) return null;
      if (state.currentIndex >= state.numOfStudents - 1) return state;
      return state.update('currentIndex', i => i + 1);
    case PREVIEW_PREVIOUS_STUDENT:
      if (state == null) return null;
      if (state.currentIndex <= 0) return state;
      return state.update('currentIndex', i => i - 1);
    default:
      return state;
  }
}
