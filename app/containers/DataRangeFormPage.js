import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DataRangeForm from '../components/DataRangeForm';
import { newError } from '../actions/errorMessage';
import { nextStep } from '../actions/step';
import {
  updateRangeThunk,
  addTest,
  removeTest,
  addHomework,
  removeHomework,
  previousStepToSelectFile
} from '../actions/formData';

function mapStateToProps({ formData }) {
  return {
    formData,
    filePath: formData.get('filePath')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onError: newError,
    nextStep,
    previousStep: previousStepToSelectFile,
    updateRangeThunk,
    addTest,
    removeTest,
    addHomework,
    removeHomework
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DataRangeForm);
