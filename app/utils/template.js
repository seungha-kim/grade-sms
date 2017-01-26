import ejs from 'ejs';

import template from './report.ejs';

// const sample = {
//   title: '(제목)',
//   period: '(기간)',
//   tests: [{
//     number: '7회차',
//     name: 'TEST6',
//     grade: 100,
//     className: '새움어쩌고666',
//     classAvg: 93,
//     classAvgAll: [
//       ['분당시대인재최상위일630', 60.00],
//       ['분당시대인재최상위일630', 63.10],
//       ['시대인재일등급목630', 60.00],
//       ['새움일등급금630', 63.10],
//       ['시대인재일등급목630', 60.00],
//       ['새움일등급금630', 63.10],
//       ['시대인재일등급목630', 60.00],
//       ['새움일등급금630', 63.10]
//     ],
//     classRank: [133, 144],
//     totalAvg: 71,
//     totalRank: [873, 1049]
//   }, {
//     number: '8회차',
//     name: 'TEST7',
//     grade: 99,
//     className: '새움어쩌고666',
//     classAvg: 90,
//     classAvgAll: [
//       ['시대인재일등급목630', 60.00],
//       ['새움일등급금630', 63.10],
//       ['시대인재일등급목630', 60.00],
//       ['새움일등급금630', 63.10],
//       ['시대인재일등급목630', 60.00],
//       ['새움일등급금630', 63.10],
//       ['시대인재일등급목630', 60.00],
//       ['새움일등급금630', 63.10]
//     ],
//     classRank: [133, 144],
//     totalAvg: 78,
//     totalRank: [873, 1049]
//   }],
//   homeworks: [{
//     number: '6회차',
//     name: '(수2) 4. 지수와 로그',
//     grade: 100,
//     classAvgAll: [
//       ['분당시대인재최상위일630', 60.00],
//       ['분당시대인재최상위일630', 63.10],
//       ['시대인재일등급목630', 60.00],
//       ['새움일등급금630', 63.10],
//       ['시대인재일등급목630', 60.00],
//       ['새움일등급금630', 63.10],
//       ['시대인재일등급목630', 60.00],
//     ]
//   }, {
//     number: '6회차',
//     name: '(수2) 4. 지수와 로그',
//     grade: 100,
//     classAvgAll: [
//       ['시대인재일등급목630', 60.00],
//       ['새움일등급금630', 63.10],
//       ['시대인재일등급목630', 60.00],
//       ['새움일등급금630', 63.10],
//       ['시대인재일등급목630', 60.00],
//       ['새움일등급금630', 63.10],
//       ['시대인재일등급목630', 60.00],
//     ]
//   }],
// };

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

export function render(stat, templateForm) {
  const { id, name, school } = stat.individual[templateForm.currentIndex];
  const { tests: testsStat, homeworks: homeworksStat } = stat;
  const { tests: testsForm, homeworks: homeworksForm } = templateForm;
  const testsData = testsStat.map(({
    individualGrade,
    individualClass,
    totalRank: totalRankArr,
    totalAvg,
    classRank: classRankAllObj,
    classAvg: classAvgAllObj
  }, i) => {
    const gradeDisp = individualGrade[id];
    const noGrade = !Number.isFinite(gradeDisp);
    const grade = noGrade ? 0 : gradeDisp;
    const className = individualClass[id];
    const noClass = className === '0' || className === 0; // FIXME: 다른 곳으로 빼야 함
    const classAvg = noClass ? 0 : classAvgAllObj[className];
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
      number: testsForm.get(i).number.value || `(시험 ${i + 1} 회차)`,
      name: testsForm.get(i).name.value || `(시험 ${i + 1} 이름)`,
      gradeDisp,
      grade,
      className: noClass ? '-' : className,
      classAvg,
      classAvgAll,
      classRank,
      totalAvg,
      totalRank
    };
  });
  const homeworksData = homeworksStat.map(({
    individualGrade,
    totalAvg,
    classAvg: classAvgAllObj
  }, i) => {
    const gradeDisp = individualGrade[id];
    const classAvgAll = [['전체', totalAvg]].concat(Object.entries(classAvgAllObj));
    return {
      number: homeworksForm.get(i).number.value || `(숙제 ${i + 1} 회차)`,
      name: homeworksForm.get(i).name.value || `(숙제 ${i + 1} 이름)`,
      gradeDisp,
      classAvgAll,
      totalAvg
    };
  });
  const templateData = {
    title: templateForm.misc.title.value || '(제목)',
    period: templateForm.misc.period.value || '(기간)',
    notice: templateForm.misc.notice.value,
    id,
    name,
    school,
    tests: testsData,
    homeworks: homeworksData,
    chartColors
  };
  console.log(templateData);
  return ejs.render(template, templateData);
}
