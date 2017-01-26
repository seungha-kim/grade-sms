// @flow
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import debounce from 'lodash.debounce';

import { TemplateForm } from '../reducers/templateForm';
import s from './ReportTemplate.css';
import { render as renderTemplate } from '../utils/template';

type Props = {
  stat: any,
  templateForm: TemplateForm,
  nextStep: () => void,
  previousStep: () => void,
  updateTemplateFieldByKey: (number, string) => void
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

  onFieldChange(fieldKey: number) {
    return (e: Event, newValue: string) => {
      const { updateTemplateFieldByKey } = this.props;
      updateTemplateFieldByKey(fieldKey, newValue);
      this.updateTemplate();
    };
  }

  updateTemplate = debounce(() => {
    const { stat, templateForm } = this.props;
    this.setState({
      rendered: renderTemplate(stat, templateForm)
    });
  }, 1000)

  props: Props;

  render() {
    const { previousStep, templateForm, nextStep } = this.props;
    const { rendered } = this.state;
    return (<div>
      <div className={s.wrap}>
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
                  floatingLabelText={`시험 ${i + 1} 회차*`}
                  style={{ width: '100%' }}
                  value={ts.number.value}
                  onChange={this.onFieldChange(ts.number.fieldKey)}
                />
                <TextField
                  floatingLabelText={`시험 ${i + 1} 이름*`}
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
          <iframe className={s.iframe} frameBorder="0" scrolling srcDoc={rendered} />
        </Paper>
      </div>
      <div className={s.buttons}>
        <RaisedButton label="뒤로" secondary onClick={previousStep} />
        <RaisedButton label="다음" primary disabled={!templateForm.allFieldsValid} onClick={nextStep} />
      </div>
    </div>);
  }
}
