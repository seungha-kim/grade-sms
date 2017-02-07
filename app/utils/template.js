import ejs from 'ejs';
import { remote } from 'electron';
import path from 'path';

import template from './report.ejs';

const chartColors = [
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
];

export function render(stat, templateForm, exactIndex = null) {
  const index = exactIndex || templateForm.currentIndex;
  const { id, name, school, testGrades, testClasses, homeworkGrades, homeworkClasses } = stat.individual[index];
  const { tests: testsStat, homeworks: homeworksStat } = stat;
  const { tests: testsForm, homeworks: homeworksForm } = templateForm;
  const testsData = testsStat.map(({
    totalRank: totalRankArr,
    totalAvg,
    classRank: classRankAllObj,
    classAvg: classAvgAllObj
  }, testIndex) => {
    const grade = testGrades[testIndex];
    const noGrade = !Number.isFinite(grade);
    const gradeDisp = noGrade ? `<strong>${grade}</strong>` : grade;
    const gradeNumeric = noGrade ? 0 : grade;
    const className = testClasses[testIndex];
    const noClass = className === '0' || !className; // FIXME: 이 기준이 맞는 건가...
    const classAvg = noClass ? 0 : classAvgAllObj[className];
    const classAvgDisp = noClass ? '-' : classAvgAllObj[className].toFixed(2);
    const classAvgAll = [['전체', totalAvg]].concat(Object.entries(classAvgAllObj));
    const classRank = [
      noGrade || noClass ? '-' : classRankAllObj[className].indexOf(id) + 1,
      noClass ? '-' : classRankAllObj[className].length
    ];
    const totalRank = [
      noGrade || noClass ? '-' : totalRankArr.indexOf(id) + 1,
      totalRankArr.length
    ];
    return {
      number: testsForm.get(testIndex).number.value || `<시험 ${testIndex + 1} 회차>`,
      name: testsForm.get(testIndex).name.value || `<시험 ${testIndex + 1} 이름>`,
      gradeDisp,
      gradeNumeric,
      className: noClass ? '-' : className,
      classAvg,
      classAvgDisp,
      classAvgAll,
      classRank,
      totalAvg,
      totalRank
    };
  });
  const homeworksData = homeworksStat.map(({
    totalAvg,
    classAvg: classAvgAllObj
  }, homeworkIndex) => {
    const grade = homeworkGrades[homeworkIndex];
    const noGrade = !Number.isFinite(grade);
    const gradeDisp = noGrade ? `<strong>${grade}</strong>` : grade.toFixed(2);
    const classAvgAll = [['전체', totalAvg]].concat(Object.entries(classAvgAllObj));
    return {
      number: homeworksForm.get(homeworkIndex).number.value || `<숙제 ${homeworkIndex + 1} 회차>`,
      name: homeworksForm.get(homeworkIndex).name.value || `<숙제 ${homeworkIndex + 1} 이름>`,
      gradeDisp,
      classAvgAll,
      totalAvg
    };
  });
  const templateData = {
    title: templateForm.misc.title.value || '<제목>',
    period: templateForm.misc.period.value || '<기간>',
    notice: templateForm.misc.notice.value,
    id,
    name,
    school,
    tests: testsData,
    homeworks: homeworksData,
    chartColors
  };
  return ejs.render(template, templateData);
}

export function defaultDestBaseDir() {
  const docPath = remote.app.getPath('documents');
  return path.join(docPath, 'jsm_report');
}
