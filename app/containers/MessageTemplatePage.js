import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MessageTemplate from '../components/MessageTemplate';
import {
  renderExampleMessage,
  updateTestPhoneNumber,
  smsTestAndSend,
  updateTargetClassAndCount
} from '../actions/send';
import {
  closeMessageTemplate
} from '../actions/subPage';

function mapStateToProps({ subPage, send }) {
  return {
    open: subPage.messageTemplate,
    isError: send.messageTemplateError,
    templateString: send.messageTemplateString,
    renderedExampleMessage: send.renderedExampleMessage,
    exampleBytes: send.exampleBytes,
    testPhoneNumber: send.testPhoneNumber,
    cannotSend: send.cannotSend,
    targetClassList: send.targetClassList,
    targetClass: send.targetClass,
    targetCount: send.targetCount
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    close: closeMessageTemplate,
    send: smsTestAndSend,
    renderExampleMessage,
    updateTestPhoneNumber,
    onTargetClassChanged: updateTargetClassAndCount
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageTemplate);
