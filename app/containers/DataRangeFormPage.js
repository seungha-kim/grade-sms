import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DataRangeForm from '../components/DataRangeForm';
import { newError } from '../actions/errorMessage';
import { nextStep, previousStep } from '../actions/step';
import {
  updateRangeThunk,
  addTest,
  removeTest,
  addHomework,
  removeHomework,
  resetFormData,
  validateData
} from '../actions/range';

function mapStateToProps({ range: formData }) {
  return {
    formData,
    filePath: formData.get('filePath')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onError: newError,
    nextStep: () => disp => {
      disp(validateData());
      disp(nextStep());
    },
    previousStep: () => disp => {
      disp(resetFormData());
      disp(previousStep());
    },
    updateRangeThunk,
    addTest,
    removeTest,
    addHomework,
    removeHomework
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DataRangeForm);
