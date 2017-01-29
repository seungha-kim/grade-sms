import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import GenerateDone from '../components/GenerateDone';

function mapStateToProps({ generate }) {
  return {
    destDir: generate.destDir
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    send: () => () => {},
    close: () => () => {}
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(GenerateDone);
