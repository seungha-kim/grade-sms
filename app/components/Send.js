import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import LinearProgress from 'material-ui/LinearProgress';
import FlatButton from 'material-ui/FlatButton';

type Props = {
  open: boolean,
  close: () => void,
  log: ?{id: string, text: string},
  done: boolean,
  total: ?number,
  count: number,
  cancel: () => void
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
    const { open, close, cancel, done, total, count } = this.props;
    const actions = [
      <FlatButton
        label="멈추기"
        secondary
        onTouchTap={cancel}
        disabled={done}
      />,
      <FlatButton
        label="완료"
        primary
        disabled={!done}
        onTouchTap={close}
      />
    ];
    const remain = (total == null) ? '-' : `${(1.111 * (total - count) * 0.016).toFixed(0)}분`;
    return (<Dialog
      title="성적표 발송"
      open={open}
      modal
      actions={actions}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>{count} / {total}</div>
        <div>남은 예상시간: {remain}</div>
      </div>
      <LinearProgress mode="determinate" value={count} max={total} />
      <div style={logBoxStyle} ref={el => { this.logBox = el; }} />
    </Dialog>);
  }
}
