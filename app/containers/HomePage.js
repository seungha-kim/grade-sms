// @flow
import React from 'react';
import { connect } from 'react-redux';
import Home from '../components/Home';
import SelectFilePage from './SelectFilePage';
import DataRangeFormPage from './DataRangeFormPage';
import DataRangeValidationPage from './DataRangeValidationPage';

import ReportTemplatePage from './ReportTemplatePage';

const steps = [
  {
    name: '파일 선택',
    el: () => <SelectFilePage />
  },
  {
    name: '범위 설정',
    el: () => <DataRangeFormPage />
  },
  {
    name: '데이터 검사',
    el: () => <DataRangeValidationPage />
  },
  {
    name: '성적표 작성 및 검토',
    el: () => <ReportTemplatePage />
  },
  {
    name: '성적표 생성',
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
