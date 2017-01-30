import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';

import HelpText from './HelpText';
import cs from './commonStyles.css';

type Props = {
  destDir: string,
  generating: boolean,
  generateReports: () => void,
  previousStep: () => void,
  showFolderSelectDialog: () => void,
  progress: number,
  total: number
};

export default class GenerateReports extends Component {
  props: Props;
  render() {
    const {
      destDir,
      generateReports,
      generating,
      previousStep,
      showFolderSelectDialog,
      progress,
      total
    } = this.props;
    return (<div>
      <HelpText>
        <code>{destDir}</code> 폴더에 총 {total}개의 성적표가 생성됩니다.
      </HelpText>
      {generating
        ? (
          <LinearProgress mode="determinate" value={progress} max={total} style={{ marginTop: '30px' }} />
        )
        : (
          <div className={cs.buttonWrap}>
            <RaisedButton label="폴더 변경" onClick={showFolderSelectDialog} />
            <RaisedButton label="뒤로" secondary onClick={previousStep} />
            <RaisedButton label="생성" primary onClick={generateReports} labelPosition="before" />
          </div>
        )}
    </div>);
  }
}
