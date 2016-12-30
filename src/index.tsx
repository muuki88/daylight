import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router'

import * as moment from 'moment';
import App from './App';

import './styles/index.css';

moment.locale('de');

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="*" component={App} />
  </Router>
  , document.getElementById('root')
);
