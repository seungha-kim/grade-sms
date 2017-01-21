import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import configureStore from './store/configureStore';
import './app.global.css';
import ErrorMessageCont from './containers/ErrorMessageCont';
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
      </div>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);