import * as React from 'react';
import * as moment from 'moment';

const styles = require<any>('./index.css');

interface IDateTimeProps { }

interface IDateTimeState {
    momentTime: moment.Moment,
    isHalfTick: boolean,
    intervalId?: number
}

class DateTime extends React.Component<IDateTimeProps, IDateTimeState> {

    constructor(props: IDateTimeProps) {
        super(props);
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

        const seperatorClassNames = [styles.DateTime, styles.separator];
        if (isHalfTick) seperatorClassNames.push('hide');
        return (
          <div className={styles.DateTime}>
            <div className={[styles.DateTime, styles.date].join(' ')}>
              {momentTime.format(this.getDateFormat())}
            </div>
            <div className={[styles.DateTime, styles.time].join(' ')}>
              {momentTime.format('HH')}
              <span className={seperatorClassNames.join(' ')}>:</span>
              {momentTime.format('mm')}
            </div>
          </div>
        );
    }
}

export default DateTime;
