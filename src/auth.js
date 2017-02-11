import * as firebase from "firebase";

import React, {Component, PropTypes} from 'react';

import Auth0Lock from 'auth0-lock';
import {EventEmitter} from 'events';
import R from 'ramda'
import auth0 from 'auth0-js'
import {browserHistory} from 'react-router';
import decode from 'jwt-decode';

const NEXT_PATH_KEY = 'next_path';
const ID_TOKEN_KEY = 'id_token';
const FIREBASE_ID_TOKEN_KEY = 'fb_id_token';
const ACCESS_TOKEN_KEY = 'access_token';
const PROFILE_KEY = 'profile';
const LOGIN_ROUTE = '/login';
const ROOT_ROUTE = '/';

if (!process.env.REACT_APP_AUTH0_CLIENT_ID || !process.env.REACT_APP_AUTH0_DOMAIN) {
  throw new Error('Please define `REACT_APP_AUTH0_CLIENT_ID` and `REACT_APP_AUTH0_DOMAIN` in your .env file');
}

const lock = new Auth0Lock(
  process.env.REACT_APP_AUTH0_CLIENT_ID,
  process.env.REACT_APP_AUTH0_DOMAIN, {
    auth: {
      redirectUrl: `${window.location.origin}${LOGIN_ROUTE}`,
      responseType: 'token'
    }
  }
);

const auth0Authentication = new auth0.Authentication({ 
  clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
  domain : process.env.REACT_APP_AUTH0_DOMAIN
})

const events = new EventEmitter();

const getFirebaseProfile = () => {
  return R.omit([
    'clientID', 
    'global_client_id', 
    'last_ip',
    'last_login',
    'logins_count',
    'user_id', 
    'sub'
  ], getProfile())
}

const updateFirebaseUser = id => firebase.database().ref(`users/${id}`).update(getFirebaseProfile())

const setFirebaseIdToken = idToken => localStorage.setItem(FIREBASE_ID_TOKEN_KEY, idToken);
// const getFirebaseIdToken = () =>  localStorage.getItem(FIREBASE_ID_TOKEN_KEY);

// function createParty(userID) {
//   // A party entry.
//   var partyData = {
//     owner: userID,
//     title: 'party'
//   };

//   // Get a key for a new party.
//   var newPartyKey = firebase.database().ref().child('parties').push().key;

//   // Write the new party's data simultaneously in the parties list and the user's party list.
//   var updates = {};
//   updates[`/parties/${newPartyKey}`] = partyData;
//   updates[`/users/${userID}/parties/${newPartyKey}`] = true;

//   return firebase.database().ref().update(updates);
// }

// listen to when the user gets authenticated and then save the profile
lock.on('authenticated', authResult => {

  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      return
    }
    console.log('Firebase | Logged as', user.uid)
    updateFirebaseUser(user.uid)
    // createParty(user.uid)
  })

  setIdToken(authResult.idToken);
  setAccessToken(authResult.accessToken);
  
  lock.getProfile(authResult.idToken, function(error, profile) {
   
    if (error) { return setProfile({ error }); }
   
    console.log('Auth0 | Logged as', profile.user_id)
   
    setProfile(profile);
    browserHistory.push(getNextPath());
    clearNextPath();
    
    // Set the options to retreive a firebase delegation token
    var delegationOptions = {
      api_type : 'firebase',
      client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      id_token : authResult.idToken,
      target: process.env.REACT_APP_AUTH0_CLIENT_ID,
      scope : 'openid profile email'
    };

    // Make a call to the Auth0 '/delegate'
    auth0Authentication.delegation(delegationOptions, (err, result) => {
      if(!err) {
        const { idToken } = result;
        // Immediatly store Firebase token for later use
        setFirebaseIdToken(idToken);
        // Exchange the delegate token for a Firebase auth token
        firebase.auth().signInWithCustomToken(idToken).catch(error => {
          console.log(error);
        });
      }
    });
  });
});

export function login(options) {
  lock.show(options);
  return {
    hide() {
      lock.hide();
    }
  }
}

export function logout() {
  clearNextPath();
  clearIdToken();
  clearProfile();
  firebase.auth().signOut().then(
    () => console.log('Firebase | Logged out'), 
    error => console.log(error)
  );
  browserHistory.push(LOGIN_ROUTE);
}

export function requireAuth(nextState, replace) {
  if (!isLoggedIn()) {
    setNextPath(nextState.location.pathname);
    replace({pathname: LOGIN_ROUTE});
  }
}

export function connectProfile(WrappedComponent) {
  return class ProfileContainer extends Component {
    state = {
      profile: null
    };

    componentWillMount() {
      this.profileSubscription = subscribeToProfile(profile => {
        this.setState({profile});
      });
    }

    componentWillUnmount() {
      this.profileSubscription.close();
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          profile={this.state.profile}
          onUpdateProfile={this.onUpdateProfile}
        />
      );
    }

    onUpdateProfile = newProfile => {
      return updateProfile(this.state.profile.user_id, newProfile);
    }
  };
}

connectProfile.PropTypes = {
  profile: PropTypes.object,
  onUpdateProfile: PropTypes.func
};

export function fetchAsUser(input, init={}) {
  const headers = init.headers || {};

  return fetch(input, {
    ...init,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getIdToken()}`,
      ...headers
    }
  }).then((response) => {
    if (!response.ok) { throw new Error(response); }
    return response;
  });
}

function subscribeToProfile(subscription) {
  events.on('profile_updated', subscription);

  if (isLoggedIn()) {
    subscription(getProfile());

    lock.getUserInfo(getAccessToken(), (error, profile) => {
      if (error) { return setProfile({error}); }
      setProfile(profile);
    });
  }

  return {
    close() {
      events.removeListener('profile_updated', subscription);
    }
  };
}

async function updateProfile(userId, newProfile) {
  try {
    const response = await fetchAsUser(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/api/v2/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(newProfile)
    });
    const profile = await response.json();
    setProfile(profile);
    updateFirebaseUser(profile.user_id)
  } catch (error) {
    return error;
  }
}

function setProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  events.emit('profile_updated', profile);
}

function getProfile() {
  return JSON.parse(localStorage.getItem(PROFILE_KEY));
}

function clearProfile() {
  localStorage.removeItem(PROFILE_KEY);
  events.emit('profile_updated', null);
}

function setIdToken(idToken) {
  localStorage.setItem(ID_TOKEN_KEY, idToken);
}

function setAccessToken(accessToken) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

function getIdToken() {
  return localStorage.getItem(ID_TOKEN_KEY);
}


function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function clearIdToken() {
  localStorage.removeItem(ID_TOKEN_KEY);
}

function setNextPath(nextPath) {
  localStorage.setItem(NEXT_PATH_KEY, nextPath);
}

function getNextPath() {
  return localStorage.getItem(NEXT_PATH_KEY) || ROOT_ROUTE;
}

function clearNextPath() {
  localStorage.removeItem(NEXT_PATH_KEY);
}

function isLoggedIn() {
  const idToken = getIdToken();
  return idToken && !isTokenExpired(idToken);
}

function getTokenExpirationDate(encodedToken) {
  const token = decode(encodedToken);
  if (!token.exp) { return null; }

  const date = new Date(0);
  date.setUTCSeconds(token.exp);

  return date;
}

function isTokenExpired(token) {
  const expirationDate = getTokenExpirationDate(token);
  return expirationDate < new Date();
}
