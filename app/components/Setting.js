import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

import type { SettingState } from '../reducers/setting';

type Props = {
  open: boolean,
  close: () => void,
  save: () => void,
  updateField: (string, string) => void,
  setting: SettingState
};

export default class Setting extends Component {
  props: Props;
  render() {
    const { open, close, save, updateField, setting } = this.props;
    const actions = [
      <FlatButton
        disabled={setting.loading}
        label="저장"
        primary
        onTouchTap={save}
      />,
      <FlatButton
        disabled={setting.loading}
        label="취소"
        secondary
        onTouchTap={close}
      />
    ];
    return (<Dialog
      title="외부 서비스 설정"
      open={open}
      modal
      actions={actions}
      autoScrollBodyContent
    >
      <div style={{ display: 'flex', flexFlow: 'column' }}>
        <TextField
          disabled={setting.loading}
          floatingLabelText="AWS S3 bucket name"
          value={setting.s3Bucket.value || ''}
          errorText={setting.s3Bucket.errorText}
          onChange={e => updateField('s3Bucket', e.target.value)}
        />
        <TextField
          disabled={setting.loading}
          floatingLabelText="AWS access key ID"
          value={setting.accessKeyId.value || ''}
          errorText={setting.accessKeyId.errorText}
          onChange={e => updateField('accessKeyId', e.target.value)}
        />
        <TextField
          disabled={setting.loading}
          floatingLabelText="AWS secret access key"
          value={setting.secretAccessKey.value || ''}
          errorText={setting.secretAccessKey.errorText}
          onChange={e => updateField('secretAccessKey', e.target.value)}
        />
        <TextField
          disabled={setting.loading}
          floatingLabelText="URLO Access Key"
          value={setting.urloAccessKey.value || ''}
          errorText={setting.urloAccessKey.errorText}
          onChange={e => updateField('urloAccessKey', e.target.value)}
        />
        <TextField
          disabled={setting.loading}
          floatingLabelText="문자나라 아이디"
          value={setting.munjanaraId.value || ''}
          errorText={setting.munjanaraId.errorText}
          onChange={e => updateField('munjanaraId', e.target.value)}
        />
        <TextField
          disabled={setting.loading}
          floatingLabelText="문자나라 2차 패스워드"
          value={setting.munjanaraPassword.value || ''}
          errorText={setting.munjanaraPassword.errorText}
          onChange={e => updateField('munjanaraPassword', e.target.value)}
        />
        <TextField
          disabled={setting.loading}
          floatingLabelText="문자나라에 사전 등록한 발신 번호"
          value={setting.senderPhoneNumber.value || ''}
          errorText={setting.senderPhoneNumber.errorText}
          onChange={e => updateField('senderPhoneNumber', e.target.value)}
        />
      </div>
    </Dialog>);
  }
}
