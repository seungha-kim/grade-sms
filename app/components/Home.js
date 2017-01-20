// @flow
import React, { Component } from 'react';
import Divider from 'material-ui/Divider';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import styles from './Home.css';

export type stepItemType = {
  name: string,
  el: React.Component<*, *, *>  // TODO
};

export default class Home extends Component {
  props: {
    activeStep: number,
    steps: Array<stepItemType>
  };

  render() {
    const { activeStep, steps } = this.props;
    const StepEl = steps[activeStep].el;
    return (
      <div className={styles.container}>
        <div style={{ padding: '0 20px', backgroundColor: '#f5f5f5' }}>
          <Stepper activeStep={activeStep}>
            {steps.map(({ name }) => <Step key={name}>
              <StepLabel>{name}</StepLabel>
            </Step>)}
          </Stepper>
        </div>
        <Divider />
        <div className={styles.content}>
          <StepEl />
        </div>
      </div>
    );
  }
}
