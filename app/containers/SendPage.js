import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Send from '../components/Send';
import { closeSendPage } from '../actions/subPage';

function mapStateToProps({ subPage }) {
  return {
    open: subPage.send
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    close: closeSendPage
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Send);
