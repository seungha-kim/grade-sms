import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import HelpText from './HelpText';

type Props = {
  open: boolean,
  close: () => void,
  next: () => void,
  isError: boolean,
  templateString: string,
  renderedExampleMessage: string,
  renderExampleMessage: (string) => void,
  exampleBytes: number
};

export default class MessageTemplate extends Component {
  props: Props;
  render() {
    const {
      open,
      close,
      next,
      templateString,
      renderExampleMessage,
      renderedExampleMessage,
      isError,
      exampleBytes
    } = this.props;
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
        disabled={templateString === '' || isError}
      />
    ];
    return (<Dialog
      title="메시지 내용 작성"
      open={open}
      modal
      actions={actions}
    >
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <div style={{ flexGrow: 1, marginRight: '30px' }}>
          <HelpText>
            학부모에게 전송될 메시지 내용을 작성합니다. <br />
            아래의 변수를 지원합니다. <br />
            <code>{'{{'}이름{'}}'}</code> : 학생 이름 <br />
            <code>{'{{'}원번{'}}'}</code> : 학생 원번 <br />
          </HelpText>
          <TextField
            floatingLabelText="메시지 내용"
            multiLine
            value={templateString}
            errorText={isError ? '메시지 문법이 잘못되었습니다.' : null}
            onChange={e => renderExampleMessage(e.target.value)}
          />
        </div>
        <div style={{ width: '250px' }}>
          <div style={{ padding: '20px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', backgroundColor: '#ccc', minHeight: '300px' }}>
            {`[Web발신]\n${renderedExampleMessage}`}
          </div>
          <div style={{ marginTop: '10px', textAlign: 'right' }}>{exampleBytes} Bytes { exampleBytes <= 90 ? '단문 (건당 30원)' : '장문 (건당 50원)'}</div>
        </div>
      </div>

    </Dialog>);
  }
}
