import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

type Props = {
  destDir: string,
  generateReports: () => void
};

export default class GenerateReports extends Component {
  props: Props;
  render() {
    const {
      destDir,
      generateReports
    } = this.props;
    return (<div>
      <div>{destDir}</div>
      <RaisedButton label="Primary" primary onClick={generateReports} />
    </div>);
  }
}
