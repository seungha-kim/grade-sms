import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReportTemplate from '../components/ReportTemplate';
import { nextStep, previousStep } from '../actions/step';
import { updateTemplateFieldByKey } from '../actions/templateForm';

function mapStateToProps({ stat, templateForm }) {
  return {
    stat,
    templateForm
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    nextStep,
    previousStep,
    updateTemplateFieldByKey
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportTemplate);
