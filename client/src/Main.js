import React, { Component } from 'react';
import { Image } from 'semantic-ui-react';
import logo from './logo.svg';
import { withRouter } from 'react-router-dom'
import {BatchOrders, FetchOrder, FraudOrders} from './components';
import 'tachyons';

class Main extends Component {
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

export default withRouter(Main);