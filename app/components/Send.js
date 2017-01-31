import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

type Props = {
  open: boolean,
  close: () => void,
  send: () => void
};

export default class Send extends Component {
  props: Props;
  render() {
    const { open, close, send } = this.props;
    const actions = [
      <FlatButton
        label="발송"
        primary
        onTouchTap={send}
      />,
      <FlatButton
        label="취소"
        secondary
        onTouchTap={close}
      />
    ];
    return (<Dialog
      title="성적표 발송"
      open={open}
      modal
      actions={actions}
    >
      발송
    </Dialog>);
  }
}
