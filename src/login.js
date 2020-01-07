import React, { useState } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import "./login.css";

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

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 8  && password.length > 0 && email.indexOf("@mit.edu")>0;
  }

  function handleSubmit(event) {
    let kerb = email.substring(0, email.indexOf('@'))
    var docRef = db.collection("users").doc(kerb);

    docRef.get().then(function(doc) {
        if (doc.exists) {
            if (doc.data()['password'] == password){
              alert("login successful. Welcome")
              props.updateUser(doc.data()['name'])
            } else {
              console.log(password)
              console.log(doc.data()['password'])
              alert("login unsucessful. Try again")
            }
            console.log("Document data:", doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    event.preventDefault();
  }

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
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
        <Button block bsSize="large" disabled={!validateForm()} type="submit">
          Login
        </Button>
      </form>
    </div>
    
  );
}