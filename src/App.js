import React, { Component } from 'react';
import Select from 'react-select';
import { Link, Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import logo from './logo.svg';
import './App.css';
import Login from './login'
import Register from './register'
import Logout from './logout'
import Searchbar from "./searchbar"
import source from "./classes"
import { Button } from 'semantic-ui-react'
import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

///////////////// General functions / constants 
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
function shortenTag(usertag) {
  return usertag.substring(0,usertag.indexOf("(")-1)
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
    this.db = firebase.firestore(); // firebase database
    const self = this 
    var classeslist = [];
    var blankPeople = {}
    var i;
    for(i =0; i<source.length; i++) {
      classeslist.push(source[i].title)
      blankPeople[source[i].title] = []
    }
    
    // initialize everything to be empty or default values
    this.state = {
      classeslist: classeslist, // Array of all classes
      classes: [], // Array of classes for which buttons are showing
      class: "", // Class whos roster is being shown
      people: blankPeople, // object that has classes as keys and takes class -> list of usertags of users in the class
      user: "Guest", // name of user
      usertag: "Guest (guest1314234@mit.edu)", // usertag of user (usertag is "name (kerb)"). 
      classesUserIsIn: [], // classes that the user is in
      email: 'guest1314234@mit.edu', // email of the user, 
      isPrivate: false
    }


    // this function is passed to the search bar
    this.updateClass = (classtoadd) => {
      var newlist = this.state.classes.slice()
      if (newlist.includes(classtoadd)) {
        return
      }
      newlist.push(classtoadd) 
      this.setState({classes: newlist, class: classtoadd})
    }; 

    // this function is passed to login
    this.updateUser = (data) => {
      let mit_email = data['kerb'] +'@mit.edu'
      this.setState({
        user: data['name'], 
        usertag: data['name']+" ("+data['kerb']+")", 
        email: mit_email,
        isPrivate: true
      }, () => {
        this.userIsUpdated()
      })

    };

    this.updatePage = () => {
      this.userIsUpdated()
    };

    // logs user out and then updates page information so that they only see login screen
    this.logout = () => {      
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        self.setState({
          isPrivate: false
        })
        self.userIsUpdated()
      }).catch(function(error) {
        // An error happened.
        alert(error.message)
      });
    }
  }

  ///////////////////////// Bunch of functions to handle certain events
  handleEmailChange = (event) => {
    this.setState({email: event.target.value});
  }

  
  // password reset email not currently working
  handleSubmit = () => {
    var auth = firebase.auth();
    var emailAddress = this.state.email;
    auth.sendPasswordResetEmail(emailAddress).then(function() {
      // Email sent.
      alert("email sent to " +emailAddress )
    }).catch(function(error) {
      // An error happened.
      alert(error.message)
    });
  }

  //when you enroll in a class
  handleBatchEnroll = () => {
    //alert('You have added a class' );
    //don't delete any of these fucking lines please
    var i;
    const self=this
    let kerb = this.state.email.substring(0, this.state.email.indexOf('@'))
    for(i=0; i<this.state.classes.length; i++) {
      var index = i;
      if(this.state.classesUserIsIn.includes(this.state.classes[index])) {
        continue;
      }
      
      
    
    this.db.collection("classes").doc(this.state.classes[index]).set({
      people: []
    })
    
    let newPeople = self.state.people[this.state.classes[index]]
    newPeople.push(self.state.user + " ("+ kerb+"@mit.edu)")
    this.db.collection("classes").doc(this.state.classes[index]).set({
      people: newPeople
    })
    }


    let newClasses = self.state.classesUserIsIn.slice()
    for(i=0; i<this.state.classes.length; i++) {
      var index = i;
      if(this.state.classesUserIsIn.includes(this.state.classes[index])) {
        continue;
      }
      newClasses.push(this.state.classes[index])
    }
    
    this.db.collection('users').doc(kerb).update({
      classes: newClasses
    })
    .then(function() {
          console.log("Added " + this.state.user + " to all classes")
          var newpeople = this.state.people
          for(i=0; i<this.state.classes.length; i++) {
            var index = i;
            if(this.state.classesUserIsIn.includes(this.state.classes[index])) {
              continue;
            }
          var newclasspeoplelist = this.state.people[this.state.classes[index]].slice()
          // newclasspeoplelist.push(this.state.usertag)
          newpeople[this.state.classes[index]] = newclasspeoplelist.slice()
          }
          this.setState({
            classesUserIsIn: newClasses,
            people: newpeople
  
          })

      }.bind(this))
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });
  }



  //when you enroll in a class
  handleAddClass = () => {
    //alert('You have added a class' );
    //don't delete any of these fucking lines please
    const self=this

    let kerb = this.state.email.substring(0, this.state.email.indexOf('@'))
    
    let newPeople = self.state.people[self.state.class]
    newPeople.push(self.state.usertag)
    // alert(JSON.stringify(newPeople))
    this.db.collection("classes").doc(this.state.class).set({
      people: newPeople
    })

    // this.db.collection("users").doc(kerb).get().then(function(doc) {
    //   if (doc.exists) {
    //     let data = doc.data()
    //     let newClasses = data['classes']
    //     newClasses.push(self.state.class)
    //     self.db.collection('users').doc(kerb).update({
    //       classes: newClasses
    //     })
    //   }
    //   }).catch(function(error) {
    //     console.log("Error getting document:", error);
    // })
    // .then(function() {
    //     console.log("Added " + this.state.user + " to " + this.state.class)
    //     var newclassesuserisin = this.state.classesUserIsIn.slice()
    //     newclassesuserisin.push(this.state.class)
    //     var newpeople = this.state.people
    //     var newclasspeoplelist = this.state.people[this.state.class]
    //     newclasspeoplelist.push(this.state.usertag)
    //     newpeople[this.state.class] = newclasspeoplelist
    //     this.setState({
    //       classesUserIsIn: newclassesuserisin,
    //       people: newpeople

    //     })
    // }.bind(this))
    // .catch(function(error) {
    //     console.error("Error writing document: ", error);
    // });

    //updates this.state for classesUserIsIn and people, and writes new classes to firebase
    let newClasses = self.state.classesUserIsIn.slice()
    newClasses.push(this.state.class)
    this.db.collection('users').doc(kerb).update({
      classes: newClasses
    })
    .then(function() {
          console.log("Added " + this.state.user + " to " + this.state.class)
          var newpeople = this.state.people
          var newclasspeoplelist = this.state.people[this.state.class]
          // newclasspeoplelist.push(this.state.usertag)
          newpeople[this.state.class] = newclasspeoplelist
          // alert(JSON.stringify(newpeople))
          this.setState({
            classesUserIsIn: newClasses,
            people: self.state.people
  
          })
      }.bind(this))
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });

  }

  //when you unenroll in a class
  handleRemoveClass = () => {
    //alert('You have removed a class' );
    let self = this
    let kerb = this.state.email.substring(0,this.state.email.indexOf('@'))
    // this.db.collection("classes").doc(this.state.class).collection("ListOfPeople").where('kerb','==',kerb).get()
    // .then(function(querySnapshot) {
    //     querySnapshot.forEach(function(doc){
    //       doc.ref.delete();
    //     });
    //     console.log("Removed " + this.state.user + " from " + this.state.class)
    //     var newpeople = this.state.people
    //     newpeople[this.state.class] = arrayRemove(this.state.people[this.state.class], this.state.usertag)

    //     this.setState({
    //       classesUserIsIn: arrayRemove(this.state.classesUserIsIn, this.state.class),
    //       people: newpeople
    //     })
    // }.bind(this))
    // .catch(function(error) {
    //     console.error("Error removing document: ", error);
    // });
    this.db.collection('classes').doc(this.state.class).update( {
      people: arrayRemove(self.state.people[self.state.class], self.usertag)
    }).then(function() {
      console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
    var newpeople = this.state.people
    newpeople[this.state.class] = arrayRemove(this.state.people[this.state.class], this.state.usertag)

    this.setState({
      classesUserIsIn: arrayRemove(this.state.classesUserIsIn, this.state.class),
      people: newpeople
    })
    

    // this.db.collection("users").doc(kerb).get().then(function(doc) {
    //   if (doc.exists) {
    //       let classes = doc.data()['classes']
    //       self.db.collection("users").doc(kerb).update({
    //         classes: arrayRemove(classes, self.state.class)
    //       })
    //       .catch(function(error) {
    //           console.error("Error removing document: ", error);
    //       });
    //   }       
    // }).catch(function(error) {
    //     console.log("Error getting document:", error);
    // });

    this.db.collection('users').doc(kerb).update({
      classes: arrayRemove(this.state.classesUserIsIn, self.state.class)
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });


  }
  //////////////////////////////////////////////////////////

  // Runs whenever the user is updated (to update classesUserIsIn)
  userIsUpdated = () => {
    var classesUserIsIn = []
    var i;
    for(i=0; i<this.state.classeslist.length; i++) {
      if(this.state.people[this.state.classeslist[i]].includes(this.state.usertag)) {
        classesUserIsIn.push(this.state.classeslist[i])
      }
    }
    this.setState({
      classesUserIsIn: classesUserIsIn,
      
    }, this.setState({
      classes: this.state.classesUserIsIn
    }))
  }

  // Runs right after constructor but before render
  // Gets all data from firebase and puts in this.state.people
  componentDidMount() {
    var i;
    const self = this
    var listclasses = []
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        let email = firebase.auth().currentUser['email']
        let kerb = email.substring(0, email.indexOf("@"))
        self.db.collection('users').doc(kerb).get().then(function(doc) {
          if (doc.exists) {
              let data = doc.data()
              self.setState({
                classes: data['classes'], // Array of classes for which buttons are showing
                class: data['classes'].length >0 ? data['classes'][0] : "", // Class whos roster is being shown
                user: data['name'], // name of user
                usertag: data['name']+" ("+data['kerb']+")", // usertag of user (usertag is "name (kerb)"). 
                classesUserIsIn: data['classes'], // classes that the user is in
                email: email, // email of the user
                isPrivate: (firebase.auth().currentUser && firebase.auth().currentUser.emailVerified)
              })
          }       
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
      } else {
        // No user is signed in.
      }
    });
    // var newPeople = this.state.people
    this.db.collection("classes").get()
      .then((classes => {
        // people will map eg { "6.006": ["bgu", "jimbob"] }
        const people = {}
        classes.forEach(doc => {
          people[doc.id] = doc.data()['people']
        })
        self.setState({
          people: people
        })
      }))
      /*.then((querySnapshot) => {
        this.db.collectionGroup('ListOfPeople')
        .where()
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
            curArr.push(doc1.data().name+" ("+doc1.data().kerb+")")
          })
          return curArr
        })
        var i;
        for(i=0; i<listclasses.length; i++) {
          newPeople[listclasses[i]] = newListsOfPeople[i]
        } 
        self.setState({
          people: newPeople,
        })
        this.userIsUpdated()
      })*/
  }
  
  // Runs whenever setState is called
  render() {
    
    console.log("rendering state " + this.state);
    const self = this
    const handleClick = function (name) {
      self.setState({class: name}) 
    }

    const handleExit = function (name) {
      if(self.state.classes.length > 1) {
        var newclasses = arrayRemove(self.state.classes, name)
        self.setState({classes: newclasses, class: newclasses[newclasses.length - 1]})
        
      }
      else {
      self.setState({classes: arrayRemove(self.state.classes, name), class: ""})
      }

    }


    var timer = 0
    var delay = 200
    var prevent = false

    const classesList = self.state.classes
    .slice(Math.max(0, self.state.classes.length-20), self.state.classes.length)
    .map(function (name) { 
        return (
          <button className={(name===self.state.class ? "biggergreenbutton" : "greenbutton")+" "+(self.state.classesUserIsIn.includes(name) ? "bold" : "notbold")} 
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

    var listOfPeopleLi = null
    var batchEnroll = <button class="removeenroll" onClick={() => this.handleBatchEnroll()}>Enroll All</button>
    var addClass = <button class="removeenroll" onClick={() => this.handleAddClass()}>Enroll in {self.state.class}</button>

    if (self.state.class.length>0) {
      if (!self.state.people[self.state.class]) {
        let newPeople = self.state.people
        newPeople[self.state.class] = []
        self.setState({
          people: newPeople
        })
      }
      listOfPeopleLi = self.state.people[self.state.class].map(function (name) { 
      return <li class="peoplelist" id={name}>{shortenTag(name)}</li>
      })
      if (self.state.people[self.state.class].includes(self.state.usertag)){
        addClass = <button class="removeenroll" onClick={() => this.handleRemoveClass()}>Unenroll from {self.state.class}</button>
      }
    } 
    const optionList = self.state.classeslist.map(function (name) { 
      return <option value={name}>{name}</option>
    })

    

    // <h2>Your classes: {this.state.classesUserIsIn.toString()}</h2>
    // <div>
    //<button class='removeenroll' onClick={() => handleExit(this.state.class)}>Remove {this.state.class}</button>
   // </div>
   //<h2 id = "logo1">Spring 2020</h2>
   
    const privateContent = ( 
      <div>
        <head>
          <title>interstellar</title>
      </head>
        <div id="header"> 

        <Router>
          <div className = "topnav">
            <div className="nav2"><Link><Logout logout = {this.logout} /></Link></div>
            <div id="logo">Welcome {self.state.user}!</div>
          </div>
        </Router>
        <div className='head1'>
            <h1 id="title">interstellar</h1>
            <h1 id="emojis"> </h1>
        </div>
        </div>
      
      
      <div id='sb'>
        <Searchbar id="thesearchbar" updateclass={this.updateClass} showNoResults={false} />
      </div>
      <div id='txt'>
        {/* <img src="search.png"  width="50" height="50"></img> */}
      </div>
      
      <div id="classbubbles">
        
        <ul>
          {classesList}
        </ul>
      </div>
      <div id="body">
        
        <hr />
        <div id="classheader"> 
        <ul id="listofpeople"> 
          {listOfPeopleLi}
        </ul>
        
        
        
          {/* {addClass} */}
        <div id='addclass'>
          {this.state.class.length>0 ? (batchEnroll) : ""}
          {this.state.class.length>0 ? (addClass) : ""}
        </div>
        <div id='dummytext'>
          {this.state.class.length>0 ? "" : "Search for Classes above to start!"}
        </div>
        </div>
        </div>
        </div>
      )
  
      const publicContent = (
        <div>
          <div id="header"> 

          <Router>
            <div className = "topnav">
              <div className = 'nav1'><Link to="/">Home</Link></div>
              <Switch>
                <Route exact path="/">
                </Route>
              </Switch>
            </div>
          </Router>
          <div className ='head1'>
              <h1 id="title">interstellar</h1>
              <h1 id="emojis"> </h1>
          </div>
          </div>
          <div id="body1">
            <h1 id="intro">            
              <br></br>
            Welcome to Interstellar, a class comparison website for MIT students to share your classes and see what classes your friends are taking!             
            <div class = "body">
            <br></br>
            <img src="Complete_graph_K9.jpg"  width="180"
              height="180"></img>
            </div>
            <br></br>
            Please sign in or create an account with a valid @mit.edu email address to get started!
            <div class = "login-zoom">
            <Login updateUser = {this.updateUser}/>

            <Register updatePage = {this.updatePage} />
            </div>

          </h1>
          </div>
          
        </div>
      )
    return (
      <div>
        {this.state.isPrivate ? privateContent : publicContent}
      </div>
    );
  }
}

export default App;
