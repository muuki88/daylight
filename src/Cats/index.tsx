import * as React from 'react';
import * as fetch from 'isomorphic-fetch';

import Imgur, {IImgurImage} from '../apis/Imgur';
import Giphy, {IGiphyRandomImage, IGiphySearchImage} from '../apis/Giphy';

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

class Cats extends React.Component<ICatsProps, ICatsState> {

  private readonly imgur: Imgur;
  private readonly giphy: Giphy;

  constructor(props) {
    super(props);
    this.imgur = new Imgur({clientId: this.props.clientId});
    this.giphy = new Giphy({apiKey: 'dc6zaTOxFJmzC'});
    this.state = {};
  }

  componentDidMount() {
    this.fetchFromGiphyRandom('cats funny');
  }

  fetchFromImgur = () => {
    this.imgur.searchImage('(cats OR cat OR kitten OR kitties) AND animated: true&page=0')
      .then(this.parseImgurApiResponse)
      .then(this.updateState)
      .catch(this.onError);
  }

  fetchFromGiphyRandom = (tag: string) => {
    this.giphy.searchRandomImage(tag)
      .then(this.parseGiphyRandomApiResponse)
      .then(this.updateState)
      .catch(this.onError);
  }

  fetchFromGiphySearch = () => {
    this.giphy.searchImage('cats funny')
      .then(this.parseGiphySearchApiResponse)
      .then(this.updateState)
      .catch(this.onError);
  }

  parseImgurApiResponse(image: IImgurImage): ICatsState {
    return {
      imageUrl: image.link,
      imageHeight: image.height,
      imageWidth: image.width,
      imageType: image.type
    };
  }

  parseGiphySearchApiResponse = (image: IGiphySearchImage) => {
    const downsampledImage = image.images.fixed_height_downsampled;
    return {
      imageUrl: downsampledImage.url,
      imageHeight: downsampledImage.height,
      imageWidth: downsampledImage.width,
      imageType: image.type
    }
  }

  parseGiphyRandomApiResponse = (image: IGiphyRandomImage) => {
    return {
      imageUrl: image.fixed_height_downsampled_url,
      imageHeight: image.fixed_height_downsampled_height,
      imageWidth: image.fixed_height_downsampled_width,
      imageType: image.type
    };
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
