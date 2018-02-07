import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';
import {Scan,Stats,Wall,Header,BottomNav,Edit} from './App';
import registerServiceWorker from './registerServiceWorker';
import $ from 'jquery'; 
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import { ValidatorForm, ValidatorComponent } from 'react-form-validator-core';
import { TextValidator } from 'react-material-ui-form-validator';
import Checkbox from 'material-ui/Checkbox';
import { ToastContainer, toast } from 'react-toastify';
import './index.css';
import './App.css';

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
    marginTop: '20px',
    marginBottom: '20px',
  },
  bgAuth: {
    height: '100vh',
    backgroundColor: 'rgba(161, 25, 125, 1)',
  },
  checkbox: {
    borderColor: '#a1197d',
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
//let wsbaseurl = "https://a2780b8b.ngrok.io/app";
let wsbaseurl = "/app";


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
        localStorage.setItem("nickname", data.public_name);

        $.ajax({
          url: wsbaseurl+'/update_profile',
          type: "GET",
          data: { nickname: localStorage.getItem('nickname'), token: localStorage.getItem('token') },
          success: function(data){
            console.log(data.status);
            if (data && data.status === "OK") {
               console.log("nickname correctly updated on DB");
            }
          },
          error: function(xhr, ajaxOptions, thrownError) {
            console.log(thrownError);
          }
        });

        appAuth.authenticate(() => {
          self.setState(() => ({
            redirectToReferrer: true
          }))
          self.props.history.push('/Stats')
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

const TermsMsg = ({ id, undo, closeToast }) => {
  function handleClick(){
    closeToast();
  }
  return (
    <div>
      <h2>Terms & conditions</h2>
      <p>The cookie settings on this website are set to 'allow all cookies' to give you the very best experience. If you continue without changing these settings, you consent to this - but if you want, you can change your settings at any time at the bottom of this page.</p>
      <button onClick={handleClick}>Ok</button>
    </div>
  );
}


class CheckboxValidatorElement extends ValidatorComponent {
  render() {
    const { errorMessages, validators, requiredError, value, ...rest } = this.props;
    return (
      <div>
        <Checkbox
            {...rest}
            ref={(r) => { this.input = r; }}
        />
        {this.errorText()}
      </div>
    );
  }
  errorText() {
    const { isValid } = this.state;
    if (isValid) {
        return null;
    }
    const style = {
        fontSize: '12px',
        color: 'rgb(244, 67, 54)',
        position: 'relative',
        marginTop: '2px',
    };
    return (
      <div style={style}>
          {this.getErrorMessage()}
      </div>
    );
  }
}
export default CheckboxValidatorElement;

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
        token:'',
        value:'',
        checked: false,
      }
      this.handleChange = this.handleChange.bind(this);
      this.handleChange2 = this.handleChange2.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleCheck = this.handleCheck.bind(this);
  }

  componentWillMount() {
      ValidatorForm.addValidationRule('isTruthy', value => value);
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

  handleToast4terms() {
    setTimeout(() => {
      toast(<TermsMsg />);
    }, 100);
  }

  handleChange(event) {
      const email = event.target.value;
      this.setState({ email });
  }
  handleChange2(event) {
      const nickname = event.target.value;
      this.setState({ nickname });
  }

  handleCheck() {
    this.setState((oldState) => {
      return {
        checked: !oldState.checked,
      };
    });
  }

  handleSubmit() {
    let self = this;
    $.ajax({
      url: wsbaseurl+'/auth',
      dataType : 'json',
      data: { email: this.state.email },
      type: 'GET',
      cache: false,           
      success: function(data) {
        //console.log("status:"+data.status+" / "+"token:"+data.token);
        if (data && data.status === "OK") {
          localStorage.setItem("email", this.state.email);
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

                {/*
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
                */}

                <CheckboxValidatorElement
                    id={1}
                    name="terms"
                    label={(<span>I agree to&nbsp;
                      <span onClick={this.handleToast4terms}>
                        terms and conditions
                      </span>
                    </span>)}
                    checked={this.state.checked}
                    onCheck={this.handleCheck}
                    className="checkbox"
                    validators={['isTruthy']}
                    errorMessages={['To continue, please accept terms and conditions']}
                    value={this.state.checked}
                />
                <RaisedButton type="Submit" style={styles.button} label="Authenticate" backgroundColor="#a1197d" labelColor="#fff" />
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



class Authlogin extends React.Component {
  componentWillMount(){
    document.body.style.margin = "0";
  }
  componentDidMount(){
    let self = this;
    tokenValidationIntervalId = setInterval( function() { tokenValidation(self) }, 5000 );
  }
  componentWillUnmount(){
    document.body.style.margin = null;
  }
  render(){
    return (
      <div>
        <div style={styles.bgAuth} className="auth">

          <div className="col-xs-8 col-xs-offset-2 col-md-4 col-md-offset-4">
            <Header />
          </div>

          <div className="col-xs-8 col-xs-offset-2 col-md-4 col-md-offset-4">
            <div className="marginVertical20 text-center">
              <h4 className="contrast_text">Please check your mailbox <br/> to activate your account...</h4>
            </div>
          </div>

        </div>

      </div>

    );
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    appAuth.isAuthenticated ? (
      <Component {...props} />
    ):(
      <Redirect to={{pathname: '/Login', state: { from: props.location }}} />
    )
  )} />
)


export class Main extends React.Component {
  render(){
    return (
      <Router>
        <div>
            <PrivateRoute exact path='/' component={Scan} />
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
}


ReactDOM.render(
    <Main />
, document.getElementById('root'));

registerServiceWorker();