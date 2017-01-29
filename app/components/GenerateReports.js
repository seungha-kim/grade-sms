import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

import HelpText from './HelpText';
import cs from './commonStyles.css';

type Props = {
  destDir: string,
  generating: boolean,
  generateReports: () => void,
  previousStep: () => void,
  showFolderSelectDialog: () => void
};

export default class GenerateReports extends Component {
  props: Props;
  render() {
    const {
      destDir,
      generateReports,
      generating,
      previousStep,
      showFolderSelectDialog
    } = this.props;
    return (<div>
      <HelpText>
        <code>{destDir}</code> 폴더에 성적표가 생성됩니다.
      </HelpText>
      <div className={cs.buttonWrap}>
        <RaisedButton label="폴더 변경" onClick={showFolderSelectDialog} />
        <RaisedButton label="뒤로" secondary onClick={previousStep} />
        <RaisedButton label="생성" disabled={generating} primary onClick={generateReports} labelPosition="before" />
      </div>
    </div>);
  }
}
