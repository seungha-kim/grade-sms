// @flow
import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import s from './SelectFileForm.css';
import cs from './commonStyles.css';

import HelpText from './HelpText';

type Props = {
  showOpenDialog: () => void,
  nextStep: () => void,
  filePath: ?string
};

export default class SelectFileForm extends Component {
  fileInput = null;

  props: Props;

  render() {
    const { showOpenDialog, nextStep, filePath } = this.props;
    return (
      <div className={s.wrap}>
        <div className={s.content}>
          <HelpText>
            성적표 생성에 사용될 엑셀 파일을 선택하는 과정입니다. <br />
            아래 빈 칸을 클릭해서 엑셀 파일을 선택하세요.
          </HelpText>
          <TextField
            hintText="여기를 클릭해 엑셀 파일을 선택하세요..."
            value={filePath || ''}
            onClick={showOpenDialog}
            fullWidth
          />
        </div>
        <div className={cs.buttonWrap}>
          <RaisedButton label="다음" primary disabled={filePath == null} onClick={nextStep} />
        </div>
      </div>
    );
  }
}
