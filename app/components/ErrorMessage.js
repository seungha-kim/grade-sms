import React, { Component } from 'react';
import Snackbar from 'material-ui/Snackbar';

type Props = {
  errorMessage: ?string
};

type State = {
  open: boolean
};

export default class ErrorMessage extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      open: false
    };
  }

  state: State

  componentWillReceiveProps({ errorMessage }: Props) {
    if (errorMessage != null) {
      this.setState({ open: true });
    }
  }
  onRequestClose = (reason: string) => {
    console.log(reason);
    this.setState({ open: false });
  }

  props: Props

  render() {
    const { errorMessage } = this.props;
    const { open } = this.state;
    if (errorMessage == null) {
      return null;
    }
    return (
      <Snackbar
        open={open}
        message={errorMessage || ''}
        autoHideDuration={3000}
        onRequestClose={this.onRequestClose}
      />
    );
  }
}
