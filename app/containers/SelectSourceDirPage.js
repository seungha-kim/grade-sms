import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SelectSourceDir from '../components/SelectSourceDir';
import { closeSelectSourceDirPage, openMessageTemplate } from '../actions/subPage';
import { showOpenDialog, initializeTemplateStringIfBlanked } from '../actions/send';

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
    next: () => disp => {
      disp(initializeTemplateStringIfBlanked());
      disp(closeSelectSourceDirPage());
      disp(openMessageTemplate());
    }
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectSourceDir);
