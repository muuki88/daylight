import {IVoiceControl, IVoiceControlConfig} from './IVoiceControl';
import {IServerResponse, IAction, IContext} from '../api-ai/Interfaces';

/*
 *  === Web Speech API ===
 *
 * @see https://www.chromium.org/developers/how-tos/api-keys
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
 * @see https://groups.google.com/a/chromium.org/forum/#!topic/chromium-dev/5PrGai_wOZU
 */
export default class GoogleWebSpeechApiVoiceControl implements IVoiceControl {

  private readonly recognition: SpeechRecognition;
  private readonly config: IVoiceControlConfig;

  private currentRequest?: Promise<IServerResponse>;
  private currentResolve?: (value?: IServerResponse | Promise<IServerResponse>) => void;
  private currentReject?: (reason?: any) => void;

  constructor(config: IVoiceControlConfig) {
    this.recognition = new webkitSpeechRecognition();
    this.recognition.lang = 'de-DE';
    this.recognition.onstart = this.onRecognitionStart;
    this.recognition.onend = this.onRecognitionEnd;
    this.recognition.onresult = this.onRecognitionResult;

    if (this.config.onError) {
      this.recognition.onerror = this.config.onError;
    }

    this.config = config;
  }

  startRecognition(): Promise<IServerResponse> {
    if (this.isReady()) {
      const request = new Promise((resolve, reject) => {
          this.currentResolve = resolve;
          this.currentReject = reject;
      });
      this.currentRequest = request;
      return request;
    }
    // TODO introduce error type
    return Promise.reject({error: 'request in progress'});
  }

  close(): void {
    this.recognition.stop();
    if (this.currentReject) {
      this.currentReject();
    }
    this.reset();
  }

  private isReady = () => !this.currentRequest;

  private onRecognitionStart = () => {
    if (this.config.onStartListening) {
      this.config.onStartListening();
    }
  }

  private onRecognitionEnd = () => {
    if (this.config.onStopListening) {
      this.config.onStopListening();
    }
  }

  private onRecognitionResult = (event: SpeechRecognitionEvent) => {
    let text = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      text += event.results[i][0].transcript;
    }
    this.getAction(text);
  }

  private getAction = (text: string) => {
      // TODO use api-ai client for this
      fetch('https://api.api.ai/v1/query?v=20150910', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${this.config.accessToken}`
        },
        body: JSON.stringify({ query: text, lang: 'de', sessionId: 'wally-mirror' })
      }).then(this.parseApiAiResponse)
        .then(this.resolveCurrentRequest)
        .catch(this.onError)
        .then(this.reset);
    }

    private parseApiAiResponse: (IResponse) => Promise<IServerResponse> = (response: IResponse) => {
      return response.json().then(json => json as IServerResponse);
    }

    private resolveCurrentRequest = (response: IServerResponse) => {
      if (this.currentResolve) {
        this.currentResolve(response);
      }
    }

    private onError = (error: any) => {
      if (this.currentReject) {
        this.currentReject(error);
      }
    }

    private reset = () => {
      this.currentResolve = null;
      this.currentReject = null;
      this.currentRequest = null;
    }

}
