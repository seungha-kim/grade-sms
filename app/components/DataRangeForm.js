// @flow
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import type { Map as IMap } from 'immutable';
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { basename } from 'path';

import s from './DataRangeForm.css';
import cs from './commonStyles.css';

import DataRangeField from './DataRangeField';
import HelpText from './HelpText';

type Props = {
  formData: IMap<string, any>,
  filePath: string,
  nextStep: () => void,
  previousStep: () => void,
  updateRangeThunk: (string, string) => void,
  addTest: () => void,
  removeTest: (string) => void,
  addHomework: () => void,
  removeHomework: (string) => void
};

const buttonStyle = {
  marginLeft: 12
};

const cardStyle = {
  marginTop: 30
};

const cardTitleStyle = {
  display: 'flex',
  alignItems: 'center'
};

const rangeHintText = 'X10:X100';
// const target = e.target;
//   if (!(target instanceof HTMLInputElement)) return;
//   const dataRange = target.value;

export default class DataRangeForm extends Component {
  props: Props;

  render() {
    const {
      formData,
      filePath,
      // onError,
      nextStep,
      previousStep,
      updateRangeThunk,
      addTest,
      removeTest,
      addHomework,
      removeHomework
    } = this.props;
    // onError('haha');
    return (
      <div className={s.wrap}>
        <div className={s.content}>
          <HelpText>
            성적표 생성에 사용될 데이터 범위를 입력하는 과정입니다. <br />
            각 항목에 해당하는 데이터 범위를 입력해주세요. (예: <code>X15:X1000</code>)
          </HelpText>
          <Card style={cardStyle}>
            <CardTitle title="기본 사항" subtitle={basename(filePath)} />
            <CardText>
              <DataRangeField
                hintText={rangeHintText}
                floatingLabelText="이름"
                fieldData={formData.getIn(['privacyRangeSet', 'name'])}
                updateRangeThunk={updateRangeThunk}
              />
              <DataRangeField
                hintText={rangeHintText}
                floatingLabelText="학교"
                fieldData={formData.getIn(['privacyRangeSet', 'school'])}
                updateRangeThunk={updateRangeThunk}
              />
              <DataRangeField
                hintText={rangeHintText}
                floatingLabelText="원번"
                fieldData={formData.getIn(['privacyRangeSet', 'id'])}
                updateRangeThunk={updateRangeThunk}
              />
              <DataRangeField
                hintText={rangeHintText}
                floatingLabelText="부모님 연락처"
                fieldData={formData.getIn(['privacyRangeSet', 'phone'])}
                updateRangeThunk={updateRangeThunk}
              />
            </CardText>
          </Card>
          <div>
            {formData.get('testRangeSets').map((fieldSet, i) => <Card key={fieldSet.get('setKey')} style={cardStyle}>
              <CardTitle title={`시험 ${i + 1}`} style={cardTitleStyle} />
              <CardText>
                <DataRangeField
                  hintText={rangeHintText}
                  floatingLabelText="반"
                  fieldData={fieldSet.getIn(['fields', 'class'])}
                  updateRangeThunk={updateRangeThunk}
                />
                <DataRangeField
                  hintText={rangeHintText}
                  floatingLabelText="출결"
                  fieldData={fieldSet.getIn(['fields', 'attendance'])}
                  updateRangeThunk={updateRangeThunk}
                />
                <DataRangeField
                  hintText={rangeHintText}
                  floatingLabelText="점수"
                  fieldData={fieldSet.getIn(['fields', 'grade'])}
                  updateRangeThunk={updateRangeThunk}
                />
              </CardText>
              <CardActions>
                <FlatButton
                  disabled={formData.get('testRangeSets').size <= 1}
                  secondary
                  label="삭제"
                  onClick={() => removeTest(fieldSet.get('setKey'))}
                />
              </CardActions>
            </Card>)}
          </div>
          <div>
            {formData.get('homeworkRangeSets').map((fieldSet, i) => <Card key={fieldSet.get('setKey')} style={cardStyle}>
              <CardTitle title={`숙제 ${i + 1}`} style={cardTitleStyle} />
              <CardText>
                <DataRangeField
                  hintText={rangeHintText}
                  floatingLabelText="반"
                  fieldData={fieldSet.getIn(['fields', 'class'])}
                  updateRangeThunk={updateRangeThunk}
                />
                <DataRangeField
                  hintText={rangeHintText}
                  floatingLabelText="점수"
                  fieldData={fieldSet.getIn(['fields', 'grade'])}
                  updateRangeThunk={updateRangeThunk}
                />
              </CardText>
              <CardActions>
                <FlatButton secondary label="삭제" onClick={() => removeHomework(fieldSet.get('setKey'))} />
              </CardActions>
            </Card>)}
          </div>
        </div>
        <div className={cs.buttonWrap}>
          <RaisedButton label="시험 추가" onClick={addTest} style={buttonStyle} />
          <RaisedButton label="숙제 추가" onClick={addHomework} style={buttonStyle} />
          <RaisedButton label="뒤로" secondary onClick={previousStep} style={buttonStyle} />
          <RaisedButton label="다음" primary disabled={!formData.get('allRangesValid')} onClick={nextStep} style={buttonStyle} />
        </div>
      </div>
    );
  }
}
