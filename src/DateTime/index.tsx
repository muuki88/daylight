import * as React from 'react';
import * as moment from 'moment';

import { IDateTimeProps } from './propTypes';

import './index.css';

interface IDateTimeState {
  momentTime: moment.Moment,
  isHalfTick: boolean,
  intervalId?: number
}

class DateTime extends React.Component<IDateTimeProps, IDateTimeState> {

  constructor(props: IDateTimeProps) {
    super(props);
    // this.setTime = this.setTime.bind(this);
    this.state = {
      momentTime: moment(),
      isHalfTick: false
    };
  }

  setTime = () => {
    this.setState({
      momentTime: moment(),
      isHalfTick: !this.state.isHalfTick
    });
  }

  componentDidMount() {
    const intervalId = setInterval(this.setTime, 1000);
    this.setState({
      momentTime: this.state.momentTime,
      isHalfTick: this.state.isHalfTick,
      intervalId: intervalId
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  getDateFormat() {
    return 'dddd, Do MMMM';
  }

  render() {
    const { momentTime, isHalfTick } = this.state;
    // let seperatorClassNames = [styles.seperator];
    //
    // if (isHalfTick) seperatorClassNames.push(styles.hide);
    //
    // return (
    //   <div className={[styles.DateTime, this.props.className].join(' ')}>
    //     <div className={styles.date}>
    //       {momentTime.format(this.getDateFormat())}
    //     </div>
    //     <div className={styles.time}>
    //       {momentTime.format('HH')}
    //       <span className={seperatorClassNames.join(' ')}>
    //         :
    //       </span>
    //       {momentTime.format('mm')}
    //     </div>
    //   </div>
    // );

    const seperatorClassNames = ['DateTime seperator'];
    if (isHalfTick) seperatorClassNames.push('hide');
    return (
      <div className="DateTime">
        <div className="DateTime date">
          {momentTime.format(this.getDateFormat())}
        </div>
        <div className="DateTime time">
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
