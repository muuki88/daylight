import * as React from 'react';
import * as fetch from 'isomorphic-fetch';

const styles = require<any>('./index.css');

interface ICatsProps {
  clientId: string
}

interface ICatsState {
  imageUrl?: string,
  imageHeight?: number,
  imageWidth?: number,
  imageType?: string
}

interface IImgurImage {
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

interface IGiphyRandomImage {
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

interface IGiphySearchImage {
  id: string,
  type: string,
  images: {
    fixed_height_downsampled: IGiphySearchImageMeta
  }
}

interface IGiphySearchResponse {
  data: Array<IGiphySearchImage>
}

class Cats extends React.Component<ICatsProps, ICatsState> {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.fetchFromGiphyRandom('cats funny');
  }

  fetchFromImgur = () => {
    const clientId = this.props.clientId;
    const params = encodeURI('(cats OR cat OR kitten OR kitties) AND animated: true&page=0');

    fetch(`https://api.imgur.com/3/gallery/search?&q=${params}`, {
      method: 'GET',
      headers: {
        Authorization: `Client-ID ${clientId}`,
        Accept: 'application/json'
      }
    })
    .then(this.parseImgurApiResponse)
    .then(this.updateState)
    .catch(this.onError);
  }

  fetchFromGiphyRandom = (tag: string) => {
    const betaApiKey = 'dc6zaTOxFJmzC';
    fetch(`http://api.giphy.com/v1/gifs/random?api_key=${betaApiKey}&tag=${encodeURI(tag)}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    })
    .then(this.parseGiphyRandomApiResponse)
    .then(this.updateState)
    .catch(this.onError);
  }

  fetchFromGiphySearch = () => {
    const betaApiKey = 'dc6zaTOxFJmzC';
    const limit = 10;
    const search = encodeURI('cats funny');
    fetch(`http://api.giphy.com/v1/gifs/search?api_key=${betaApiKey}&limit=${limit}&q=${search}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    })
    .then(this.parseGiphySearchApiResponse)
    .then(this.updateState)
    .catch(this.onError);
  }

  parseImgurApiResponse = (response: IResponse) => {
    return response.json().then(json => {
      const data = (json as IImgurGalleryResponse).data;
      const randomIndex = Math.floor(Math.random() * data.length);
      const image = data[randomIndex];
      return {
        imageUrl: image.link,
        imageHeight: image.height,
        imageWidth: image.width,
        imageType: image.type
      }
    });
  }

  parseGiphySearchApiResponse = (response: IResponse) => {
    return response.json().then(json => {
      const data = (json as IGiphySearchResponse).data;
      const randomIndex = Math.floor(Math.random() * data.length);
      const image = data[randomIndex];
      const downsampledImage = image.images.fixed_height_downsampled;
      return {
        imageUrl: downsampledImage.url,
        imageHeight: downsampledImage.height,
        imageWidth: downsampledImage.width,
        imageType: image.type
      }
    });
  }

  parseGiphyRandomApiResponse = (response: IResponse) => {
    return response.json().then(json => {
      const image = (json as IGiphyRandomImageResponse).data;
      return {
        imageUrl: image.fixed_height_downsampled_url,
        imageHeight: image.fixed_height_downsampled_height,
        imageWidth: image.fixed_height_downsampled_width,
        imageType: image.type
      }
    });
  }

  updateState = (newState: ICatsState) => this.setState(newState);

  onError = () => {
    // fallback
    this.setState({
      imageUrl: 'http://media1.giphy.com/media/lNuGIQtvb6q76/200_d.gif',
      imageWidth: 347,
      imageHeight: 200,
      imageType: 'gif'
    });
  }

  render() {
    console.log(this.state)
    return <div className={styles.Cats}>
      {this.state.imageUrl && <img src={this.state.imageUrl} height={this.state.imageHeight} width={this.state.imageWidth} />}
    </div>
  }
}

export default Cats;
