// Import this to trigger correct type resolution. Maybe unnecessary with final release
/// <reference path="../../node_modules/api-ai-javascript/declarations.d.ts" />

import * as React from 'react';
import {Client} from "api-ai-javascript";

import DateTime from '../DateTime';
import './index.css';

const ONE_MINUTE = 1000 * 60;
const ONE_HOUR = 60 * ONE_MINUTE;

class App extends React.Component<void, void> {

  componentDidMount() {
    // setInterval(this.refreshSite, 24 * ONE_HOUR);
    const client = new Client({
      accessToken: 'xxxx',
      // lang: AVAILABLE_LANGUAGES.DE
    });
    // const streamClient = client.createStreamClient({
    //   onResults: response => {
    //     console.log('result');
    //     console.log(response);
    //   },
    //   onError: error => {
    //     console.log('error')
    //     console.log(error)
    //   }
    // });
    //
    // streamClient.init();
    // streamClient.startListening();
    // setTimeout(streamClient.stopListening, 5000)

    client.textRequest('Wie viel Uhr ist es?')
      .then(response => {
        console.log('-----');
        console.log(response);
        // console.log(response.json());
      })
      .catch(error => {
        console.log('!!!!!!!!')
        console.log(error);
      });
  }

  componentWillUnmount() {
    // clearInterval(this.refreshSite);
  }

  refreshSite = () => {
    window.location.reload();
  }


  render() {
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
