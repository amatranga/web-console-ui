import axios from 'axios';
import React from 'react';
import { Redirect } from 'react-router-dom';
import Header from './Header';
import Join from './Join';
import PreIco from './PreIco';
import Profile from './Profile';
import SignupOrLogin from './SignupOrLogin';

class AllRoutes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      fireRedirect: false,
      isLoggedIn: false,
      token: null
    }

    this.createUser = this.createUser.bind(this);
    this.getToken = this.getToken.bind(this);
    this.logout = this.logout.bind(this);
  }

  createUser(user) {
    axios({
      method: 'POST',
      url: 'http://api.voicecoin.net/v1/Account',
      data: {
        email: user.email,
        password: user.password
      }
    }).then(res => {
      this.getToken(user);
    }).catch(err => {
      console.error(err, 'Error creating user');
    });
  }

  getToken(user) {
    const history = this.props.history;
    axios({
      method: 'POST',
      url: `http://api.voicecoin.net/v1/Account/token?username=${user.email}&password=${user.password}`
    }).then(res => {
      this.setState({email: user.email, fireRedirect: true, isLoggedIn: true, token: res.data});
    }).catch(err => {
      console.error(err, 'Error getting token');
    });
  }

  logout() {
    this.setState({email: null, fireRedirect: false, isLoggedIn: false, token: null});
    return (
      <Redirect to="/" />
    );
  }

  render() {
    const { from } = this.props.location.state || '/';
    const { fireRedirect } = this.state;
    const path = this.props.location.pathname;
    if (path === '/') {
      return (
        <React.Fragment>
          <Header isLoggedIn={this.state.isLoggedIn} />
          <PreIco />
        </React.Fragment>
      );
    }
    if (path === '/join') {
      return (
        <React.Fragment>
          <Header isLoggedIn={this.state.isLoggedIn} />
          <Join />
        </React.Fragment>
      );
    }
    if (path === '/login' || path === '/signup') {
      return (
        <React.Fragment>
          <Header isLoggedIn={this.state.isLoggedIn} />
          <SignupOrLogin
            createUser={this.createUser}
            getToken={this.getToken}
            location={path} />
            {fireRedirect && (
              <Redirect to={from || '/profile'} />
            )}
          </React.Fragment>
      );
    }
    if (path === '/profile') {
      return (
        <React.Fragment>
          <Header isLoggedIn={this.state.isLoggedIn} logout={this.logout} />
          <Profile token={this.state.token} />
        </React.Fragment>
      );
    }
  }
}

export default AllRoutes;
