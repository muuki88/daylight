import * as fetch from 'isomorphic-fetch';

// TODO see if we can put this into modules/namespaces

// Random API models

export interface IGiphyRandomImage {
  type: string,
  id: string,
  // fixed height downsampled
  fixed_height_downsampled_url: string,
  fixed_height_downsampled_width: number,
  fixed_height_downsampled_height: number
}

interface IGiphyRandomImageResponse {
  data: IGiphyRandomImage
}

// Search API models

interface IGiphySearchImageMeta {
  url: string,
  width: number,
  height: number
}

interface IGiphySearchImageMeta {
  url: string,
  width: number,
  height: number
}

export interface IGiphySearchImage {
  id: string,
  type: string,
  images: {
    fixed_height_downsampled: IGiphySearchImageMeta
  }
}

interface IGiphySearchResponse {
  data: Array<IGiphySearchImage>
}

export interface IGiphyConfig {
  apiKey: string
}

export default class Giphy {

  private readonly config: IGiphyConfig;

  constructor(config: IGiphyConfig) {
    this.config = config;
  }

  public searchRandomImage: (string) => Promise<IGiphyRandomImage> = (tag: string) => {
    return fetch(`http://api.giphy.com/v1/gifs/random?api_key=${this.config.apiKey}&tag=${encodeURI(tag)}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    })
    .then(response => response.json<IGiphyRandomImageResponse>())
    .then(image => image.data);
  }

  public searchImage: (string) => Promise<IGiphySearchImage> = (query: string) => {
    const limit = 10;
    const search = encodeURI(query);
    return fetch(`http://api.giphy.com/v1/gifs/search?api_key=${this.config.apiKey}&limit=${limit}&q=${search}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    })
    .then(response => response.json<IGiphySearchResponse>())
    .then(this.extractImage);
  }

  private extractImage(response: IGiphySearchResponse): IGiphySearchImage {
    const data = response.data;
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  }
}
