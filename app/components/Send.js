import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import LinearProgress from 'material-ui/LinearProgress';
import FlatButton from 'material-ui/FlatButton';
import { shell } from 'electron';

type Props = {
  open: boolean,
  close: () => void,
  send: () => void,
  log: ?{id: string, text: string},
  done: boolean
};

const logBoxStyle = {
  whiteSpace: 'pre-wrap',
  padding: '20px',
  backgroundColor: '#ccc',
  height: '300px',
  overflowY: 'auto'
};

export default class Send extends Component {
  componentWillReceiveProps({ log }) {
    if (log != null && this.logBox != null) {
      if (
        this.props.log == null
        || log.id !== this.props.log.id
      ) {
        const logEl = document.createElement('div');
        logEl.textContent = log.text;
        this.logBox.appendChild(logEl);
        this.logBox.scrollTop = this.logBox.scrollHeight;
      }
    }
  }

  props: Props;

  render() {
    const { open, done } = this.props;
    const actions = [
      <FlatButton
        label="멈추기"
        secondary
        onTouchTap={() => {}}
      />,
      <FlatButton
        label="완료"
        primary
        disabled={!done}
        onTouchTap={() => {}}
      />
    ];
    return (<Dialog
      title="성적표 발송"
      open={open}
      modal
      actions={actions}
    >
      <div>23 / 1000 예상시간: (1111 * n / 60) 분</div>
      <LinearProgress mode="determinate" value={23} />
      <div style={logBoxStyle} ref={el => { this.logBox = el; }}>
        <div>010-6330-3082 김승하(12345) <a style={{ textDecoration: 'underline' }} onClick={() => { shell.openExternal('https://goo.gl/oEx6gx'); }}>goo.gl/oEx6gx</a> 발송 완료</div>
        <div>010-6330-3082 김승하(12345) <a onClick={() => { shell.openExternal('https://goo.gl/oEx6gx'); }}>goo.gl/oEx6gx</a> 발송 완료</div>
        <div>010-6330-3082 김승하(12345) <a onClick={() => { shell.openExternal('https://goo.gl/oEx6gx'); }}>goo.gl/oEx6gx</a> 발송 완료</div>
        <div>010-6330-3082 김승하(12345) <a onClick={() => { shell.openExternal('https://goo.gl/oEx6gx'); }}>goo.gl/oEx6gx</a> 발송 완료</div>
        <div>010-6330-3082 김승하(12345) 에러 : 업로드 실패</div>
      </div>
    </Dialog>);
  }
}
