import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Setting from '../components/Setting';
import { invisibleSettingPage } from '../actions/subPage';
import {
  validateSetting,
  updateSettingFieldValue
} from '../actions/setting';

function mapStateToProps({ subPage, setting }) {
  return {
    open: subPage.setting,
    setting
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    close: invisibleSettingPage,
    save: validateSetting,
    updateField: updateSettingFieldValue
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Setting);
