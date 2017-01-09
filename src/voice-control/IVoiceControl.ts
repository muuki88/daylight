import {IServerResponse, IAction, IContext} from '../api-ai/Interfaces';

export interface IVoiceControl {

  /**
   * Starts the voice recognition and returns the api.ai response.
   *
   * If a recognition is already running, or the current request is not completed
   * startRecognition will return a rejected result.
   */
  startRecognition(): Promise<IServerResponse>


  /**
   * stop and close current recognition system
   */
  close(): void

}

export interface IVoiceControlConfig {
  readonly accessToken: string,
  onResults(response: IServerResponse): void,
  onInit?(): void,
  onStartListening?(): void,
  onStopListening?(): void,
  onError?(error: any): void
}
