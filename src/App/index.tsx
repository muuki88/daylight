import * as React from 'react';
import * as fetch from 'isomorphic-fetch';

import DateTime from '../DateTime';
import './index.css';

const ONE_MINUTE = 1000 * 60;
const ONE_HOUR = 60 * ONE_MINUTE;

interface IAppState {
  recognition: SpeechRecognition,
  isRecording: boolean
}

class App extends React.Component<void, IAppState> {

  constructor() {
    super();
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'de-DE';
    this.state = {
      recognition: recognition,
      isRecording: false
    };
  }

  componentDidMount() {
    // setInterval(this.refreshSite, 24 * ONE_HOUR);
    this.state.recognition.onstart = () => {
      this.setState({
        recognition: this.state.recognition,
        isRecording: true
      });
    };

    this.state.recognition.onend = (event) => {
      console.log('finished');
      console.log(event);
      this.setState({
        recognition: this.state.recognition,
        isRecording: false
      });
    };

    this.state.recognition.onresult = (event) => {
      let text = '';
      console.log(event)
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        text += event.results[i][0].transcript;
      }
      console.log(text);
      this.getAction(text)
    }
  }

  componentWillUnmount() {
    // clearInterval(this.refreshSite);
  }

  switchRecognition = () => {
    console.log('switch recognition');
    if(this.state.isRecording) {
      this.state.recognition.stop();
    } else {
      this.state.recognition.start();
    }
  }

  getAction = (text: string) => {
    console.log('fetching');
    const accessToken = 'xxxx';
    fetch('https://api.api.ai/v1/query?v=20150910', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ query: text, lang: 'en', sessionId: 'somerandomthing' })
    }).then(response => {
      console.log('response');
      console.log(response.text());
    }).catch(error => {
      console.log('error');
      console.log(error);
    });
  }

  refreshSite = () => {
    window.location.reload();
  }


  render() {
    return (
      <div className="App">
          <button
            style={{"background": "black", "fontSize": "16px"}}
            onClick={this.switchRecognition}>Talk</button>
          <div className="container">
              <DateTime className="" />
          </div>
      </div>
    );
  }
}

export default App;
