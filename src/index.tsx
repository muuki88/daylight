import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import * as moment from 'moment';
import App from './App';
import Control from './Control';

import './styles/index.css';

moment.locale('de');

ReactDOM.render(
  <Router history={browserHistory}>
      <Route path="/">
          <IndexRoute component={App}/>
          <Route path="control" component={Control} />
      </Route>
  </Router>
  , document.getElementById('root')
);
