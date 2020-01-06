import React from 'react';
import logo from './logo.svg';
import './App.css';

// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

var db = firebase.firestore();

class App extends React.Component {
  constructor () {
    super()
    this.state = {
      classes: ["6.08", "6.033", "11.111", "11.125", "21M.600"],
      class: "6.08"
    }
    var firebaseConfig = {
      apiKey: "api-key",
      authDomain: "project-id.firebaseapp.com",
      databaseURL: "https://project-id.firebaseio.com",
      projectId: "project-id",
      storageBucket: "project-id.appspot.com",
      messagingSenderId: "sender-id",
      appId: "app-id",
      measurementId: "G-measurement-id",
    };
    
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }
  render() {
    const classesList = this.state.classes
    .slice(this.state.classes.length-10, this.state.classes.length)
    .map(function(name) { 
        return <button id={name} onClick={handleClick(name)}>{name}</button>
    })

    const self = this
    const handleClick = function(name) {
      self.setState({class: name})
    }

    const listOfPeople = db
      .collection(this.state.class)
      .orderBy("name", "incr")
      .get()
      .
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
        <ol id="list of people"> 
          
        </ol> 
      </div>
      </div>
    );
  }
}

export default App;
