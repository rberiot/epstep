import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';

import './index.css';
import {Scan,Stats,Header} from './App';
import registerServiceWorker from './registerServiceWorker';

import $ from 'jquery'; 
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import { ValidatorForm } from 'react-form-validator-core';
import { TextValidator} from 'react-material-ui-form-validator';
import './App.css';
import logo from './logo.png';

const styles = {
  loginErrorStyle: {
    color: '#ccc',
  },
  loginUnderlineStyle: {
    borderColor: '#a1197d',
  },
  loginFloatingLabelStyle: {
    color: '#a1197d',
    opacity: '0.7',
    fontSize: '12px',
    fontWeight: 'normal',
    textTransform: 'uppercase'
  },
  loginFloatingLabelFocusStyle: {
    color: '#a1197d',
  },
  fullwidth: {
    width: '100%'
  },
  logo: {
    maxWidth: '80%',
    marginTop: '15px'
  },
  tabs: {
    backgroundColor: '#a1197d'
  },
  default_tab: {
    color: '#fff',
    backgroundColor: '#a1197d',
    fontWeight: 400,
  },
  active_tab: {
    color: '#333',
  },
  button: {
    width: '100%',
    height: '48px',
    lineHeight: '48px',
    marginTop: '15px',
    marginBottom: '15px',
  },
  
};


/* https://tylermcginnis.com/react-router-protected-routes-authentication/ */
const appAuth = {
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 10)
  },
  signout(cb) {
    this.isAuthenticated = false
    localStorage.removeItem("loggedIn")
    setTimeout(cb, 10)
  }
}


var email;
var token;
var tokenValidationIntervalId;

let wsbaseurl = "http://localhost:8000";

function tokenValidation(self) {
  $.ajax({
    url: wsbaseurl+'/auth',
    dataType : 'json',
    data: { email: email, token: token },
    type: "GET",
    cache: false, 
    success: function (data) {

      if (data && data.status === "OK") {
        clearInterval(tokenValidationIntervalId)
        localStorage.setItem("loggedIn", true);

        appAuth.authenticate(() => {
          self.setState(() => ({
            redirectToReferrer: true
          }))
          self.props.history.push('/Scan')
        })
      } else if (data && data.status === "TOKEN_NOT_ACTIVATED") {
        self.props.history.push('/Authlogin')
      }

    },
    error: function(xhr, ajaxOptions, thrownError) {
      console.log('ajax error:'+xhr.responseText);      
    }
  });
}


if (localStorage.getItem("loggedIn")) {
  appAuth.signout();
} else {
  appAuth.authenticate();
}



/* !!! TO REMOVE !!! */
appAuth.authenticate();
/* !!! TO REMOVE !!! */




/* https://medium.com/technoetics/create-basic-login-forms-using-create-react-app-module-in-reactjs-511b9790dede */
/* material input validation : https://www.npmjs.com/package/react-material-ui-form-validator */
/* core input validation : https://www.npmjs.com/package/react-form-validator-core */
class Login extends React.Component {

  constructor(props){
      super(props);
      this.state={
        redirectToReferrer: '',
        email:'',
        nickname:'',
        token:''
      }
      this.handleChange = this.handleChange.bind(this);
      this.handleChange2 = this.handleChange2.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
      const email = event.target.value;
      this.setState({ email });
  }
  handleChange2(event) {
      const nickname = event.target.value;
      this.setState({ nickname });
  }

  handleSubmit() {

    let self = this;

    $.ajax({
      url: wsbaseurl+'/auth',
      dataType : 'json',
      data: { email: this.state.email, nickname: this.state.nickname },
      type: 'GET',
      cache: false,           
      success: function(data) {
        console.log("status:"+data.status+" / "+"token:"+data.token);

        if (data && data.status === "OK") {

          localStorage.setItem("email", this.state.email);
          localStorage.setItem("nickname", this.state.nickname);

          email = this.state.email;
          token = data.token;

          tokenValidation(self, email, token)
        
        }
        
      }.bind(this),
      error: function(xhr, ajaxOptions, thrownError) {
        console.log('ajax error:'+xhr.responseText);      
      }
    });

  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { redirectToReferrer } = this.state;
    const { email } = this.state;
    const { nickname } = this.state;

    if (redirectToReferrer) {
      <Redirect to={from}/>
    }

    return (

      <div className="container">
        <div className="row">
          <div className="col-xs-8 col-xs-offset-2 col-md-4 col-md-offset-4">
            <Header />
          </div>
          <div className="col-xs-12 col-md-4 col-md-offset-4">
            <MuiThemeProvider>
              <ValidatorForm
                ref="form"
                onSubmit={this.handleSubmit}
                instantValidate={true}
                onError={errors => console.log(errors)}
              >
                <TextValidator
                  style={styles.fullwidth}
                  floatingLabelStyle={styles.loginFloatingLabelStyle}
                  floatingLabelFocusStyle={styles.loginFloatingLabelFocusStyle}
                  underlineFocusStyle={styles.loginUnderlineStyle}
                  floatingLabelText="Enter your email"
                  hintText="xyz.xyz@europarl.europa.eu"
                  onChange={this.handleChange}
                  name="email"
                  value={email}
                  validators={['required', 'isEmail', 'matchRegexp:^[a-z0-9](.?[a-z0-9]){3,}@europarl.europa.eu|^[a-z0-9](.?[a-z0-9]){3,}@ext.europarl.europa.eu$']}
                  errorMessages={['This field is required', 'Please provide a valid email address', 'Please provide a valid @europarl.europa.eu or @ext.europarl.europa.eu email address']}
                />
                <TextValidator
                  style={styles.fullwidth}
                  floatingLabelStyle={styles.loginFloatingLabelStyle}
                  floatingLabelFocusStyle={styles.loginFloatingLabelFocusStyle}
                  underlineFocusStyle={styles.loginUnderlineStyle}
                  floatingLabelText="Enter your nickname"
                  hintText="xyz"
                  onChange={this.handleChange2}
                  name="nickname"
                  value={nickname}
                  validators={['required']}
                  errorMessages={['This field is required']}
                />
                <RaisedButton type="Submit" style={styles.button} label="Login" backgroundColor="#a1197d" labelColor="#fff" />
              </ValidatorForm>
            </MuiThemeProvider>
          </div>
        </div>
      </div>
    );
  }
}

class Authlogin extends React.Component {
  componentDidMount() {
     let self = this;
     tokenValidationIntervalId = setInterval( function() { tokenValidation(self) }, 5000 );
  }
  render(){
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-8 col-xs-offset-2 col-md-4 col-md-offset-4">
            <Header />
          </div>
          <div className="col-xs-12 col-md-4 col-md-offset-4">

            <p>Please check your mailbox to activate your account...</p>
          </div>
        </div>
      </div>
    );
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    appAuth.isAuthenticated 
      ? (<Component {...props} />
      ) : (
        <Redirect to={{
          pathname: '/Login',
          state: { from: props.location }
        }} />
      )
  )} />
)

const AuthButton = withRouter(({ history }) => (
  appAuth.isAuthenticated ? (
    <p>
      Hello <strong>{localStorage.getItem('nickname')}</strong> <button onClick={() => {
        appAuth.signout(() => history.push('/'))
      }}>Sign out</button>
    </p>
  ) : (
    <p>Not logged in.</p>
  )
))

export default function Main () {
  return (
    <Router>
      <div>
          <AuthButton/>
          <Route exact path='/' component={Login} />
          <Route path='/Login' component={Login} />
          <Route path='/Authlogin' component={Authlogin} />
          <PrivateRoute path='/Scan' component={Scan} />
          <PrivateRoute path='/Stats' component={Stats} />
      </div>
    </Router>
  )
}


ReactDOM.render(
    <Main />
, document.getElementById('root'));

registerServiceWorker();