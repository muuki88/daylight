import * as React from 'react';
import * as fetch from 'isomorphic-fetch';

const styles = require<any>('./index.css');

interface IForeCatsProps {
  clientId: string
}

interface IImgurImage {
  id: string,
  title: string,
  type: string,
  animated: boolean,
  link: string,
  gifv: string,
  mp4: string
}

interface IImgurGalleryResponse {
  data: Array<IImgurImage>
}

class ForeCats extends React.Component<IForeCatsProps, {imageUrl?: string}> {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

    const clientId = this.props.clientId;
    const params = encodeURI('(cats OR cat OR kitten OR kitties) AND animated: true&page=0');

    fetch(`https://api.imgur.com/3/gallery/search?q=${params}`, {
      method: 'GET',
      headers: {
        Authorization: `Client-ID ${clientId}`,
        Accept: 'application/json'
      }
    })
    .then(this.parseImgurApiResponse)
    .then(this.updateState);
  }

  parseImgurApiResponse = (response: IResponse) => {
    return response.json().then(json => json as IImgurGalleryResponse);
  }

  updateState = (images: IImgurGalleryResponse) => {
    const randomIndex = Math.floor(Math.random() * images.data.length);
    this.setState({
      imageUrl: images.data[randomIndex].link
    })
  }

  render() {
    return <div className={styles.ForeCats}>
      {this.state.imageUrl && <img src={this.state.imageUrl} />}
    </div>
  }
}

export default ForeCats;
