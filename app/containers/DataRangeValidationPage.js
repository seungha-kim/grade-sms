import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DataRangeValidation from '../components/DataRangeValidation';
import { nextStep, previousStep } from '../actions/step';
import { calculateStat } from '../actions/range';
import { initializeTemplateDataFromRange } from '../actions/templateForm';

function mapStateToProps({ range: formData }) {
  return {
    formData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    nextStep: () => disp => {
      disp(calculateStat());
      disp(initializeTemplateDataFromRange());
      disp(nextStep());
    },
    previousStep
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DataRangeValidation);
