/* global google */

import './Map.css';

import React, { Component } from 'react';

import firebase from 'firebase';

class Map extends Component {
  componentDidMount() {
     firebase.database().ref(this.props.firebaseRef).on('value', snapshot => {
      const party = snapshot.val()
      const { address, coordinates } = party
      const { lat, long } = coordinates
      const partyPosition = new google.maps.LatLng(lat, long)
      const infoWindow = new google.maps.InfoWindow({
        content: address
      })
      const map = new google.maps.Map(document.getElementById('map'), {
        center: partyPosition,
        zoom: 15
      })
      const partyMarker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        map: map,
        place: {
          location: partyPosition,
          query: address
        }
      })
      partyMarker.addListener('click', function() {
        infoWindow.open(map, partyMarker);
      });
    })
  }
  render() {
    return (
      <div className='Map' id='map'>
        loading map...
      </div>
    );
  }
}

export default Map;
