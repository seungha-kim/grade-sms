// @flow
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import type { Map as IMap } from 'immutable';
import s from './DataRangeForm.css';
import DataRangeField from './DataRangeField';

type Props = {
  formData: IMap<string, any>,
  filePath: string,
  onError: (string) => void,
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
        <div>{filePath}</div>
        <div className={s.content}>
          <DataRangeField
            hintText={rangeHintText}
            floatingLabelText="이름"
            fieldData={formData.get('nameRange')}
            updateRangeThunk={updateRangeThunk}
          />
          <DataRangeField
            hintText={rangeHintText}
            floatingLabelText="학교"
            fieldData={formData.get('schoolRange')}
            updateRangeThunk={updateRangeThunk}
          />
          <DataRangeField
            hintText={rangeHintText}
            floatingLabelText="원번"
            fieldData={formData.get('idRange')}
            updateRangeThunk={updateRangeThunk}
          />
          <DataRangeField
            hintText={rangeHintText}
            floatingLabelText="부모님 연락처"
            fieldData={formData.get('phoneRange')}
            updateRangeThunk={updateRangeThunk}
          />
          <div>
            {formData.get('testRangeSets').map((fieldSet, i) => <div key={fieldSet.get('setKey')}>
              <div>시험 {i + 1}</div>
              <RaisedButton secondary label="삭제" onClick={() => removeTest(fieldSet.get('setKey'))} />
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
            </div>)}
          </div>
          <div>
            {formData.get('homeworkRanges').map((field, i) => <div key={field.get('fieldKey')}>
              <div>숙제 {i + 1}</div>
              <RaisedButton secondary label="삭제" onClick={() => removeHomework(field.get('fieldKey'))} />
              <DataRangeField
                hintText={rangeHintText}
                floatingLabelText="숙제 점수"
                fieldData={field}
                updateRangeThunk={updateRangeThunk}
              />
            </div>)}
          </div>
        </div>
        <div className={s.buttons}>
          <RaisedButton label="시험 추가" onClick={addTest} style={buttonStyle} />
          <RaisedButton label="숙제 추가" onClick={addHomework} style={buttonStyle} />
          <RaisedButton label="뒤로" secondary onClick={previousStep} style={buttonStyle} />
          <RaisedButton label="다음" primary disabled onClick={nextStep} style={buttonStyle} />
        </div>
      </div>
    );
  }
}
