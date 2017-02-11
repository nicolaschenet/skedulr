import * as firebase from "firebase";

import React, {Component} from 'react';
import {Route, Router, browserHistory} from 'react-router';

import EditProfile from './EditProfile';
import Home from './Home';
import Login from './Login';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Party from './Party';
import Site from './Site';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {requireAuth} from '../auth';

// Initialize Firebase
firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
});

injectTapEventPlugin();

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <Router history={browserHistory}>
          <Route component={Site}>
            <Route path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route onEnter={requireAuth}>
              <Route path="/profile/edit" component={EditProfile} />
              <Route path="/parties/:id" component={Party} />
            </Route>
          </Route>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
