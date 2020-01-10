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

export default function Logout(props) {

  function handleSubmit(event) {
    props.logout()

    event.preventDefault();
  }

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <Button block bsSize="large" type="submit">
          Logout
        </Button>
      </form>
    </div>
    
  );
}