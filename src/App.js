import React, { Component } from 'react';
import logo from './logo.png';


class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <img src={logo} style={{textAlign:'center', width:'250px', height:'auto'}} alt="logo" />
        </header>
        <div>
          <form>
            <label> 
            Batch Number:
            <input type="text" />
            </label>
            <label> 
            Picked By:
            <input type="text" />
            </label>
            <label> 
            Shipped By:
            <input type="text" />
            </label>
            <input type="submit" value="Generate Batch" />
          </form>
        </div>
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
