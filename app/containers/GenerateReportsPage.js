import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import GenerateReports from '../components/GenerateReports';
import { generateReports, showFolderSelectDialog } from '../actions/generate';
import { previousStep } from '../actions/step';

function mapStateToProps({ generate }) {
  return {
    destDir: generate.destDir,
    generating: generate.generating
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    generateReports,
    previousStep,
    showFolderSelectDialog
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(GenerateReports);
