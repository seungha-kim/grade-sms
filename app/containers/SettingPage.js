import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Setting from '../components/Setting';
import { closeSettingPage } from '../actions/subPage';
import {
  saveSetting,
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
    close: closeSettingPage,
    save: saveSetting,
    updateField: updateSettingFieldValue
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Setting);
