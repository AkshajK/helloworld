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

        <script src="https://www.gstatic.com/firebasejs/7.6.1/firebase-app.js"></script>
        <script src="https://www.gstatic.com/firebasejs/7.6.1/firebase-analytics.js"></script>
        <script src="https://www.gstatic.com/firebasejs/7.6.1/firebase-firestore.js"></script>

        <script>
          // Your web app's Firebase configuration
          var firebaseConfig = {
            apiKey: "AIzaSyDVdohGwcKZibRusfG6IGCq3CBFCVGdka0",
            authDomain: "schedule-comparator.firebaseapp.com",
            databaseURL: "https://schedule-comparator.firebaseio.com",
            projectId: "schedule-comparator",
            storageBucket: "schedule-comparator.appspot.com",
            messagingSenderId: "521939045676",
            appId: "1:521939045676:web:6cdf2357f23e33e58fb089",
            measurementId: "G-V4VQ51GDDZ"
          };
          // Initialize Firebase
          firebase.initializeApp(firebaseConfig);
          firebase.analytics();
        </script>
      </div>
      </div>
    );
  }
}

export default App;
