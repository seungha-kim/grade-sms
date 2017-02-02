import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import HelpText from './HelpText';
import Divider from 'material-ui/Divider';

type Props = {
  open: boolean,
  close: () => void,
  send: () => void,
  isError: boolean,
  templateString: string,
  renderedExampleMessage: string,
  renderExampleMessage: (string) => void,
  exampleBytes: number,
  testPhoneNumber: string,
  updateTestPhoneNumber: (string) => void,
  cannotSend: boolean
};

export default class MessageTemplate extends Component {
  props: Props;
  render() {
    const {
      open,
      close,
      send,
      templateString,
      renderExampleMessage,
      renderedExampleMessage,
      isError,
      exampleBytes,
      testPhoneNumber,
      updateTestPhoneNumber,
      cannotSend
    } = this.props;
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
        disabled={cannotSend || templateString === '' || isError || testPhoneNumber === ''}
      />
    ];
    return (<Dialog
      title="메시지 내용 작성"
      open={open}
      modal
      actions={actions}
      autoScrollBodyContent
      bodyStyle={{ paddingTop: '30px' }}
    >
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <div style={{ flexGrow: 1, marginRight: '30px' }}>
          <HelpText>
            학부모에게 전송될 메시지 내용을 작성합니다. <br />
            아래의 변수를 지원합니다. <br />
            <code>{'{{'}이름{'}}'}</code><br />
            <code>{'{{'}원번{'}}'}</code><br />
            <code>{'{{'}학교{'}}'}</code><br />
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
      <div style={{ marginTop: '50px' }}>
        <HelpText>
          문자나라 서비스가 제대로 동작하는지 확인하기 위해 테스트 문자를 1회 보내야 합니다. <br />
          테스트 문자를 받을 전화번호를 입력하세요.
        </HelpText>
        <TextField
          floatingLabelText="전화번호"
          floatingLabelFixed
          hintText="010-1234-5678"
          value={testPhoneNumber}
          onChange={e => updateTestPhoneNumber(e.target.value)}
        />
      </div>
    </Dialog>);
  }
}
