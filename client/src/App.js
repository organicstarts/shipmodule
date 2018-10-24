import React, { Component } from 'react';
import { Image } from 'semantic-ui-react';
import logo from './logo.svg';
import {BatchOrders, FetchOrder, FraudOrders} from './components';
import 'tachyons';

class App extends Component {
  render() {
    return (
      <div className="App container tc">
        <header>
          <Image src={logo} size='medium' centered alt="Organic Start" />
        </header>
        <BatchOrders />
        <FetchOrder />
        <FraudOrders />
      </div>
    );
  }
}

export default App;
