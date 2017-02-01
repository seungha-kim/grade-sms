// @flow
import { Record } from 'immutable';

export const INITIALIZE_SETTING = 'INITIALIZE_SETTING';
export const UPDATE_SETTING_FIELD_VALUE = 'UPDATE_FIELD_VALUE';
export const UPDATE_SETTING_LOADING = 'UPDATE_SETTING_LOADING';
export const UPDATE_SETTING_VALIDITY = 'UPDATE_SETTING_VALIDITY';

export class Field extends Record({
  value: null,
  errorText: null,
}) {
  value: ?string;
  errorText: ?string;
  valid() {
    return this.value != null && this.errorText == null;
  }
}

export class SettingState extends Record({
  s3Bucket: new Field(),
  accessKeyId: new Field(),
  secretAccessKey: new Field(),
  googleApiKey: new Field(),
  munjanaraId: new Field(),
  munjanaraPassword: new Field(),
  loading: false
}) {
  s3Bucket: Field;
  accessKeyId: Field;
  secretAccessKey: Field;
  googleApiKey: Field;
  munjanaraId: Field;
  munjanaraPassword: Field;
  loading: boolean;
  valid() {
    return (
      this.s3Bucket.valid()
      && this.accessKeyId.valid()
      && this.secretAccessKey.valid()
      && this.googleApiKey.valid()
      && this.munjanaraId.valid()
      && this.munjanaraPassword.valid()
    );
  }
}

const initialState = new SettingState();

export default function step(state: SettingState = initialState, action: any) {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_SETTING_FIELD_VALUE:
      return state.update(payload.field, f => f.set('value', payload.value));
    case INITIALIZE_SETTING:
      return Object.entries(payload)
        .reduce((s: SettingState, [field, value]) => s.update(field, f => f.set('value', value)), state);
    case UPDATE_SETTING_LOADING:
      return state.set('loading', true);
    case UPDATE_SETTING_VALIDITY:
      return Object.entries(payload)
        .reduce((s: SettingState, [field, errorText]) => s.update(field, f => f.set('errorText', errorText)), state)
        .set('loading', false);
    default:
      return state;
  }
}
