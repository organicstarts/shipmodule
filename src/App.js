import React, { Component } from 'react';
import logo from './logo.png';
import BatchOrder from './components/BatchOrder/BatchOrder';
import FetchOrder from './components/FetchOrder/FetchOrder';
import FraudulentOrder from './components/FraudulentOrder/FraudulentOrder';
import 'tachyons';

class App extends Component {
  render() {
    return (
      <div className="App tc">
        <header>
          <img src={logo} style={{textAlign:'center', width:'250px', height:'auto'}} alt="logo" />
        </header>
        <BatchOrder />
        <FetchOrder />
        <FraudulentOrder />
      </div>
    );
  }
}

export default App;
