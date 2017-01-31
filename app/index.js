import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { ipcRenderer } from 'electron';

import {
  visibleSendPage,
  visibleSettingPage
} from './actions/subPage';
import SendPage from './containers/SendPage';
import SettingPage from './containers/SettingPage';
import configureStore from './store/configureStore';
import './app.global.css';
import ErrorMessageCont from './containers/ErrorMessageCont';
// import HomePage from './containers/HomePage';
import HomePage from './containers/HomePage';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const store = configureStore();

render(
  <Provider store={store}>
    <MuiThemeProvider>
      <div style={{ height: '100%' }}>
        <HomePage />
        <ErrorMessageCont />
        <SendPage />
        <SettingPage />
      </div>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);

ipcRenderer.on('subPage', (event, message) => {
  switch (message) {
    case 'send':
      store.dispatch(visibleSendPage());
      break;
    case 'setting':
      store.dispatch(visibleSettingPage());
      break;
    default:
      console.error(`wrong route: ${message}`);
  }
});
