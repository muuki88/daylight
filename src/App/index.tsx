import * as React from 'react';
import * as ReactRouter from 'react-router'
import * as fetch from 'isomorphic-fetch';
import * as io from 'socket.io-client';

import DateTime from '../DateTime';
import UnkownInput from '../UnkownInput';
import Recording from './Recording';

import {IServerResponse, IAction, IContext} from '../models/api-ai';

const styles = require<any>('./index.css');

const ONE_MINUTE = 1000 * 60;
const ONE_HOUR = 60 * ONE_MINUTE;

interface IAppState {
  isRecording: boolean,
  action?: IAction
}

interface IQueryParams {
  API_AI_ACCESSTOKEN: string
}

interface IAppProps extends ReactRouter.RouteComponentProps<{}, {}> {
}

class App extends React.Component<IAppProps, IAppState> {

  readonly recognition: SpeechRecognition;
  readonly socket: SocketIOClient.Socket;

  constructor(props) {
    super(props);
    this.socket = io.connect('localhost:3050');
    this.recognition = new webkitSpeechRecognition();
    this.recognition.lang = 'de-DE';
    this.recognition.onstart = this.onRecognitionStart;
    this.recognition.onend = this.onRecognitionEnd;
    this.recognition.onresult = this.onRecognitionResult;

    this.socket.on('connect', () => {
      console.log(`connected to backend ${this.socket.id}`);
    });

    this.socket.on('wakeup', this.onWakeWord);

    this.state = {
      isRecording: false
    };
  }

  componentWillUnmount() {
    this.socket.close();
    this.recognition.stop();
  }

  onWakeWord = () => {
    // REMOVE !!!
    this.getAction('bla bla');
    // REMOVE !!!
    if (!this.state.isRecording) {
      this.recognition.start();
    }
  }

  onRecognitionStart = () => {
    this.setState({
      isRecording: true
    });
  }

  onRecognitionEnd = () => {
    this.setState({
      isRecording: false
    });
  }

  onRecognitionResult = (event) => {
    let text = '';
    console.log(event)
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      text += event.results[i][0].transcript;
    }
    console.log(text);
    this.getAction(text)
  }

  getAction = (text: string) => {
    const queryParams =  this.props.location.query as IQueryParams;
    const accessToken = queryParams.API_AI_ACCESSTOKEN;
    fetch('https://api.api.ai/v1/query?v=20150910', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${accessToken}`
      },
      // TODO use IRequestOptions
      body: JSON.stringify({ query: text, lang: 'de', sessionId: 'wally-mirror' })
    }).then(this.parseApiAiResponse)
      .then(this.updateState).catch(error => {
      console.log('error');
      console.log(error);
    });
  }

  refreshSite = () => {
    window.location.reload();
  }

  parseApiAiResponse = (response: IResponse) => {
    return response.json().then(json => json as IServerResponse);
  }

  updateState = (apiAiResponse: IServerResponse) => {
    this.setState({
      isRecording: this.state.isRecording,
      action: apiAiResponse.result
    });
  }

  render() {
    return (
      <div className={styles.App}>
          <div className={styles.status}>
            {this.state.isRecording && <div className={styles.isRecording}></div>}
          </div>
          <div className={styles.container}>
            {this.state.isRecording ? <Recording /> : (
              this.state.action ? this.renderAction(this.state.action) : <DateTime />
            )}
          </div>
      </div>
    );
  }

  renderAction = (action: IAction) => {
    console.log(action);
    switch (action.action) {
      case "clock.show": return <DateTime />;
      case "input.unknown":
      default: return <UnkownInput speech={action.fulfillment.speech} />
    }
  }
}

export default App;
