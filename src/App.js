import React, { Component } from 'react';
import Select from 'react-select';
import { Link, Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import logo from './logo.svg';
import './App.css';
import Login from './login'
import Register from './register'
import Searchbar from "./searchbar"
import source from "./classes"
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";


function randomStr(len, arr) { 
        var ans = ''; 
        for (var i = len; i > 0; i--) { 
            ans +=  
              arr[Math.floor(Math.random() * arr.length)]; 
        } 
        return ans; 
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


class App extends React.Component {
  constructor () {
    super()
    this.db = firebase.firestore();
    const self = this 
    // update with actual list
    var classeslist = [];
    var blankPeople = {}
    var i;
    for(i =0; i<source.length; i++) {
      classeslist.push(source[i].title)
      blankPeople[source[i].title] = []
    }
    //blankPeople["21M.600"] = []
    this.state = {
      classeslist: classeslist,
      classes: ["6.08"],
      class: "6.08",
      people: blankPeople,
      user: "Joe Mama",
      searchQuery: ""
    }
    this.updateClass = (classtoadd) => {
      var newlist = this.state.classes.slice()
      if (newlist.includes(classtoadd)) {
        return
      }
      newlist.push(classtoadd) 
      this.setState({classes: newlist})
      // alert(firebase.auth().currentUser['email'])
    };

    this.updateUser = (data) => {
      let email = firebase.auth().currentUser['email']
      alert(email.substring(0, email.indexOf('@')))

      this.setState({user: data['name']})
    };
  }

  componentDidMount() {
    var i;
    const self = this
    var newPeople = this.state.people
    const listofscores = this.db
      .collection("classes")
      .get()
      .then((querySnapshot) => {
        let curArr = []
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
         // console.log(doc)
          var classname = doc.id
          const listofpeople = this.db.collection("classes").doc(classname).collection("ListOfPeople")
          .orderBy("name", "asc")
          .get()
          .then((querySnapshot) => {
              querySnapshot.forEach(function(doc1) {
              // doc.data() is never undefined for query doc snapshots
           
  
              var data = doc1.data()

              curArr.push(data.name)
          
              
             })
          })
          .then(() => {
                // TODO copy over the individual keys and values from state.people
            
                newPeople[classname] = curArr
                curArr = []
                //console.log(classname + "asdf")
          })

        })
      })
      .then(() => {
        console.log(newPeople)
        console.log("HAHA")
        this.setState({people: newPeople})
        //console.log("got all people")
      })
    

  }

  handleAddClass = () => {
    alert('You have added a class' );
    console.log(this.state.user)
    this.db.collection("classes").doc(this.state.class).collection("ListOfPeople").doc(randomStr(20, "0123456789QWERTYUIOPLKJHGFDSAZXCVBNMqwertyuioplkjhgfdsazxcvbnm")).set({
      name: this.state.user
    })
    .then(function() {
        console.log("Added " + this.state.user + " to " + this.state.class)
    }.bind(this))
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
  }

  handleRemoveClass = () => {
    alert('You have removed a class' );
    console.log(this.state.user)
    this.db.collection("classes").doc(this.state.class).collection("ListOfPeople").where('name','==',this.state.user).get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc){
          doc.ref.delete();
        });
        console.log("Removed " + this.state.user + " from " + this.state.class)
    }.bind(this))
    .catch(function(error) {
        console.error("Error removing document: ", error);
    });
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
    console.log(self.state.people)
    console.log("hi" + self.state.class)
    const listOfPeopleLi = self.state.people[self.state.class].map(function (name) { 
      return <li id={name}>{name}</li>
    })

    const optionList = self.state.classeslist.map(function (name) { 
      return <option value={name}>{name}</option>
    })

    var addClass = <button onClick={() => this.handleAddClass()}>Add {self.state.class}</button>

    if (self.state.people[self.state.class].includes(self.state.user)){
      addClass = <button onClick={() => this.handleRemoveClass()}>Remove {self.state.class}</button>
    }

  
    const handleInputChange = (e) => {
      console.log("handling input change")
      this.setState({
        searchQuery: e.target.value
      }, () => {
        console.log(e.target.value)
      });

    }
  
    const handleEnter = (e) => {
      console.log(e.keyCode + " aaa")
      if(e.keyCode === 13) {
        console.log("hi")
        const val = this.state.searchQuery
        this.setState({
          classes: this.state.classes.slice().push(val)
        });
        //this.setState({
         // searchQuery: ""
        //});
      }
    }

    return (
      <div>
      <div id="header"> 

        <Router>
          <div class = "topnav">
            <div class = 'nav1'><a><Link to="/">Home</Link></a></div>
            <div class = 'nav2'><a><Link to="/login">Login</Link></a></div>
            <div class = 'nav3'><a><Link to="/register">Register</Link></a></div>


            {/*
              A <Switch> looks through all its children <Route>
              elements and renders the first one whose path
              matches the current URL. Use a <Switch> any time
              you have multiple routes, but you want only one
              of them to render at a time
            */}
            <Switch>
              <Route exact path="/">
              </Route>
              <Route path="/login">
                <Login updateUser = {this.updateUser} />
              </Route>
              <Route path="/register">
                <Register />
              </Route>
            </Switch>
          </div>
        </Router>
        <div class='head1'>
            <h1 id="title">🚀🚀 INTERSTELLAR 🚀🚀 </h1>
            <h1 id="emojis"> </h1>
        </div>
          
          <h1 id="logo">Welcome {self.state.user}!</h1>
          <h2 id = "logo1">Spring 2020</h2>
          
        
        <Searchbar updateclass={this.updateClass} />
      </div>
      <div id="classbubbles">
        <h2>Your classes</h2>
        <ul>
          {classesList}
        </ul>
      </div>
      <div id="body">
        <div id="classheader"> </div>
        <ul id="listofpeople"> 
          {listOfPeopleLi}
        </ul> 
        <div id='addclass'>
          {addClass}
        </div>
        {/* <a href="https://oidc.mit.edu/oauth/authorize?response_type=code&client_id=674248f5-d935-481f-83bd-1b53b987265e">
          Connect Your Account</a> */}
      </div>
      </div>
    );
  }
}

export default App;
