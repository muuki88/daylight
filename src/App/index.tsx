import * as React from 'react';

// import {Client} from "api-ai-javascript";

import './index.css';

import DateTime from '../DateTime';

const ONE_MINUTE = 1000 * 60;
const ONE_HOUR = 60 * ONE_MINUTE;

class App extends React.Component<void, void> {

  componentDidMount() {
    // setInterval(this.refreshSite, 24 * ONE_HOUR);

  }

  componentWillUnmount() {
    // clearInterval(this.refreshSite);
  }

  refreshSite = () => {
    window.location.reload();
  }


  render() {
    // const appClassNames = [styles.App, styles.clear];
    // return (
    //   <div className={appClassNames.join(' ')}>
    //       <div className={styles.container}>
    //         <DateTime className={styles.DateTime} />
    //       </div>
    //   </div>
    // );
    return (
      <div className="App">
          <div className="container">
              <DateTime className="" />
          </div>
      </div>
    );
  }
}

export default App;
