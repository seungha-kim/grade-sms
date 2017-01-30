// @flow
import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import s from './SelectFileForm.css';
import cs from './commonStyles.css';

import HelpText from './HelpText';

type Props = {
  showOpenDialog: () => void,
  nextStep: () => void,
  filePath: ?string,
  sheetNames: ?Array<string>,
  selectedSheetIndex: ?number,
  updateSelectedSheet: (number) => void
};

export default class SelectFileForm extends Component {
  fileInput = null;

  props: Props;

  render() {
    const {
      showOpenDialog,
      nextStep,
      filePath,
      sheetNames,
      selectedSheetIndex,
      updateSelectedSheet
    } = this.props;
    return (
      <div className={s.wrap}>
        <div className={s.content}>
          <HelpText>
            성적표 생성에 사용될 시트를 선택하는 과정입니다. <br />
            엑셀 파일과 성적 데이터가 들어있는 시트를 선택하세요.
          </HelpText>
          <TextField
            hintText="여기를 클릭해 엑셀 파일을 선택하세요..."
            value={filePath || ''}
            onClick={showOpenDialog}
            fullWidth
            floatingLabelText="파일 경로"
          />
          <SelectField
            disabled={sheetNames == null}
            value={selectedSheetIndex}
            floatingLabelText="시트"
            onChange={(event, index, value) => updateSelectedSheet(value)}
          >
            {sheetNames != null
              ? sheetNames.map((name, i) =>
                <MenuItem value={i} primaryText={name} key={name} />)
              : null}
          </SelectField>
        </div>
        <div className={cs.buttonWrap}>
          <RaisedButton label="다음" primary disabled={filePath == null || selectedSheetIndex == null} onClick={nextStep} />
        </div>
      </div>
    );
  }
}
