import * as React from 'react';
import * as ReactRouter from 'react-router'
import * as fetch from 'isomorphic-fetch';
import * as io from 'socket.io-client';

import DateTime from '../DateTime';
import './index.css';

const ONE_MINUTE = 1000 * 60;
const ONE_HOUR = 60 * ONE_MINUTE;

interface IAppState {
  recognition: SpeechRecognition,
  isRecording: boolean,
  socket?: SocketIOClient.Socket
}

interface IQueryParams {
  API_AI_ACCESSTOKEN: string
}

interface IAppProps extends ReactRouter.RouteComponentProps<{}, {}> {
}

class App extends React.Component<IAppProps, IAppState> {

  constructor(props) {
    super(props);
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

    const socket = io.connect('localhost:3050');
    socket.on('connect', () => {
      console.log(`connected to backend ${socket.id}`);
    });

    socket.on('wakeup', data => {
      console.log('wakeup', data);
      this.switchRecognition();
    });

    this.state.recognition.onend = (event) => {
      console.log(event);
      this.setState({
        recognition: this.state.recognition,
        isRecording: false,
        socket: socket
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
    // close socket
    const socket = this.state.socket;
    if (socket) {
      socket.close();
    }
    // stop recognition
  }

  switchRecognition = () => {
    console.log('switch recognition');
    this.getAction('Uhrzeit')
    if(this.state.isRecording) {
      this.state.recognition.stop();
    } else {
      this.state.recognition.start();
    }
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
      body: JSON.stringify({ query: text, lang: 'en', sessionId: 'somerandomthing' })
    }).then(response => {
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
          <div className="status">
            {this.state.isRecording && <div className="isRecording"></div>}
          </div>
          <div className="container">
              <DateTime className="" />
          </div>
      </div>
    );
  }
}

export default App;
