import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DataRangeValidation from '../components/DataRangeValidation';
import { nextStep, previousStep } from '../actions/step';
import {
} from '../actions/formData';

function mapStateToProps({ formData }) {
  return {
    formData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    nextStep,
    previousStep
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DataRangeValidation);
