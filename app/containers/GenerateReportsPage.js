import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import GenerateReports from '../components/GenerateReports';
import { generateReports } from '../actions/generate';
import { previousStep } from '../actions/step';

function mapStateToProps({ generate }) {
  return {
    destDir: generate.destDir
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    generateReports,
    previousStep
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(GenerateReports);
