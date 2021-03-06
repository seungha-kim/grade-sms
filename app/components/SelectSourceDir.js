import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { defaultDestBaseDir } from '../utils/template';

import HelpText from './HelpText';

type Props = {
  open: boolean,
  close: () => void,
  next: () => void,
  showOpenDialog: () => void,
  sourceDir: ?string,
  errorText: ?string
};

export default class SelectSourceDir extends Component {
  props: Props;
  render() {
    const { open, close, next, sourceDir, showOpenDialog, errorText } = this.props;
    const actions = [
      <FlatButton
        label="취소"
        secondary
        onTouchTap={close}
      />,
      <FlatButton
        label="다음"
        primary
        onTouchTap={next}
        disabled={sourceDir == null}
      />
    ];
    return (<Dialog
      title="성적표 폴더 선택"
      open={open}
      modal
      actions={actions}
    >
      <HelpText>
        이전 단계에서 생성된 성적표가 들어있는 폴더를 선택해 주세요. <br />
        (성적표 생성 시 경로를 변경하지 않았다면 <code>{defaultDestBaseDir()}</code> 안에 있습니다.) <br />
        이미 입력칸이 채워져있으면 다음 버튼을 누르시면 됩니다.
      </HelpText>
      <TextField
        floatingLabelText="성적표 폴더"
        onClick={showOpenDialog}
        value={sourceDir || ''}
        style={{ width: '100%' }}
        errorText={errorText}
      />
    </Dialog>);
  }
}
