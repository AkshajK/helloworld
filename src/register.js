import React, { useState } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "./login.css";
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

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

const db = firebase.firestore();

export default function Register(props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  function validateForm() {
    return email.length > 8 && name.length> 0 && lastName.length>0 && password.length > 0;
  }

  function handleSubmit(event) {
        if (email.indexOf("@mit.edu") <= 0){
            alert("Email needs to be @mit.edu");
            setEmail("");
        }
        
        // If password not entered 
        else if (password === '') {
            alert ("Please enter password"); 
            setPassword("")
            setPassword2("")  
        }
              
        // If confirm password not entered 
        else if (password2 === '') {
            alert ("Please enter confirm password"); 
            setPassword("") 
            setPassword2("") 
            return; 
        }
        // If Not same return False.     
        else if (password !== password2) { 
            alert ("\nPassword did not match: Please try again...") 
            setPassword("") 
            setPassword2("") 
        } 

        // If same return True. 
        else{ 
            var path = 0
            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                alert(errorMessage)
                path=1
                // ...
              }).then(() => {
                if (path<0.5) {

                    let kerb = email.substring(0, email.indexOf('@'))
                    var user = firebase.auth().currentUser;
                    user.updateProfile({
                        displayName: name +" " + lastName,
                    })
                    db.collection("users").doc(kerb).set({
                    name: name +" "+ lastName,
                    kerb: kerb,
                    classes: [],
                    friends: []
                    })
                    .then(function() {
                        console.log("Added " + name + " to database")
                        user.sendEmailVerification().then(function() {
                            // Email sent.
                            // register automatically signs you in, so this signs you out
                            firebase.auth().signOut().then(function() {
                                // Sign-out successful.
                                setPassword("")
                                setEmail("")
                                setPassword2("")
                                setName("")
                                setLastName("")
                                alert('Email Sent to '+kerb+'@mit.edu')


                            }).catch(function(error) {
                                // An error happened.
                                alert(error.message)
                            });
                        }).catch(function(error) {
                            // An error happened.
                        });
                    }.bind(this))
                    .catch(function(error) {
                        console.error("Error writing document: ", error);
                    });
                }
              });   
        }
    event.preventDefault();
  }

  return (
    <div className="Register">
      <h1>Register Below!</h1>
      <form onSubmit={handleSubmit}>
      <div className="right">
        <FormGroup controlId="name" bsSize="large">
          <FormLabel>First Name </FormLabel>
          <FormControl
            autoFocus
            type="name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="name" bsSize="large">
          <FormLabel>Last Name </FormLabel>
          <FormControl
            autoFocus
            type="name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="email" bsSize="large">
          <FormLabel>Email </FormLabel>
          <FormControl
            autoFocus
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <FormLabel>Password </FormLabel>
          <FormControl
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <FormLabel>Repeat Password </FormLabel>
          <FormControl
            value={password2}
            onChange={e => setPassword2(e.target.value)}
            type="password"
          />
        </FormGroup>
      </div>
        <Button block bsSize="large" disabled={!validateForm()} type="submit">
          Register
        </Button>
      </form>
    </div>
    
  );
}