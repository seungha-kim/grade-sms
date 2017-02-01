import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

type Props = {
  open: boolean,
  close: () => void,
  send: () => void
};

export default class selectSourceDir extends Component {
  props: Props;
  render() {
    const { open, close, send } = this.props;
    const actions = [
      <FlatButton
        label="취소"
        secondary
        onTouchTap={close}
      />,
      <FlatButton
        label="발송"
        primary
        onTouchTap={send}
      />
    ];
    return (<Dialog
      title="성적표 폴더 선택"
      open={open}
      modal
      actions={actions}
    >
      발송
    </Dialog>);
  }
}
