import * as React from 'react';

const styles = require<any>('./index.css');

interface IIntentsProps {
  lang: string
}

interface IIntent {
  name: string,
  description: string
}

interface IIntents {
  en: Array<IIntent>,
  de: Array<IIntent>
}


class Intents extends React.Component<IIntentsProps, {intents: IIntents}> {

  constructor(props) {
    super(props);
    this.state = {
      intents: {
        en: [
          this.createIntent('Cats', 'Show me some cats'),
          this.createIntent('Clock', 'What time is it')
        ],
        de: [
          this.createIntent('Katzen', 'Zeig mir ein paar katzen'),
          this.createIntent('Uhrzeit', 'Wieviel Uhr ist es')
        ]
      }
    };
  }

  render() {
    const lang = this.props.lang;
    return <div className={styles.Intents}>
      <ul>
        {this.state.intents[lang].map(intent => <li key={intent.name} className={styles.Intents_List}>
            <strong>{intent.name}</strong> : <small>{intent.description}</small>
          </li>)}
      </ul>
    </div>;
  }

  private createIntent(name: string, description: string): IIntent {
    return {name, description};
  };
}

export default Intents;
