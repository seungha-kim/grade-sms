// @flow
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import debounce from 'lodash.debounce';
import IconButton from 'material-ui/IconButton';

import { TemplateForm } from '../reducers/templateForm';
import s from './ReportTemplate.css';
import cs from './commonStyles.css';
import HelpText from './HelpText';
import { render as renderTemplate } from '../utils/template';

type Props = {
  stat: any,
  templateForm: TemplateForm,
  nextStep: () => void,
  previousStep: () => void,
  updateTemplateFieldByKey: (number, string) => void,
  previewNextStudent: () => void,
  previewPreviousStudent: () => void
};

type State = {
  rendered: string
};

export default class ReportTemplate extends Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      rendered: renderTemplate(props.stat, props.templateForm)
    };
  }
  state: State;

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.templateForm.currentIndex !== nextProps.templateForm.currentIndex) {
      this.updateTemplate(nextProps);
    }
  }

  onFieldChange(fieldKey: number) {
    return (e: Event, newValue: string) => {
      const { updateTemplateFieldByKey } = this.props;
      updateTemplateFieldByKey(fieldKey, newValue);
      this.updateTemplateDebounced();
    };
  }

  updateTemplate(props: ?Props = null) {
    const { stat, templateForm } = props || this.props;
    this.setState({
      rendered: renderTemplate(stat, templateForm)
    });
  }

  updateTemplateDebounced = debounce(this.updateTemplate, 1000)

  props: Props;

  render() {
    const {
      previousStep,
      templateForm,
      nextStep,
      previewNextStudent,
      previewPreviousStudent,
      stat
    } = this.props;
    const { rendered } = this.state;
    return (<div>
      <HelpText>
        성적 데이터 외에 성적표 생성에 필요한 내용을 채워넣는 과정입니다. <br />
        왼쪽에 채워넣은 내용이 오른쪽 미리보기에 나타납니다. 우측의 화살표를 눌러 성적표가 제대로 생성되었는지 검토해주세요.<br />
        <strong><code>*</code> 표시가 된 칸을 모두 채우셔야 다음으로 넘어갈 수 있습니다.</strong>
      </HelpText>
      <div className={s.content}>
        <div className={s.left}>
          <Card className={s.card}>
            <CardTitle title="기본 정보" />
            <CardText className={s.textFields}>
              <TextField
                floatingLabelText="제목*"
                style={{ width: '100%' }}
                value={templateForm.misc.title.value}
                onChange={this.onFieldChange(templateForm.misc.title.fieldKey)}
                multiLine
              />
              <TextField
                floatingLabelText="기간*"
                style={{ width: '100%' }}
                value={templateForm.misc.period.value}
                onChange={this.onFieldChange(templateForm.misc.period.fieldKey)}
              />
              <TextField
                floatingLabelText="참고사항"
                style={{ width: '100%' }}
                value={templateForm.misc.notice.value}
                onChange={this.onFieldChange(templateForm.misc.notice.fieldKey)}
                multiLine
              />
            </CardText>
          </Card>
          <Card className={s.card}>
            <CardTitle title="회차 정보" />
            <CardText className={s.textFields}>
              {templateForm.tests.map((ts, i) => (<div key={ts.setKey}>
                <TextField
                  floatingLabelText={`시험 ${i + 1} 긴 제목*`}
                  style={{ width: '100%' }}
                  value={ts.number.value}
                  onChange={this.onFieldChange(ts.number.fieldKey)}
                />
                <TextField
                  floatingLabelText={`시험 ${i + 1} 짧은 제목*`}
                  style={{ width: '100%' }}
                  value={ts.name.value}
                  onChange={this.onFieldChange(ts.name.fieldKey)}
                />
              </div>))}
              {templateForm.homeworks.map((hs, i) => (<div key={hs.setKey}>
                <TextField
                  floatingLabelText={`숙제 ${i + 1} 회차*`}
                  style={{ width: '100%' }}
                  value={hs.number.value}
                  onChange={this.onFieldChange(hs.number.fieldKey)}
                />
                <TextField
                  floatingLabelText={`숙제 ${i + 1} 이름*`}
                  style={{ width: '100%' }}
                  value={hs.name.value}
                  onChange={this.onFieldChange(hs.name.fieldKey)}
                />
              </div>))}
            </CardText>
          </Card>
        </div>
        <Paper className={s.right}>
          <div className={s.toolbar}>
            <div className={s.phone}>
              수신 : {stat.individual[templateForm.currentIndex].phone}
            </div>
            <div className={s.arrows}>
              <IconButton onClick={previewPreviousStudent} iconClassName="material-icons">chevron_left</IconButton>
              <div>{templateForm.currentIndex + 1} / {stat.individual.length}</div>
              <IconButton onClick={previewNextStudent} iconClassName="material-icons">chevron_right</IconButton>
            </div>
          </div>
          <iframe className={s.iframe} frameBorder="0" scrolling srcDoc={rendered} />
        </Paper>
      </div>
      <div className={cs.buttonWrap}>
        <RaisedButton label="뒤로" secondary onClick={previousStep} />
        <RaisedButton label="다음" primary disabled={!templateForm.allFieldsValid} onClick={nextStep} />
      </div>
    </div>);
  }
}
