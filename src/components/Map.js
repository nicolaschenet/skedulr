/* global google */

import './Map.css';

import React, { Component } from 'react';

import Snackbar from 'material-ui/Snackbar';
import customMarker from '../images/flat-marker.svg'
import firebase from 'firebase';
import { geolocated } from 'react-geolocated';
import pinMarker from '../images/pin-marker.svg'

const markerIcon = new google.maps.MarkerImage(
  pinMarker, 
  null, 
  null, 
  new google.maps.Point(18, 36), 
  new google.maps.Size(36, 36)
)

class Map extends Component {

  constructor(props) {
    super(props)
    this.bounds = new google.maps.LatLngBounds()
  }

  componentDidMount() {
     firebase.database().ref(this.props.firebaseRef).on('value', snapshot => {
      const party = snapshot.val()
      const { address, coordinates } = party
      const { lat, long } = coordinates
      const location = new google.maps.LatLng(lat, long)
      const infoWindow = new google.maps.InfoWindow({
        content: address
      })
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 15
      })
      const partyMarker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        map: this.map,
        place: {
          location,
          query: address
        },
        icon: markerIcon
      })
      partyMarker.addListener('click', function() {
        infoWindow.open(this.map, partyMarker);
      });
      this.bounds.extend(location)
    })
  }

  componentWillReceiveProps (nextProps) {
    const { coords } = nextProps
    if (!coords) return
    const location = new google.maps.LatLng(coords.latitude, coords.longitude)
    const userInfoWindow = new google.maps.InfoWindow({
      content: 'You'
    })
    const userMarker = new google.maps.Marker({
      animation: google.maps.Animation.DROP,
      place: {
        location,
        query: 'You'
      },
      map: this.map,
      title: 'You',
      icon: markerIcon
    })
    userMarker.addListener('click', () => userInfoWindow.open(this.map, userMarker))
    this.bounds.extend(location)
    this.map.fitBounds(this.bounds)
  }
  
  render() {
    return (
      <div>
        <Snackbar
          open={!this.props.coords && !this.props.positionError && this.props.isGeolocationAvailable}
          message={`Retrieving your position...`}
        />
        <Snackbar
          open={!!this.props.coords}
          message={`Position retrieved !`}
          autoHideDuration={3000}
        />
        <Snackbar
          open={!!this.props.positionError}
          message={`Error getting your position :(`}
          autoHideDuration={3000}
        />
        <div className='Map' id='map'>
          loading map...
        </div>
      </div>
    );
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true,
  },
  userDecisionTimeout: 5000
})(Map);
