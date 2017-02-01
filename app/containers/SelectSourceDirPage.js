import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SelectSourceDir from '../components/SelectSourceDir';
import { closeSelectSourceDirPage } from '../actions/subPage';
import { showOpenDialog } from '../actions/send';

function mapStateToProps({ subPage, send }) {
  return {
    open: subPage.selectSourceDir,
    sourceDir: send.sourceDir,
    errorText: send.sourceDirErrorText
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    close: closeSelectSourceDirPage,
    showOpenDialog,
    next: () => {}
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectSourceDir);
