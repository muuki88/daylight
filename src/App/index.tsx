import * as React from 'react';
import * as ReactRouter from 'react-router'
import * as fetch from 'isomorphic-fetch';
import * as io from 'socket.io-client';

import {Client} from '../api-ai/Client';
import ApiAiConstants from '../api-ai/Constants';
import StreamClient from '../api-ai/Stream/StreamClient';

import DateTime from '../DateTime';
import ForeCats from '../ForeCats';
import UnkownInput from '../UnkownInput';
import Recording from './Recording';

import {IServerResponse, IAction, IContext} from '../api-ai/Interfaces';

const styles = require<any>('./index.css');

const ONE_MINUTE = 1000 * 60;
const ONE_HOUR = 60 * ONE_MINUTE;

enum StreamClientState {
  CREATED,
  INITIALIZED,
  OPEN,
  LISTENING,
  CLOSED,
  ERROR
}

interface IAppState {
  streamClientState: StreamClientState,
  action?: IAction
}

interface IQueryParams {
  API_AI_ACCESSTOKEN: string,
  IMGUR_CLIENTID: string
}

interface IAppProps extends ReactRouter.RouteComponentProps<{}, {}> {
}

class App extends React.Component<IAppProps, IAppState> {

  readonly socket: SocketIOClient.Socket;
  readonly streamClient: StreamClient;


  constructor(props) {
    super(props);
    this.socket = io.connect('localhost:3050');

    // socket-io client
    const client = new Client({
      accessToken: this.queryParams().API_AI_ACCESSTOKEN,
      lang: ApiAiConstants.AVAILABLE_LANGUAGES.DE
    });
    this.streamClient = client.createStreamClient({
      onInit: () => this.setState({streamClientState: StreamClientState.INITIALIZED}),
      onResults: this.onRecognitionResult,
      onOpen: (id, message) => {
        this.setState({streamClientState: StreamClientState.OPEN});
        this.startRecognition();
      },
      onClose: () => this.setState({streamClientState: StreamClientState.CLOSED}),
      onStartListening: () => this.setState({streamClientState: StreamClientState.LISTENING}),
      onStopListening: () => this.setState({streamClientState: StreamClientState.OPEN}),
      // TODO display some error messages
      onError: (error, message) => {
        console.log('onError', error, message);
        this.setState({streamClientState: StreamClientState.ERROR})
      }
      // for debugging
      // onEvent: (id, message) => {
      //   console.log('event', id, message)
      // }
    });

    this.streamClient.init();

    this.socket.on('connect', () => {
      console.log(`connected to backend ${this.socket.id}`);
    });

    // server send commands
    this.socket.on('wakeup', this.onWakeWord);
    this.socket.on('reload', this.onRefresh);
    this.socket.on('text', this.getAction);

    this.state = {
      streamClientState: StreamClientState.CREATED
    };
  }

  componentWillUnmount() {
    this.socket.close();
    // stop listening
  }

  onRefresh = () => window.location.reload()

  onWakeWord = () => {
    if (this.state.streamClientState === StreamClientState.OPEN) {
      this.startRecognition();
    } else if (
      this.state.streamClientState === StreamClientState.CLOSED ||
      this.state.streamClientState === StreamClientState.INITIALIZED ) {
      // open will trigger listening afterwards
      this.streamClient.open();
    }
  }

  startRecognition = () => {
    this.streamClient.startListening();
    this.setState({
      streamClientState: StreamClientState.LISTENING
    });
    // listen 5 seconds
    // http://stackoverflow.com/questions/24515978/html-audio-recording-until-silence
    setTimeout(this.stopRecognition, 4000);
  }

  stopRecognition = () => {
    // Google's Speech API automatically detects the end of the sentences and stops
    // For api.ai we must do this manually
    this.streamClient.stopListening();
    this.setState({
      streamClientState: StreamClientState.OPEN
    });
  }

  onRecognitionResult = (apiAiResponse: IServerResponse) => {
    this.setState({
      streamClientState: this.state.streamClientState,
      action: apiAiResponse.result
    });
  }

  getAction = (text: string) => {
    const accessToken = this.queryParams().API_AI_ACCESSTOKEN;
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
      .then(this.updateState)
      // Only for API AI client
      // .then(this.onRecognitionEnd)
      .catch(error => {
        console.log(error);
    });
  }

  parseApiAiResponse = (response: IResponse) => {
    return response.json().then(json => json as IServerResponse);
  }


  refreshSite = () => {
    window.location.reload();
  }

  updateState: (IServerResponse) => IAction = (apiAiResponse: IServerResponse) => {
    const action = apiAiResponse.status.code === 200 ? apiAiResponse.result : {
      action: 'unkown.input',
      fulfillment: {
        speech: 'Das war absolut unverständlich :('
      }
    }

    this.setState({
      streamClientState: this.state.streamClientState,
      action: (action as IAction)
    });
    return action as IAction;
  }

  queryParams(): IQueryParams {
    return this.props.location.query as IQueryParams;
  }

  isRecording = () => this.state.streamClientState === StreamClientState.LISTENING;

  render() {
    return (
      <div className={styles.App}>
          <div className={styles.streamClientState}>
            {StreamClientState[this.state.streamClientState]}
          </div>
          <div className={styles.status}>
            {this.isRecording() && <div className={styles.isRecording}></div>}
          </div>
          <div className={styles.container}>
            {this.isRecording() ? <Recording /> : (
              this.state.action ? this.renderAction(this.state.action) : <DateTime />
            )}
          </div>
      </div>
    );
  }

  renderAction = (action: IAction) => {
    const imgurClientId = this.queryParams().IMGUR_CLIENTID;
    switch (action.action) {
      case 'clock.show': return <DateTime />;
      case 'cats.show': return <ForeCats clientId={imgurClientId} />;
      case 'input.unknown':
      default: return <UnkownInput speech={action.fulfillment.speech} />
    }
  }
}

export default App;
