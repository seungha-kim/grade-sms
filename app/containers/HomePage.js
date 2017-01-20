// @flow
import React from 'react';
import { connect } from 'react-redux';
import Home from '../components/Home';
import SelectFilePage from './SelectFilePage';
import DataRangeFormPage from './DataRangeFormPage';

const steps = [
  {
    name: '입력 파일 선택',
    el: () => <SelectFilePage />
  },
  {
    name: '데이터 범위 설정',
    el: () => <DataRangeFormPage />
  },
  {
    name: '세부 내용 채우기',
    el: () => <div>2</div>
  },
  {
    name: '검토',
    el: () => <div>3</div>
  },
  {
    name: '발송',
    el: () => <div>4</div>
  },
  {
    name: '완료',
    el: () => <div>5</div>
  },
];

function mapStateToProps(state) {
  return {
    activeStep: state.step,
    steps
  };
}

export default connect(mapStateToProps)(Home);
