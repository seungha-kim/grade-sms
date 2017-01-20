// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DataRangeForm from '../components/DataRangeForm';
import { newError } from '../actions/errorMessage';
import { nextStep, previousStep } from '../actions/step';
import { queryDataRange } from '../actions/xlsx';

function mapStateToProps() {
  return { queryDataRange };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onError: newError,
    nextStep,
    previousStep,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DataRangeForm);
