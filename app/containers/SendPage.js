import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Send from '../components/Send';
import { closeSendPage } from '../actions/subPage';

function mapStateToProps({ subPage, send }) {
  return {
    // open: subPage.send
    open: subPage.send,
    done: send.done,
    log: send.log
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    close: closeSendPage
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Send);
