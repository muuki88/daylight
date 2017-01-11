import * as React from 'react';
import * as ReactRouter from 'react-router'
import * as fetch from 'isomorphic-fetch';
import * as io from 'socket.io-client';

import {Client} from '../api-ai/Client';
import ApiAiConstants from '../api-ai/Constants';
import StreamClient from '../api-ai/Stream/StreamClient';

import {IVoiceControl} from '../voice-control/IVoiceControl';
import GoogleWebSpeechApiVoiceControl from '../voice-control/GoogleWebSpeechApiVoiceControl';
import ApiAiVoiceControl from '../voice-control/ApiAiVoiceControl';

import DateTime from '../DateTime';
import Cats from '../Cats';
import UnkownInput from '../UnkownInput';
import Intents from '../Intents';
import Recording from './Recording';

import {IServerResponse, IAction, IContext} from '../api-ai/Interfaces';

const styles = require<any>('./index.css');


interface IAppState {
  isRecording: boolean,
  action?: IAction,
  error?: {}
}

interface IQueryParams {
  API_AI_ACCESSTOKEN: string,
  IMGUR_CLIENTID: string,
  LANG: string // de and en supported
}

interface IAppProps extends ReactRouter.RouteComponentProps<{}, {}> {
}

class App extends React.Component<IAppProps, IAppState> {

  readonly socket: SocketIOClient.Socket;
  readonly voiceControl: IVoiceControl;

  constructor(props) {
    super(props);
    this.socket = io.connect('localhost:3050');

    // voice control setup
    const voiceControlConfig = {
      accessToken: this.queryParams().API_AI_ACCESSTOKEN,
      lang: this.queryParams().LANG
    };
    // TODO make this configurable
    // this.voiceControl = new GoogleWebSpeechApiVoiceControl(voiceControlConfig);
    this.voiceControl = new ApiAiVoiceControl(voiceControlConfig);
    //

    this.socket.on('connect', () => {
      console.log(`connected to backend ${this.socket.id}`);
    });

    // server send commands
    this.socket.on('wakeup', this.onWakeWord);
    this.socket.on('reload', this.onRefresh);
    this.socket.on('text', this.getAction);

    this.state = {
      isRecording: false
    };
  }

  componentWillUnmount() {
    this.socket.close();
    // stop listening
    this.voiceControl.close();
  }

  onRefresh = () => window.location.reload()

  onWakeWord = () => {
    this.setState({isRecording: true});
    this.voiceControl.startRecognition()
      .then(this.updateState)
      .catch(this.updateErrorState);

  }

  // TODO use the client for this
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
      speech: 'Das war absolut unverständlich :('
    }

    this.setState({
      isRecording: false,
      action: (action as IAction)
    });
    return action as IAction;
  }

  updateErrorState = (error: any) => {
    this.setState({
      isRecording: false,
      error: error
    });
  }

  queryParams(): IQueryParams {
    return this.props.location.query as IQueryParams;
  }

  render() {
    const isRecording = this.state.isRecording;
    return (
      <div className={styles.App}>
          <div className={styles.status}>
            {isRecording && <div className={styles.isRecording}></div>}
          </div>
          <div className={styles.container}>
            {isRecording ? <Recording /> : (
              this.state.action ? this.renderAction(this.state.action) : <DateTime />
            )}
          </div>
      </div>
    );
  }

  renderAction = (action: IAction) => {
    const params = this.queryParams();
    const imgurClientId = params.IMGUR_CLIENTID;
    switch (action.action) {
      case 'clock.show': return <DateTime />;
      case 'cats.show': return <Cats clientId={imgurClientId} />;
      case 'mirror.intents': return <Intents lang={params.LANG}/>
      case 'input.unknown':
      default:
        const speech = this.state.error ?
          JSON.stringify(this.state.error) :
          (action.speech || action.fulfillment.speech);
        return <UnkownInput speech={speech} />
    }
  }
}

export default App;
