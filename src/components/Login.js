import './Login.css'

import React, { Component } from 'react'

import RaisedButton from 'material-ui/RaisedButton'
import { login } from '../auth'

class Login extends Component {
  componentWillMount() {
    this.login = login()
  }

  componentWillUnmount() {
    this.login.hide()
    this.login = null
  }

  render() {
    const style = {
      button: {
      }
    }
    return (
      <div className='Login'>
        <RaisedButton 
          primary={true}
          label='Login' 
          onClick={() => login()}
          style={style.button}
        />
      </div>
    );
  }
}

export default Login;
