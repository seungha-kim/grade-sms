import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Send from '../components/Send';
import { closeSendPage } from '../actions/subPage';
import { cancelSendingReports } from '../actions/send';

function mapStateToProps({ subPage, send }) {
  return {
    open: subPage.send,
    done: send.done,
    log: send.log,
    count: send.sendCount,
    total: send.totalCount
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    close: closeSendPage,
    cancel: cancelSendingReports
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Send);
