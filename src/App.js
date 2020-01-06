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

class App extends React.Component {
  constructor () {
    super()
    const self = this 
    var classeslist = ["6.08", "6.033", "11.111", "11.125", "21M.600"]
    this.state = {
      classes: classeslist,
      class: "6.08",
      people: {"6.08": [], "6.033": [], "11.111": [], "11.125": [], "21M.600": []}
    }
    const firebaseConfig = {
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
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    
    self.db = firebase.firestore();
    
  }

  componentDidMount() {
    var i;
    const self = this
    for(i = 0; i < self.state.classes.length; i++) {
      let curArr = []
      const index = i;
      const listofscores = self.db
      .collection("classes")
      .doc(self.state.classes[i])
      .collection("ListOfPeople")
      .orderBy("name", "asc")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
  
          var data = doc.data()

          curArr.push(data.name)
          
          console.log(data.name + "<--")
        });
      }).then(() => {
        // TODO copy over the individual keys and values from state.people
        var newPeople = this.state.people
        console.log(index)
        newPeople[this.state.classes[index]] = curArr
        console.log(newPeople[this.state.classes[index]])
        console.log(curArr.length)
        this.setState({people: newPeople}, () => {
          console.log("setState callback")
          console.log(self.state.people[self.state.classes[index]])
        })
        //console.log("got all people")
      })
    }

  }

  render() {
    console.log("rendering");
    console.log("state is: ", this.state)
    const self = this
    const handleClick = function (name) {
      self.setState({class: name})
      console.log("set class to " + name)
     
    }
    const classesList = self.state.classes
    .slice(self.state.classes.length-10, self.state.classes.length)
    .map(function (name) { 
        return <button id={name} onClick={() => handleClick(name)}>{name}</button>
    })

    const listOfPeopleLi = self.state.people[self.state.class].map(function (name) { 
      return <li id={name}>{name}</li>
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
        <ul id="list of people"> 
          {listOfPeopleLi}
        </ul> 
      </div>
      </div>
    );
  }
}

export default App;
