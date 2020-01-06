import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      classes: ["6.08", "6.033", "11.111", "11.125", "21M.600"]
    }
  }
  render() {
    const classesList = this.state.classes
    .slice(this.state.classes.length-10, this.state.classes.length)
    .map(function(name) { 
        return <button id={name}>{name}</button>
    })

    return (
      <div>
      <div id="header"> 
        <h1 id="logo">Logo</h1> 
        <input type="text" placeholder="Search.." id="search" />
      </div>
      <div id="class bubbles">
        <ul>
          {classesList}
        </ul>
      </div>
      <div id="body">
        <div id="class header"> </div>
        <div id="list of people"> </div>
      </div>
      </div>
    );
  }
}

export default App;
