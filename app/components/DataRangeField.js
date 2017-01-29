// @flow
import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { grey700 } from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';
import type { Map as IMap } from 'immutable';

import s from './DataRangeField.css';

type Props = {
  fieldData: IMap<string, any>,
  updateRangeThunk: (string, string) => void,
};

export default class DataRangeField extends Component {
  props: Props;
  render() {
    const { fieldData, updateRangeThunk, ...remain } = this.props;
    return (
      <div className={s.wrap}>
        <TextField
          floatingLabelStyle={{ color: grey700 }}
          errorText={fieldData.get('errorText')}
          value={fieldData.get('range')}
          onChange={e => updateRangeThunk(fieldData.get('fieldKey'), e.target.value)}
          {...remain}
        />
        {fieldData.get('loading')
          ? <CircularProgress className={s.progress} size={20} />
          : <div className={s.queried}>{fieldData.get('queried')}</div>}
      </div>
    );
  }
}

