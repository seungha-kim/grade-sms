// @flow
import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { grey700 } from 'material-ui/styles/colors';
import CircularProgress from 'material-ui/CircularProgress';

import s from './DataRangeField.css';

type Props = {
  queried: ?string,
  loading: boolean
};

export default class DataRangeField extends Component {
  fileInput = null;

  props: Props;

  render() {
    const { queried, loading, ...remain } = this.props;
    return (
      <div className={s.wrap}>
        <TextField
          floatingLabelStyle={{ color: grey700 }}
          {...remain}
        />
        {loading
          ? <CircularProgress className={s.progress} size={20} />
          : <div className={s.queried}>{queried}</div>}
      </div>
    );
  }
}

