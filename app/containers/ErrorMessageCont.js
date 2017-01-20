// @flow
import { connect } from 'react-redux';
import ErrorMessage from '../components/ErrorMessage';

function mapStateToProps({ errorMessage }) {
  return { errorMessage };
}

export default connect(mapStateToProps)(ErrorMessage);
