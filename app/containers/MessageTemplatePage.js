import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MessageTemplate from '../components/MessageTemplate';
import { renderExampleMessage } from '../actions/send';

function mapStateToProps({ subPage, send }) {
  return {
    open: subPage.messageTemplate,
    isError: send.messageTemplateError,
    templateString: send.messageTemplateString,
    renderedExampleMessage: send.renderedExampleMessage,
    exampleBytes: send.exampleBytes
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    close: () => {},
    next: () => {},
    renderExampleMessage
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageTemplate);
