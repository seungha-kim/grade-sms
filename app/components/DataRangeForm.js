// @flow
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import debounce from 'lodash.debounce';

import s from './DataRangeForm.css';
import DataRangeField from './DataRangeField';

type Props = {
  nextStep: () => void,
  previousStep: () => void,
  filePath: string,
  queryDataRange: string => Array<string>
};

type Field = {
  dataRange: ?string,
  errorText: ?string,
  queried: ?string,
  loading: boolean
};

type State = {
  nameRange: Field,
  schoolRange: Field,
  idRange: Field,
  phoneRange: Field,
  testRanges: Array<TestType>,
  homeworkRanges: Array<HomeworkType>
};

type TestType = {
  classField: Field,
  attendanceField: Field,
  gradeField: Field,
  key: string
};

type HomeworkType = Field;

const buttonStyle = {
  marginLeft: 12
};

function newFieldData(): Field {
  return { dataRange: null, errorText: null, queried: null, loading: false };
}

function newTestData(): TestType {
  return {
    classField: newFieldData(),
    attendanceField: newFieldData(),
    gradeField: newFieldData(),
    key: new Date().toString()
  };
}

export default class DataRangeForm extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      nameRange: newFieldData(),
      schoolRange: newFieldData(),
      idRange: newFieldData(),
      phoneRange: newFieldData(),
      testRanges: [],
      homeworkRanges: []
    };
  }
  state: State;

  onChangeField = (fieldName: string) => (e: Event) => {
    const field: Field = this.state[fieldName];
    if (field == null) return;
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) return;
    const dataRange = target.value;
    this.setState({
      [fieldName]: {
        dataRange,
        errorText: field.errorText,
        queried: field.queried,
        loading: true
      }
    });
    if (this.debounced[fieldName] == null) {
      this.debounced[fieldName] = debounce((dr) => {
        const queried: Array<string> = this.props.queryDataRange(dr);
        if (queried == null || queried.length !== 2) {
          this.setState({
            [fieldName]: {
              dataRange: dr,
              errorText: '잘못된 범위입니다.',
              queried: null,
              loading: false
            }
          });
        } else {
          this.setState({
            [fieldName]: {
              dataRange: dr,
              errorText: null,
              queried: queried.join(' ~ '),
              loading: false
            }
          });
        }
      }, 1000);
    }
    this.debounced[fieldName](dataRange);
  };

  getFieldProps = (fieldName: string) => {
    const { queried, errorText, loading } = this.state[fieldName];
    return {
      queried,
      errorText,
      loading,
      onChange: this.onChangeField(fieldName)
    };
  }

  addTest = () => {
    this.setState({
      testRanges: this.state.testRanges.concat([newTestData()])
    });
  }

  addHomework = () => {
    this.setState({
      homeworkRanges: this.state.homeworkRanges.concat([newFieldData()])
    });
  }

  props: Props;

  fileInput = null;
  debounced = {};

  render() {
    const { nextStep, previousStep } = this.props;
    const { testRanges, homeworkRanges } = this.state;
    return (
      <div className={s.wrap}>
        <div className={s.content}>
          <DataRangeField
            hintText="X10:X100"
            floatingLabelText="이름"
            {...this.getFieldProps('nameRange')}
          />
          <DataRangeField
            hintText="X10:X100"
            floatingLabelText="학교"
            {...this.getFieldProps('schoolRange')}
          />
          <DataRangeField
            hintText="X10:X100"
            floatingLabelText="원번"
            {...this.getFieldProps('idRange')}
          />
          <DataRangeField
            hintText="X10:X100"
            floatingLabelText="부모님 연락처"
            {...this.getFieldProps('phoneRange')}
          />
          <div>
            {testRanges.map((r: TestType, i: number) => <div key={r.key}>
              <div>시험 {i + 1}</div>
              <DataRangeField
                hintText="X10:X100"
                floatingLabelText="반"
              />
              <DataRangeField
                hintText="X10:X100"
                floatingLabelText="출결"
              />
              <DataRangeField
                hintText="X10:X100"
                floatingLabelText="점수"
              />
            </div>)}
          </div>
        </div>
        <div className={s.buttons}>
          <RaisedButton label="시험 추가" onClick={this.addTest} style={buttonStyle} />
          <RaisedButton label="숙제 추가" onClick={this.addHomework} style={buttonStyle} />
          <RaisedButton label="뒤로" secondary onClick={previousStep} style={buttonStyle} />
          <RaisedButton label="다음" primary disabled onClick={nextStep} style={buttonStyle} />
        </div>
      </div>
    );
  }
}
