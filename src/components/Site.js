/* global google */

import './Site.css';

import React, {Component, PropTypes} from 'react';
import {connectProfile, logout} from '../auth';

import ActionAccountCircle from 'material-ui/svg-icons/action/account-circle';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import {Link} from 'react-router';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {browserHistory} from 'react-router';
import {fullWhite} from 'material-ui/styles/colors';

const Logged = props => (
  <IconMenu
    {...props}
    iconButtonElement={
      <IconButton><MoreVertIcon color={fullWhite} /></IconButton>
    }
    targetOrigin={{horizontal: 'right', vertical: 'center'}}
    anchorOrigin={{horizontal: 'right', vertical: 'center'}}
  >
    <MenuItem 
      insetChildren
      primaryText={`Logged as ${props.profile.name}`}
    >
      <Avatar size={40} src={props.profile.picture} style= {{
        position: 'absolute',
        left: '15px',
        top: '4px'
      }} />
    </MenuItem>
    <Divider />
    <MenuItem primaryText="View profile" onClick={() => browserHistory.push('/profile/edit')}/>
    <MenuItem primaryText="Sign out" onClick={() => logout()} />
  </IconMenu>
);

const Login = () => (
  <Link to='/login'>
    <IconButton><ActionAccountCircle color={fullWhite} /></IconButton>
  </Link>
)

class Site extends Component {

  static propTypes = {
    ...connectProfile.PropTypes,
    children: PropTypes.any
  };

  render() {
    const { profile } = this.props
    const style = {
      appBar: {
        root: {
          position: 'fixed'
        },
        title: {
          fontSize: '1rem',
          fontWeight: 300
        }
      }
    }
    return (
      <div className="Site">
        <AppBar
          title="S K E D U L R"
          iconElementLeft={<div></div>}
          iconElementRight={profile ? <Logged profile={profile} /> : <Login />}
          titleStyle={style.appBar.title}
          style={style.appBar.root}
        />
        <div className="Site-page">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default connectProfile(Site);
