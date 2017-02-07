/* global google */

import './Map.css';

import React, {Component} from 'react';

class Map extends Component {
  componentDidMount() {
    const homePosition = new google.maps.LatLng(48.863091, 2.3604313)
    const infoWindow = new google.maps.InfoWindow({
      content: '41 rue Charlot, Paris (75003)'
    })
    const map = new google.maps.Map(document.getElementById('map'), {
      center: homePosition,
      zoom: 15
    })
    const homeMarker = new google.maps.Marker({
      animation: google.maps.Animation.DROP,
      map: map,
      place: {
        location: homePosition,
        query: '41, rue Charlot, Paris'
      }
    })
    homeMarker.addListener('click', function() {
      infoWindow.open(map, homeMarker);
    });
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
