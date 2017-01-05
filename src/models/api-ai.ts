/**
 * @see https://github.com/api-ai/api-ai-javascript/blob/v2/src/Interfaces.ts
 */
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
  fulfillment?: {
      speech: string
  }
}

export interface IContext {
  name: string,
  parameters?: {},
  lifespan: number
}

export interface IRequestOptions {
    query?: string;
    sessionId?: string;
    lang?: string;
}

// define actions as enums
// https://www.typescriptlang.org/docs/handbook/basic-types.html#enum
