import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DataRangeForm from '../components/DataRangeForm';
import { newError } from '../actions/errorMessage';
import { nextStep, previousStep } from '../actions/step';
import { updateRangeThunk } from '../actions/formData';

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
    previousStep,
    updateRangeThunk,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DataRangeForm);
