import React, { Component } from 'react';

import styles from './index.css';

import DateTime from '../DateTime';

const ONE_MINUTE = 1000 * 60;
const ONE_HOUR = 60 * ONE_MINUTE;

const IS_DEV = process.env.NODE_ENV !== 'production';

class App extends Component {

  constructor() {
    super();
    this.refreshSite = this.refreshSite.bind(this);
  }

  componentDidMount() {
    if(!this.getToken() && !IS_DEV) return;

    setInterval(this.refreshSite, 24 * ONE_HOUR);

    this.setHourly();
  }

  componentWillUnmount() {
    clearInterval(this.refreshSite);
    clearInterval(this.setConditions);
    clearInterval(this.setHourly);
  }

  refreshSite() {
    window.location.reload();
  }

  getUnits() {
    return this.props.location.query.units || 'imperial';
  }

  render() {
    const appClassNames = [styles.App, styles.clear];
    const units = this.getUnits();
    return (
      <div className={appClassNames.join(' ')}>
          <div className={styles.container}>
            <DateTime
              className={styles.DateTime}
              units={units}
            />
          </div>
      </div>
    );
  }
}

export default App;
