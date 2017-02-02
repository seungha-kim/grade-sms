import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import LinearProgress from 'material-ui/LinearProgress';
import FlatButton from 'material-ui/FlatButton';

type Props = {
  open: boolean,
  close: () => void,
  send: () => void,
  log: ?{id: string, text: string},
  done: boolean,
  total: ?number
};

const logBoxStyle = {
  whiteSpace: 'pre-wrap',
  padding: '20px',
  backgroundColor: '#ccc',
  height: '300px',
  overflowY: 'auto'
};

export default class Send extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }
  componentWillReceiveProps({ log }) {
    if (log != null && this.logBox != null) {
      if (
        this.props.log == null
        || log.id !== this.props.log.id
      ) {
        this.setState(({ count }) => ({ count: count + 1 }));
        const logEl = document.createElement('div');
        logEl.textContent = log.text;
        this.logBox.appendChild(logEl);
        this.logBox.scrollTop = this.logBox.scrollHeight;
      }
    }
  }

  props: Props;

  render() {
    const { open, done, total } = this.props;
    const actions = [
      <FlatButton
        label="멈추기"
        secondary
        onTouchTap={() => {}} // TODO
      />,
      <FlatButton
        label="완료"
        primary
        disabled={!done}
        onTouchTap={() => {}} // TODO
      />
    ];
    const remain = (total == null) ? '-' : `${(1111 * (total - this.state.count) * 0.016).toFixed(0)}분`;
    return (<Dialog
      title="성적표 발송"
      open={open}
      modal
      actions={actions}
    >
      <div>{this.state.count} / {total}</div>
      <div>남은 예상시간: {remain}</div>
      <LinearProgress mode="determinate" value={this.state.count} max={total} />
      <div style={logBoxStyle} ref={el => { this.logBox = el; }} />
    </Dialog>);
  }
}
