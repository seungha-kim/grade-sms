import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import GenerateDone from '../components/GenerateDone';
import {
  onCommandOpenSelectSourceDirPage
} from '../actions/send';

function mapStateToProps({ generate }) {
  return {
    destDir: generate.destDir
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    send: onCommandOpenSelectSourceDirPage
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(GenerateDone);
