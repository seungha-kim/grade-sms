// @flow
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

import HelpText from './HelpText';
import cs from './commonStyles.css';
import s from './GenerateDone.css';

type Props = {
  destDir: string,
  send: () => void,
  close: () => void
};

export default class GenerateDone extends Component {
  props: Props;
  render() {
    const { destDir, send, close } = this.props;
    return (<div className={s.wrap}>
      <HelpText className={s.content}>
        {destDir} 폴더에 발송 계획 파일 및 성적표를 생성했습니다. <br />
        성적표 파일 이름은 <code>&lt;원번&gt;_&lt;난수&gt;.html</code>과 같습니다. <br />
      </HelpText>
      <div className={cs.buttonWrap}>
        <RaisedButton label="발송" primary onClick={send} />
        <RaisedButton label="닫기" secondary onClick={close} />
      </div>
    </div>);
  }
}
