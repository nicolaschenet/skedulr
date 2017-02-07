/* eslint no-undef:off */
import './Home.css';

import React, {Component} from 'react';

import {Link} from 'react-router';
import {connectProfile} from '../auth';

class Home extends Component {
  static propTypes = {
    ...connectProfile.PropTypes
  };

  render() {

    return (
      <div className="Home">
        <div className="Home-intro">
          <h2>Select your preferred date and hour </h2>
        </div>
      </div>
    );
  }
}

export default connectProfile(Home);
