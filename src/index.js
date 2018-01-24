import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types'
import {
  HashRouter as Router,
  Route,
  Redirect,
  withRouter
} from 'react-router-dom';

import './index.css';
import {Scan,Stats,Wall,Header,BottomNav} from './App';
import registerServiceWorker from './registerServiceWorker';

import $ from 'jquery'; 
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import { ValidatorForm } from 'react-form-validator-core';
import { TextValidator} from 'react-material-ui-form-validator';
import { ToastContainer, toast } from 'react-toastify';

import {IconUser, IconUserEdit, Bin, UserPicturePlaceholder, EditPlaceholder, EditPen} from './SVGicon';

import './App.css';

import Webcam from 'react-webcam';

const styles = {
  loginErrorStyle: {
    color: '#ccc',
  },
  loginUnderlineStyle: {
    borderColor: '#a1197d',
  },
  loginDisabledUnderlineStyle: {
    borderColor: '#ccc',
    borderWidth: '1px',

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
    marginTop: '50px',
    marginBottom: '15px',
  },
  bgAuth: {
    height: 'calc(100vh - 48px)',
    backgroundColor: 'rgba(161, 25, 125, 1)',
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

//let wsbaseurl = "http://localhost:8000";
//let wsbaseurl = "https://a2780b8b.ngrok.io";
let wsbaseurl = "";


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
        
        localStorage.setItem("loggedIn", 'true');
        localStorage.setItem("firstVisit", 'true');

        appAuth.authenticate(() => {
          self.setState(() => ({
            redirectToReferrer: true
          }))
          self.props.history.push('/Scan')
        })

        $.ajax({
          url: wsbaseurl+'/update_profile',
          type: "GET",
          data: { nickname: localStorage.getItem('nickname'), token: localStorage.getItem('token') },
          success: function(data){
            console.log(data.status);
            if (data && data.status === "OK") {
               console.log("nickname correctly updated on DB");
            }
          }.bind(this),
          error: function(xhr, ajaxOptions, thrownError) {
            console.log(thrownError);
          }.bind(this)
        });


      } else if (data && data.status === "TOKEN_NOT_ACTIVATED") {
        self.props.history.push('/Authlogin')
      }

    },
    error: function(xhr, ajaxOptions, thrownError) {
      console.log('ajax error:'+xhr.responseText);      
    }
  });
}


if (localStorage.getItem("loggedIn") === 'true') {
  appAuth.authenticate();
} else {
  appAuth.signout();
}


/* !!! TO REMOVE !!! */
//appAuth.signout();
//appAuth.authenticate();
/* !!! TO REMOVE !!! */




const CookieMsg = ({ id, undo, closeToast }) => {
  function handleClick(){
    localStorage.setItem("acceptCookie", 'true');
    closeToast();
  }

  return (
    <div>
      <h2>Cookie</h2>
      <p>The cookie settings on this website are set to 'allow all cookies' to give you the very best experience. If you continue without changing these settings, you consent to this - but if you want, you can change your settings at any time at the bottom of this page.</p>
      <button onClick={handleClick}>Ok</button>
    </div>
  );
}


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

  componentDidMount(){
    if(localStorage.getItem('acceptCookie') === null || localStorage.getItem('acceptCookie') === 'false'){
      this.handleToast4cookie();
    }
  }

  handleToast4cookie(tab) {
    setTimeout(() => {
      if (! toast.isActive(this.toastId)) {
        toast(<CookieMsg />);
      }
    }, 2000);
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
        //console.log("status:"+data.status+" / "+"token:"+data.token);

        if (data && data.status === "OK") {
          localStorage.setItem("email", this.state.email);
          localStorage.setItem("nickname", this.state.nickname);
          localStorage.setItem("token", data.token);
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
      <Redirect to={from} />
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
                  validators={['required', 'isEmail', 'matchRegexp:^[a-zA-Z0-9](.?[a-zA-Z0-9]){3,}@europarl.europa.eu|^[a-zA-Z0-9](.?[a-zA-Z0-9]){3,}@ext.europarl.europa.eu|^[a-zA-Z0-9](.?[a-zA-Z0-9]){3,}@ep.europa.eu$']}
                  errorMessages={['This field is required', 'Please provide a valid email address', 'Please provide a valid @ep.europa.eu, @europarl.europa.eu or @ext.europarl.europa.eu email address']}
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
                  validators={['required', 'maxStringLength:12']}
                  errorMessages={['This field is required', 'Maximum 12 characters']}
                />
                <RaisedButton type="Submit" style={styles.button} label="Login" backgroundColor="#a1197d" labelColor="#fff" />
              </ValidatorForm>
            </MuiThemeProvider>

          </div>
        </div>

        {appAuth.isAuthenticated &&
          <BottomNav history={this.props.history} logged={true} />
        }

        <ToastContainer position={'top-center'} hideProgressBar={true} toastClassName={'cookieToast'} autoClose={false} closeOnClick={false} closeButton={false}  />
      </div>
    );
  }
}

class Edit extends React.Component {

  constructor(props){
      super(props);
      this.state={
        email: localStorage.getItem("email"),
        nickname: localStorage.getItem("nickname"),
        showCameraPreview: null,
        avatarImg64: null
      }
      this.handleChange2 = this.handleChange2.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

      this.setRef = this.setRef.bind(this);
      this.capture = this.capture.bind(this);
      this.editPlaceholder = this.editPlaceholder.bind(this);
  }


  handleChange2(event) {
      const nickname = event.target.value;
      this.setState({ nickname });
  }

  handleSubmit() {

    let self = this;
    localStorage.setItem("nickname", this.state.nickname);


    $.ajax({
      url: wsbaseurl+'/update_profile',
      type: "GET",
      data: { nickname: this.state.nickname, token: localStorage.getItem('token') },
      success: function(data){
        console.log(data.status);
        if (data && data.status === "OK") {
           console.log("nickname correctly updated on DB");
           self.props.history.push('/Stats')
        }

      }.bind(this),
      error: function(xhr, ajaxOptions, thrownError) {
        console.log(thrownError);
      }.bind(this)
    });

    
    
  }

  setRef(webcam) {
    this.webcam = webcam;
  }

  capture() {
    const imageSrc = this.webcam.getScreenshot();
    localStorage.setItem("avatarImg64", imageSrc);
    this.setState({ avatarImg64: localStorage.getItem("avatarImg64") });
  }

  editPlaceholder() {
    this.setState({ showCameraPreview: 'true'} );
  }

  render(){

    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-8 col-xs-offset-2 col-md-4 col-md-offset-4">
       
            <div className="editprofile">

              {this.state.showCameraPreview == 'true' ? (
                <div>
                  <div className="preview">
                    <Webcam
                      audio={false}
                      height={94}
                      ref={this.setRef}
                      screenshotFormat="image/jpeg"
                      width={94}
                      className=""
                    />
                  </div>
                  <button onClick={this.capture}>Capture photo</button>
                </div>
              ):(
                <div className="editPlaceholder" onClick={this.editPlaceholder}>

                {localStorage.getItem("avatarImg64") ?(
                  <div>
                    <img src={localStorage.getItem("avatarImg64")} alt="" className="img-circle mirror" />
                    <div className="editPen"><EditPen /></div>
                  </div>
                ):(
                  <EditPlaceholder />
                )}
                

                </div>
              )} 
              
              {this.state.avatarImg64 &&
                <div>
                <img src={this.state.avatarImg64} alt="" className="img-circle resized" />
                
                </div>
              }

            </div>
            
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-4 col-md-offset-4">
            <MuiThemeProvider>
              <ValidatorForm
                ref="form"
                onSubmit={this.handleSubmit}
                instantValidate={true}
                onError={errors => console.log(errors)}
              >
                <TextValidator
                  disabled={true}
                  style={styles.fullwidth}
                  floatingLabelStyle={styles.loginFloatingLabelStyle}
                  floatingLabelFocusStyle={styles.loginFloatingLabelFocusStyle}
                  underlineFocusStyle={styles.loginUnderlineStyle}
                  underlineDisabledStyle={styles.loginDisabledUnderlineStyle}
                  floatingLabelText="You can't change your email"
                  hintText="xyz.xyz@europarl.europa.eu"
                  onChange={this.handleChange}
                  name="email"
                  value={this.state.email}
                  validators={['required', 'isEmail', 'matchRegexp:^[a-z0-9](.?[a-z0-9]){3,}@europarl.europa.eu|^[a-z0-9](.?[a-z0-9]){3,}@ext.europarl.europa.eu$']}
                  errorMessages={['This field is required', 'Please provide a valid email address', 'Please provide a valid @europarl.europa.eu or @ext.europarl.europa.eu email address']}
                />
                <TextValidator
                  style={styles.fullwidth}
                  floatingLabelStyle={styles.loginFloatingLabelStyle}
                  floatingLabelFocusStyle={styles.loginFloatingLabelFocusStyle}
                  underlineFocusStyle={styles.loginUnderlineStyle}
                  floatingLabelText="Change your nickname"
                  hintText={this.state.nickname}
                  onChange={this.handleChange2}
                  name="nickname"
                  value={this.state.nickname}
                  validators={['required', 'maxStringLength:12']}
                  errorMessages={['This field is required', 'Maximum 12 characters']}
                />
                <RaisedButton type="Submit" style={styles.button} label="Save" backgroundColor="#a1197d" labelColor="#fff" />
              </ValidatorForm>
            </MuiThemeProvider>
          </div>
        </div>
         
        <BottomNav history={this.props.history} logged={true} />

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
        <div className="row" style={styles.bgAuth}>

          <div className="col-xs-8 col-xs-offset-2 col-md-4 col-md-offset-4">
            <Header />
          </div>

          <div className="col-xs-8 col-xs-offset-2 col-md-4 col-md-offset-4">
            <div className="marginVertical20 text-center">
              <h4 className="contrast_text">Please check your mailbox <br/> to activate your account...</h4>
            </div>
          </div>

        </div>

        <BottomNav history={this.props.history} logged={false} />

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


class Topbar extends React.Component {

    static propTypes = {
      match: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired
    }

    constructor(props){
        super(props);
        this.handleDeleteAccount = this.handleDeleteAccount.bind(this);
    }

    handleDeleteAccount() {
      let self = this;
      
      localStorage.removeItem("email")
      localStorage.removeItem("firstVisit")
      localStorage.removeItem("loggedIn")
      localStorage.removeItem("nickname")
      localStorage.removeItem("token")
      localStorage.removeItem("acceptCookie")
      localStorage.removeItem("avatarImg64")
      localStorage.removeItem("timeout")

      self.props.history.push('/')
    }


    render() {
      const { location, history } = this.props
        return (
          appAuth.isAuthenticated &&
            <div className="container account">

                <div className="row">
                  <div className="col-xs-6 sepa">
                    <div>
                      <span>Hello <strong>{localStorage.getItem('nickname')}</strong> <span className="hidden">@ {location.pathname}</span></span>
                    </div>
                  </div>
                  <div className="col-xs-6 text-right">
                    {location.pathname === '/Edit' ? (
                      <div>
                        <span onClick={this.handleDeleteAccount}>Delete my account </span>
                        <Bin />
                      </div>
                    ) : (
                      <div>
                        <span onClick={() => history.push('/Edit')}>Edit my account </span>
                        <IconUserEdit />
                      </div>
                    )}
                    
                  </div>
              </div>
            </div>

        )
    }
}

const TopBar = withRouter(Topbar);


export default function Main () {
  return (
    <Router>
      <div>
          <TopBar />
          <Route exact path='/' component={Login} />
          <Route path='/Login' component={Login} />
          <Route path='/Authlogin' component={Authlogin} />
          <PrivateRoute exact path='/Scan' component={Scan} />
          <PrivateRoute path='/Stats' component={Stats} />
          <PrivateRoute path='/Wall' component={Wall} />
          <PrivateRoute path='/Edit' component={Edit} />
          <PrivateRoute path='/scan:qr_id' component={Scan} />
      </div>
    </Router>
  )
}


ReactDOM.render(
    <Main />
, document.getElementById('root'));

registerServiceWorker();