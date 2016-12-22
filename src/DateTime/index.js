import React, { Component } from 'react';
import moment from 'moment';

import styles from './index.css';

class DateTime extends Component {

  static propTypes = {
    className: React.PropTypes.string,
  };

  static defaultProps = {
    className: ''
  };

  constructor() {
    super();
    this.setTime = this.setTime.bind(this);
    this.state = {
      momentTime: moment(),
      isHalfTick: false,
    };
  }

  setTime() {
    this.setState({
      momentTime: moment(),
      isHalfTick: !this.state.isHalfTick,
    });
  }

  componentDidMount() {
    setInterval(this.setTime, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.setTime);
  }

  getDateFormat() {
    return 'dddd, Do MMMM';
  }

  render() {
    const { momentTime, isHalfTick } = this.state;
    let seperatorClassNames = [styles.seperator];

    if (isHalfTick) seperatorClassNames.push(styles.hide);

    return (
      <div className={[styles.DateTime, this.props.className].join(' ')}>
        <div className={styles.date}>
          {momentTime.format(this.getDateFormat())}
        </div>
        <div className={styles.time}>
          {momentTime.format('HH')}
          <span className={seperatorClassNames.join(' ')}>
            :
          </span>
          {momentTime.format('mm')}
        </div>
      </div>
    );
  }
}

export default DateTime;
