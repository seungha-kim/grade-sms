// @flow
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import type { Map as IMap } from 'immutable';
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { basename } from 'path';
import TextField from 'material-ui/TextField';
import template from '../report.ejs';
import ejs from 'ejs';
import Paper from 'material-ui/Paper';

import s from './ReportTemplate.css';

type Props = {
  formData: IMap<string, any>,
  stat: any,
  filePath: string,
  nextStep: () => void,
  previousStep: () => void,
  updateRangeThunk: (string, string) => void,
  addTest: () => void,
  removeTest: (string) => void,
  addHomework: () => void,
  removeHomework: (string) => void
};

const sample = {
  title: '2017대비 수학 정상모T 고3 정규반 SEASON2 6~9회차 성적표',
  // name: '김승하',
  // school: '대일외고',
  // id: 125125,
  period: '2017.01.01 ~ 2017.02.01',
  // tests: [{
  //   number: '7회차',
  //   name: 'TEST6',
  //   grade: 100,
  //   className: '새움어쩌고666',
  //   classAvg: 93,
  //   classAvgAll: [
  //     ['분당시대인재최상위일630', 60.00],
  //     ['분당시대인재최상위일630', 63.10],
  //     ['시대인재일등급목630', 60.00],
  //     ['새움일등급금630', 63.10],
  //     ['시대인재일등급목630', 60.00],
  //     ['새움일등급금630', 63.10],
  //     ['시대인재일등급목630', 60.00],
  //     ['새움일등급금630', 63.10]
  //   ],
  //   classRank: [133, 144],
  //   totalAvg: 71,
  //   totalRank: [873, 1049]
  // }, {
  //   number: '8회차',
  //   name: 'TEST7',
  //   grade: 99,
  //   className: '새움어쩌고666',
  //   classAvg: 90,
  //   classAvgAll: [
  //     ['시대인재일등급목630', 60.00],
  //     ['새움일등급금630', 63.10],
  //     ['시대인재일등급목630', 60.00],
  //     ['새움일등급금630', 63.10],
  //     ['시대인재일등급목630', 60.00],
  //     ['새움일등급금630', 63.10],
  //     ['시대인재일등급목630', 60.00],
  //     ['새움일등급금630', 63.10]
  //   ],
  //   classRank: [133, 144],
  //   totalAvg: 78,
  //   totalRank: [873, 1049]
  // }],
  // homeworks: [{
  //   number: '6회차',
  //   name: '(수2) 4. 지수와 로그',
  //   grade: 100,
  //   classAvgAll: [
  //     ['분당시대인재최상위일630', 60.00],
  //     ['분당시대인재최상위일630', 63.10],
  //     ['시대인재일등급목630', 60.00],
  //     ['새움일등급금630', 63.10],
  //     ['시대인재일등급목630', 60.00],
  //     ['새움일등급금630', 63.10],
  //     ['시대인재일등급목630', 60.00],
  //   ]
  // }, {
  //   number: '6회차',
  //   name: '(수2) 4. 지수와 로그',
  //   grade: 100,
  //   classAvgAll: [
  //     ['시대인재일등급목630', 60.00],
  //     ['새움일등급금630', 63.10],
  //     ['시대인재일등급목630', 60.00],
  //     ['새움일등급금630', 63.10],
  //     ['시대인재일등급목630', 60.00],
  //     ['새움일등급금630', 63.10],
  //     ['시대인재일등급목630', 60.00],
  //   ]
  // }],
  chartColors: [
    '#3366CC',
    '#DC3912',
    '#FF9900',
    '#109618',
    '#990099',
    '#3B3EAC',
    '#0099C6',
    '#DD4477',
    '#66AA00',
    '#B82E2E',
    '#316395',
    '#994499',
    '#22AA99',
    '#AAAA11',
    '#6633CC',
    '#E67300',
    '#8B0707',
    '#329262',
    '#5574A6',
    '#3B3EAC'
  ]
};

export default class ReportTemplate extends Component {
  props: Props;

  render() {
    const { stat, previousStep } = this.props;
    const { id, name, school } = stat.individual[1]; // FIXME
    const { tests, homeworks } = stat;
    const testsData = tests.map(({
      individualGrade,
      individualClass,
      totalRank: totalRankArr,
      totalAvg,
      classRank: classRankAllObj,
      classAvg: classAvgAllObj
    }) => {
      const grade = individualGrade[id];
      const className = individualClass[id];
      const classAvg = classAvgAllObj[className];
      const classAvgAll = [['전체', totalAvg]].concat(Object.entries(classAvgAllObj));
      const classRank = [
        classRankAllObj[className].indexOf(id) + 1,
        classRankAllObj[className].length
      ];
      const totalRank = [totalRankArr.indexOf(id) + 1, totalRankArr.length];
      return {
        number: '7회차', // FIXME
        name: 'TEST6',
        grade,
        className,
        classAvg,
        classAvgAll,
        classRank,
        totalAvg,
        totalRank
      };
    });
    const homeworksData = homeworks.map(({
      individualGrade,
      totalAvg,
      classAvg: classAvgAllObj
    }) => {
      const grade = individualGrade[id];
      const classAvgAll = [['전체', totalAvg]].concat(Object.entries(classAvgAllObj));
      return {
        number: '6회차 (시험중...)',
        name: '시험운행중...',
        grade,
        classAvgAll,
        totalAvg
      };
    });
    const templateData = Object.assign({}, sample, {
      id,
      name,
      school,
      tests: testsData,
      homeworks: homeworksData
    });
    console.log(templateData);

    return (<div>
      <div className={s.wrap}>
        <div className={s.left}>
          <Card className={s.card}>
            <CardTitle title="기본 정보" />
            <CardText className={s.textFields}>
              <TextField floatingLabelText="제목" multiLine />
              <TextField floatingLabelText="기간" />
              <TextField floatingLabelText="참고사항" multiLine />
            </CardText>
          </Card>
          <Card className={s.card}>
            <CardTitle title="회차 정보" />
            <CardText className={s.textFields}>
              <TextField floatingLabelText="시험 1 회차" />
              <TextField floatingLabelText="시험 1 이름" />
              <TextField floatingLabelText="숙제 1 이름" />
            </CardText>
          </Card>
        </div>
        <Paper className={s.right}>

          <iframe className={s.iframe} frameBorder="0" scrolling srcDoc={ejs.render(template, templateData)} />
        </Paper>
      </div>
      <div className={s.buttons}>
        <RaisedButton label="뒤로" secondary onClick={previousStep} />
        <RaisedButton label="다음" primary />
      </div>
    </div>);
  }
}
