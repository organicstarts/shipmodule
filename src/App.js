import React, { Component } from 'react';
import logo from './logo.svg';
import { Image } from 'semantic-ui-react';
import Batch from './components/BatchOrders/BatchOrders';
import Order from './components/FetchOrder/FetchOrder';
import Fraud from './components/FraudOrders/FraudOrders';
import 'tachyons';

class App extends Component {
  render() {
    return (
      <div className="App container tc">
        <header>
          <Image src={logo} size='medium' centered alt="Organic Start" />
        </header>
        <Batch />
        <Order />
        <Fraud />
      </div>
    );
  }
}

export default App;
