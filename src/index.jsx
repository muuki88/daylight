import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router'

import moment from 'moment';
import App from './App';

import './styles/index.css';

moment.locale('de');

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="*" component={App} />
  </Router>
  , document.getElementById('root')
);
