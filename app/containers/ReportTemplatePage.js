import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReportTemplate from '../components/ReportTemplate';
import { nextStep, previousStep } from '../actions/step';
import {
  updateTemplateFieldByKey,
  previewNextStudent,
  previewPreviousStudent
} from '../actions/templateForm';

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
    updateTemplateFieldByKey,
    previewNextStudent,
    previewPreviousStudent
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportTemplate);
