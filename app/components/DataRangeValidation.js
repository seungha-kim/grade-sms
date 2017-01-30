// @flow
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import type { Map as IMap } from 'immutable';

import HelpText from './HelpText';
import cs from './commonStyles.css';

type Props = {
  formData: IMap<string, any>,
  nextStep: () => void,
  previousStep: () => void,
  revalidate: () => void
};

export default class DataRangeValidation extends Component {
  props: Props;

  render() {
    const { formData, nextStep, previousStep, revalidate } = this.props;
    return (<div>
      <HelpText>
        앞에서 입력한 범위에 대한 데이터의 검사 결과입니다. <br />
        [다음] 버튼이 회색이면 해결해야할 오류가 있다는 뜻입니다.<br />
        문제가 없다면 다음 버튼을 눌러주세요.
      </HelpText>
      <pre style={{ backgroundColor: '#eee', padding: 20 }}>{formData.get('dataValidationMessage')}</pre>
      <div className={cs.buttonWrap}>

        <RaisedButton label="뒤로" secondary onClick={previousStep} />
        <RaisedButton label="재검사" primary onClick={revalidate} />
        <RaisedButton label="다음" primary disabled={!formData.get('allDataValid')} onClick={nextStep} />
      </div>
    </div>);
  }
}
