// @flow
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { shell, remote } from 'electron';

import HelpText from './HelpText';
import cs from './commonStyles.css';
import s from './GenerateDone.css';

type Props = {
  destDir: string
  // send: () => void
};

export default class GenerateDone extends Component {
  props: Props;
  render() {
    const { destDir } = this.props;
    return (<div className={s.wrap}>
      <HelpText className={s.content}>
        <code style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => shell.openItem(destDir)}>{destDir}</code> 폴더에 발송 계획 파일 및 성적표를 생성했습니다. <br />
        파일 이름은 <code>&lt;원번&gt;_&lt;난수&gt;.html</code>과 같은 형식을 따릅니다. <br />
      </HelpText>
      <div className={cs.buttonWrap}>
        <RaisedButton label="발송" primary onClick={() => alert('제작중')} />
        <RaisedButton label="닫기" secondary onClick={() => remote.getCurrentWindow().close()} />
      </div>
    </div>);
  }
}
