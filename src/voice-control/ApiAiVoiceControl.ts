import {IVoiceControl, IVoiceControlConfig} from './IVoiceControl';
import {IServerResponse, IAction, IContext} from '../api-ai/Interfaces';
import {Client} from '../api-ai/Client';
import ApiAiConstants from '../api-ai/Constants';
import StreamClient from '../api-ai/Stream/StreamClient';

export enum StreamClientState {
  CREATED,
  INITIALIZED,
  OPEN,
  LISTENING,
  CLOSED
}

export default class ApiAiVoiceControl implements IVoiceControl {

  readonly streamClient: StreamClient;

  private state: StreamClientState
  private currentRequest?: Promise<IServerResponse>;
  private currentResolve?: (value?: IServerResponse | Promise<IServerResponse>) => void;
  private currentReject?: (reason?: any) => void;

  constructor(config: IVoiceControlConfig) {
    const client = new Client({
      accessToken: config.accessToken,
      lang: this.parseLang(config.lang)
    });
    this.streamClient = client.createStreamClient({
      onResults: this.onRecognitionResult,
      onInit: () => this.setState(StreamClientState.INITIALIZED),
      onOpen: () => this.setState(StreamClientState.OPEN),
      onClose: () => this.setState(StreamClientState.CLOSED),
      onStartListening: () => this.setState(StreamClientState.LISTENING),
      onStopListening: this.onStopListening,
      onError: this.onError
    });

    this.streamClient.init();
  }

  startRecognition(): Promise<IServerResponse> {
    if (this.isReady()) {
      const request = new Promise((resolve, reject) => {
          this.currentResolve = resolve;
          this.currentReject = reject;
      });
      this.currentRequest = request;

      // check current state
      if (this.state === StreamClientState.INITIALIZED || this.state === StreamClientState.CLOSED) {
        this.streamClient.open();
      } else if (this.state === StreamClientState.OPEN) {
        this.streamClient.startListening();
      }
      return request;
    }
    // TODO introduce error type
    return Promise.reject({error: 'request in progress', state: StreamClientState[this.state]});
  }

  close(): void {
    this.streamClient.stopListening();
    this.streamClient.close();
  }

  private parseLang = (lang: String) => {
    switch (lang) {
      case 'de':
      case 'DE':
      case null:
      case undefined:
        return ApiAiConstants.AVAILABLE_LANGUAGES.DE;
      case 'en':
      case 'EN':
        return ApiAiConstants.AVAILABLE_LANGUAGES.EN;
      default: throw new Error(`Invalid language ${lang}. Use 'de' or 'en'`);
    }
  }

  private isReady = () => !this.currentRequest && this.state !== StreamClientState.LISTENING;

  /*
   * The state machine is encoded here.
   *
   * FIXME encode all state transitions correcly
   * FIXME remove check from onStopListening
   */
  private setState = (state: StreamClientState) => {
    this.state = state;
    switch (state) {
      case StreamClientState.INITIALIZED:
        this.streamClient.open();
        return;
      case StreamClientState.OPEN:
        // Google's Speech API automatically detects the end of the sentences and stops
        // For api.ai we must do this manually
        if (!this.isReady()) {
          this.streamClient.startListening();
        }
        return;
      case StreamClientState.LISTENING:
        // listen 5 seconds
        // http://stackoverflow.com/questions/24515978/html-audio-recording-until-silence
        setTimeout(this.streamClient.stopListening, 5000);
        return;
      default:
        return;
    }
  }

  private onRecognitionResult = (apiAiResponse: IServerResponse) => {
    if (this.currentResolve) {
      this.currentResolve(apiAiResponse);
    }
    this.reset();
  }

  private onStopListening = () => {
    // only set the new state to open if it hasn't been changed otherwise
    // if (this.state === StreamClientState.LISTENING) {
    //   this.setState(StreamClientState.OPEN);
    // }
  }

  private onError = (error, message) => {
    if (this.currentReject) {
      this.currentReject({id: error, message: message})
    }
    this.reset();
  }

  private reset = () => {
    this.currentResolve = null;
    this.currentReject = null;
    this.currentRequest = null;
  }
}
