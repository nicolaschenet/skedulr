/* global google */

import './Site.css';

import React, {Component, PropTypes} from 'react';
import {connectProfile, logout} from '../auth';

import ActionAccountCircle from 'material-ui/svg-icons/action/account-circle';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import {Link} from 'react-router';
import Map from './Map'
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import RaisedButton from 'material-ui/RaisedButton';
import {fullWhite} from 'material-ui/styles/colors';

const Logged = props => (
  <IconMenu
    {...props}
    iconButtonElement={
      <IconButton><MoreVertIcon color="white" /></IconButton>
    }
    targetOrigin={{horizontal: 'right', vertical: 'middle'}}
    anchorOrigin={{horizontal: 'right', vertical: 'middle'}}
  >
    <MenuItem primaryText="View profile" />
    <MenuItem primaryText="Sign out" onClick={() => logout()} />
  </IconMenu>
);

const Login = () => (
  <Link to='/login'>
    <FlatButton icon={<ActionAccountCircle color={fullWhite} />} />
  </Link>
)

class Site extends Component {

  static propTypes = {
    ...connectProfile.PropTypes,
    children: PropTypes.any
  };

  render() {
    const { profile } = this.props
    return (
      <div className="Site">
        <AppBar
          title="Crew"
          iconElementLeft={<div></div>}
          iconElementRight={profile ? <Logged /> : <Login />}
        />
        <div className="Site-header">
          <Map />
          {profile && 
            <div className="Site-profileControls">
              <Link to="/profile/edit">
                <Avatar src={profile.picture} alt={profile.nickname}/>
              </Link>
            </div>
          }
        </div>
        <div className="Site-page">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default connectProfile(Site);
