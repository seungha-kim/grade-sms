import React, { Component } from 'react';
import FontIcon from 'material-ui/FontIcon';

const style = {
  position: 'relative',
  color: '#777',
  paddingLeft: '13px',
  lineHeight: 1.5
};

const iconStyle = {
  position: 'absolute',
  fontSize: '1.1rem',
  verticalAlign: 'middle',
  color: '#777',
  left: -10,
  top: 5
};

export default class HelpText extends Component {
  props: {
    children: string
  };

  render() {
    const { children, ...remain } = this.props;
    return (<div style={style} {...remain}>
      <FontIcon className="material-icons" style={iconStyle}>info_outline</FontIcon>
      {children}
    </div>);
  }
}
