import React, {Component} from 'react';
import {Route, Router, browserHistory} from 'react-router';

import EditProfile from './EditProfile';
import Home from './Home';
import Login from './Login';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Site from './Site';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {requireAuth} from '../auth';

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
              {/* Place all authenticated routes here */}
              <Route path="/profile/edit" component={EditProfile} />
            </Route>
          </Route>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
