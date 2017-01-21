import * as React from 'react';
import * as io from 'socket.io-client';

// https://coolors.co/8aea92-80ada0-5f5566-33202a-000000
const styles = require<any>('./index.css');

interface IControlState {
  lastCommand?: string
}

class Control extends React.Component<void, IControlState> {

  readonly socket: SocketIOClient.Socket;

  constructor() {
    super();
    this.socket = io.connect('localhost:3050');
    this.state = {};
  }

  sendCommand = (command: string) => () => {
    this.socket.send(command);
    this.setState({lastCommand: command})
  };

  componentWillMount() {
    this.socket.connect();
  }

  componentWillUnmount() {
    this.socket.close();
  }

  render() {
    return <div className={styles.Control}>
      <button onClick={this.sendCommand('katzen')}>Katzen</button>
      <button onClick={this.sendCommand('uhrzeit')}>Uhrzeit</button>
    </div>
  }
}

export default Control;
