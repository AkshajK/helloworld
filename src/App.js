import React, { Component } from 'react';
import Select from 'react-select';
import { Link, Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import logo from './logo.svg';
import './App.css';
import Login from './login'
import Register from './register'
import Searchbar from "./searchbar"
import source from "./classes"
import { Button } from 'semantic-ui-react'
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

function arrayRemove(arr, value) {

  return arr.filter(function(ele){
      return ele != value;
  });

}
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
      user: "Guest",
      searchQuery: "",
      classesUserIsIn: [],
      email: ''
    }
    this.updateClass = (classtoadd) => {
      var newlist = this.state.classes.slice()
      if (newlist.includes(classtoadd)) {
        return
      }
      newlist.push(classtoadd) 
      this.setState({classes: newlist, class: classtoadd})
      // alert(firebase.auth().currentUser['email'])
    };

    this.updateUser = (data) => {
      let email = firebase.auth().currentUser['email']
      alert(email.substring(0, email.indexOf('@')))

      this.setState({user: data['name']})
      this.userIsUpdated()
    };
  }

  handleEmailChange = (event) => {
    this.setState({email: event.target.value});
  }

  handleSubmit = () => {
    var auth = firebase.auth();
    var emailAddress = this.state.email;
    alert(emailAddress)
    auth.sendPasswordResetEmail(emailAddress).then(function() {
      // Email sent.
      alert("email sent to " +emailAddress )
    }).catch(function(error) {
      // An error happened.
      alert(error.message)
    });
  }


  componentDidMount() {
    var i;
    const self = this
    var listclasses = []
    var newPeople = this.state.people
    this.db.collection("classes").get()
      .then((querySnapshot) => {
        var listOfPeoplePromises = []
        
        querySnapshot.forEach((doc) => {
          listclasses.push(doc.id)
          const listOfPeoplePromise = this.db.collection("classes")
          .doc(doc.id)
          .collection("ListOfPeople")
          .orderBy("name", "asc")
          .get()
          listOfPeoplePromises.push(listOfPeoplePromise);
        })
        return Promise.all(listOfPeoplePromises)
      })
      .then((listsOfPeople) => {
        
        var newListsOfPeople = listsOfPeople.map((person) => {
          var curArr = []
          person.forEach((doc1) => {
            curArr.push(doc1.data().name)
          })
          return curArr
        })

        var i;
        for(i=0; i<listclasses.length; i++) {
          newPeople[listclasses[i]] = newListsOfPeople[i]
        }

        
        self.setState({
          people: newPeople,
          //classesUserIsIn: classesUserIsIn
        })
        this.userIsUpdated()

      })
      
      /*
    const listofscores = this.db
      .collection("classes")
      .get()
      .then((querySnapshot) => {
        let curArr = []
        let classIds = []
        querySnapshot.forEach((doc) => {
          classIds.push(doc.id)
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
     
        self.setState({people: newPeople})
        console.log(JSON.stringify(newPeople))
        //console.log("got all people")
      })
     */
      
  }

  userIsUpdated = () => {
    var classesUserIsIn = []
    var i;
    for(i=0; i<this.state.classeslist.length; i++) {
      if(this.state.people[this.state.classeslist[i]].includes(this.state.user)) {
        classesUserIsIn.push(this.state.classeslist[i])
      }
    }
    this.setState({
      classesUserIsIn: classesUserIsIn
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
        var newclassesuserisin = this.state.classesUserIsIn.slice()
        newclassesuserisin.push(this.state.class)
        var newpeople = this.state.people
        var newclasspeoplelist = this.state.people[this.state.class]
        newclasspeoplelist.push(this.state.user)
        newpeople[this.state.class] = newclasspeoplelist
        this.setState({
          classesUserIsIn: newclassesuserisin,
          people: newpeople

        })
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
        var newpeople = this.state.people
        newpeople[this.state.class] = arrayRemove(this.state.people[this.state.class], this.state.user)

        this.setState({
          classesUserIsIn: arrayRemove(this.state.classesUserIsIn, this.state.class),
          people: newpeople
        })
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
    const handleExit = function (name) {
      if(self.state.classes.length > 1) {
        var newclasses = arrayRemove(self.state.classes, name)
        self.setState({classes: newclasses, class: newclasses[newclasses.length - 1]})
        
      }
      else {
      self.setState({classes: arrayRemove(self.state.classes, name)})
      }

    }

    var timer = 0
    var delay = 200
    var prevent = false

    const classesList = self.state.classes
    .slice(Math.max(0, self.state.classes.length-20), self.state.classes.length)
    .map(function (name) { 
        return (
          <button class={name===self.state.class ? "biggergreenbutton" : "greenbutton"} 
          onClick={() => {
            timer = setTimeout(() => {
              if (!prevent) {
                handleClick(name)
              }
              prevent = false
            },delay)
            }}
           onDoubleClick={() => {
             clearTimeout(timer)
             prevent = true
             handleExit(name)
           }}>{name}</button>)
    })
    console.log(self.state.people)
    console.log("hi" + self.state.class)
    const listOfPeopleLi = self.state.people[self.state.class].map(function (name) { 
      return <li id={name}>{name}</li>
    })

    const optionList = self.state.classeslist.map(function (name) { 
      return <option value={name}>{name}</option>
    })

    var addClass = <button class="removeenroll" onClick={() => this.handleAddClass()}>Enroll in {self.state.class}</button>

    if (self.state.people[self.state.class].includes(self.state.user)){
      addClass = <button class="removeenroll" onClick={() => this.handleRemoveClass()}>Unenroll from {self.state.class}</button>
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
    const logout = () => {
      alert("singing out")
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        self.setState({
          classes: ["6.08"],
          class: "6.08",
          user: "Guest",
          searchQuery: ""})
        alert("logged out")
      }).catch(function(error) {
        // An error happened.
        alert(error.message)
      });
      this.userIsUpdated()
    }
    const privateContent = ( 
      <div>
      <h1 id="logo">Welcome {self.state.user}!</h1>
      <h2 id = "logo1">Spring 2020</h2>
      
      
      <Searchbar updateclass={this.updateClass} showNoResults={false} />
      <button onClick = {() => logout()}>Logout</button>
      <div id="classbubbles">
        <h2>Your classes: {this.state.classesUserIsIn.toString()}</h2>
        <ul>
          {classesList}
        </ul>
      </div>
      <div id="body">
        <div id="classheader"> </div>
        <ul id="listofpeople"> 
          {listOfPeopleLi}
        </ul>
        <div>
          <button class='remove' onClick={() => handleExit(this.state.class)}>Remove {this.state.class}</button>
        </div>
        <div id='addclass'>
          {addClass}
        </div>
  
        <input type="text" id="email"  value={this.state.email} onChange = {this.handleEmailChange} />
        <br/>
        <button onClick={this.handleSubmit} id="resetpass" >Reset Password</button>
        </div>
        </div>
      )
  
      const publicContent = (
        <div>
          <h1>
            Please Sign In
          </h1>
        </div>
      )

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
          
        {firebase.auth().currentUser ? privateContent : publicContent}
      </div>
      </div>
    );
  }
}

export default App;
