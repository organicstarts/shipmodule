import React, { Component } from 'react';
import logo from './logo.png';
import BatchOrder from './components/BatchOrder/BatchOrder';
import 'tachyons';

class App extends Component {
  render() {
    return (
      <div className="App tc">
        <header>
          <img src={logo} style={{textAlign:'center', width:'250px', height:'auto'}} alt="logo" />
        </header>
        <BatchOrder />
        <div>
          <form>
           <label> 
              Order Number:
              <input type="text" />
          </label>
          <input type="submit" value="Fetch Order" />
          </form>
        </div>
        <div>
          <button>
           Search for Fraudulent Orders
         </button>
        </div>
      </div>
    );
  }
}

export default App;
