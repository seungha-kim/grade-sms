import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MessageTemplate from '../components/MessageTemplate';
import {
  renderExampleMessage,
  updateTestPhoneNumber,
  smsTestAndSend
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
    cannotSend: send.cannotSend
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    close: closeMessageTemplate,
    send: smsTestAndSend,
    renderExampleMessage,
    updateTestPhoneNumber
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageTemplate);
