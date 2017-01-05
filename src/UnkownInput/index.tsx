import * as React from 'react';

const styles = require<any>('./index.css');

interface IUnkownInputProps {
  speech: string
}

class UnkownInput extends React.Component<IUnkownInputProps, void> {

  render() {
    const {speech} = this.props;
    return <div className={styles.UnkownInput}>
      <h1>{speech}</h1>
    </div>
  }
}

export default UnkownInput;
