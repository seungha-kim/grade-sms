// @flow
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { shell, remote } from 'electron';

import HelpText from './HelpText';
import cs from './commonStyles.css';
import s from './GenerateDone.css';
import {
  PLAN_FILE_NAME
} from '../utils/fileNames';

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
        <code style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => shell.openItem(destDir)}>{destDir}</code> 폴더에 발송 계획 파일({PLAN_FILE_NAME}) 및 성적표를 생성했습니다. <br />
        발송 계획 파일은 최초 발송 및 발송 재시도 시 사용되는 데이터 파일입니다. <br />
        폴더의 이름은 바뀌어도 괜찮으나, 폴더 안의 파일 이름이나 파일 내용이 바뀌면 발송 시 오류가 생길 수 있습니다. <br />
        성적표 파일 이름은 <code>&lt;원번&gt;_&lt;난수&gt;.html</code>과 같은 형식을 따릅니다. <br />
      </HelpText>
      <div className={cs.buttonWrap}>
        <RaisedButton label="발송" primary onClick={() => alert('제작중')} />
        <RaisedButton label="닫기" secondary onClick={() => remote.getCurrentWindow().close()} />
      </div>
    </div>);
  }
}
