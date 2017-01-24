// @flow
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import type { Map as IMap } from 'immutable';

type Props = {
  formData: IMap<string, any>,
  nextStep: () => void,
  previousStep: () => void
};

export default class DataRangeValidation extends Component {
  props: Props;

  render() {
    const { formData, nextStep, previousStep } = this.props;
    return (<div>
      <p>참고해라</p>
      <pre style={{ backgroundColor: '#eee', padding: 20 }}>{formData.get('dataValidationMessage')}</pre>
      <RaisedButton label="뒤로" secondary onClick={previousStep} />
      <RaisedButton label="다음" primary disabled={!formData.get('allDataValid')} onClick={nextStep} />
    </div>);
  }
}
