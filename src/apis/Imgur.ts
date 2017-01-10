import * as fetch from 'isomorphic-fetch';

export interface IImgurImage {
  id: string,
  title: string,
  type: string,
  animated: boolean,
  height: number,
  width: number,
  link: string,
  gifv: string,
  mp4: string
}

interface IImgurGalleryResponse {
  data: Array<IImgurImage>
}

export interface IImgurConfig {
  clientId: string
}

export default class Imgur {

  private readonly config: IImgurConfig;

  constructor(config: IImgurConfig) {
    this.config = config;
  }

  public searchImage: (string) => Promise<IImgurImage> = (query: string) => {
    const params = encodeURI(query);
    return fetch(`https://api.imgur.com/3/gallery/search?&q=${params}`, {
      method: 'GET',
      headers: {
        Authorization: `Client-ID ${this.config.clientId}`,
        Accept: 'application/json'
      }
    })
    .then(response => response.json<IImgurGalleryResponse>())
    .then(this.extractImage)
  }

  private extractImage(response: IImgurGalleryResponse): IImgurImage {
    const data = response.data;
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  }
}
