import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import GenerateReports from '../components/GenerateReports';
import { generateReports } from '../actions/generate';

function mapStateToProps({ generate }) {
  return {
    destDir: generate.destDir
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    generateReports
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(GenerateReports);
