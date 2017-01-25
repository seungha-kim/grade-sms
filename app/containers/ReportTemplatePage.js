import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReportTemplate from '../components/ReportTemplate';
import { nextStep, previousStep } from '../actions/step';

function mapStateToProps({ stat }) {
  return {
    stat,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    nextStep,
    previousStep
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportTemplate);
