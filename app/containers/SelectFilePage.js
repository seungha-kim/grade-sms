// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SelectFileForm from '../components/SelectFileForm';
// import { showOpenDialog } from '../actions/xlsx';
import { newError } from '../actions/errorMessage';
import { showOpenDialog, nextStepToFormData } from '../actions/formData';

function mapStateToProps({ formData }) {
  return {
    filePath: formData.get('filePath')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    showOpenDialog,
    nextStep: nextStepToFormData,
    onError: newError
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectFileForm);
