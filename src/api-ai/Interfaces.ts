import Constants from "./Constants";

export interface IRequestOptions {
    query?: string;
    event?: {name: string, data?: IStringMap}
    sessionId?: string;
    lang?: Constants.AVAILABLE_LANGUAGES;
}
export interface IServerResponse {
    id?: string;
    result?: IAction,
    status: {
        code: number,
        errorDetails?: string,
        errorID?: string,
        errorType: string
    };
};

export interface IAction {
  action: string,
  resolvedQuery: string,
  actionIncomplete: boolean,
  contexts: Array<IContext>,
  speech?: string,
  fulfillment?: {
      speech: string
  }
}

export interface IContext {
  name: string,
  parameters?: {},
  lifespan: number
}

export interface IStringMap { [s: string]: string; }
export interface IApiClientOptions {
    lang?: Constants.AVAILABLE_LANGUAGES;
    version?: string;
    baseUrl?: string;
    sessionId?: string;
    accessToken: string;
}
export interface IStreamClientOptions {
    server?: string;
    token?: string;
    sessionId?: string;
    lang?: Constants.AVAILABLE_LANGUAGES;
    contentType?: string;
    readingInterval?: string;
    onOpen?: Function;
    onClose?: Function;
    onInit?: Function;
    onStartListening?: Function;
    onStopListening?: Function;
    onResults?: Function;
    onEvent?: Function;
    onError?: Function;
}
