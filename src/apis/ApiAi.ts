import * as fetch from 'isomorphic-fetch';

interface IApiApiConfig {
  devAccessToken: string
}

export interface IIntent {
  id: string,
  name: string,
  actions: Array<string>,
}

/**
 * Only works with the developer access token
 */
export default class ApiAi {

  private readonly config: IApiApiConfig;

  constructor(config: IApiApiConfig) {
    this.config = config;
  }

  public getIntents: () => Promise<Array<IIntent>> = () => {
    return fetch('https://api.api.ai/v1/intents?v=20150910', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${this.config.devAccessToken}`
      }
    }).then(response => response.json<Array<IIntent>>())
  }

}
