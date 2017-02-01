import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SelectSourceDir from '../components/SelectSourceDir';
import { closeSelectSourceDirPage } from '../actions/subPage';

function mapStateToProps({ subPage }) {
  return {
    open: subPage.selectSourceDir
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    close: closeSelectSourceDirPage
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectSourceDir);
