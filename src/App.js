import React, { Component } from 'react';
import QrReader from 'react-qr-reader';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {Tabs, Tab} from 'material-ui/Tabs';

import { Button } from 'rmwc';

import { ValidatorForm } from 'react-form-validator-core';
import { TextValidator} from 'react-material-ui-form-validator';

import CircularProgressbar from 'react-circular-progressbar';

import { ToastContainer, toast } from 'react-toastify';

import './App.css';

import logo from './logo.png';
import '../node_modules/material-components-web/dist/material-components-web.css';

/* for correct path after build */
const baseUrl = process.env.PUBLIC_URL;

const styles = {
  loginErrorStyle: {
    color: '#ccc',
  },
  loginUnderlineStyle: {
    borderColor: '#8C2875',
  },
  loginFloatingLabelStyle: {
    color: '#ccc',
    fontWeight: 'normal',
  },
  loginFloatingLabelFocusStyle: {
    color: '#8C2875',
  },
  fullwidth: {
    width: '100%'
  },
  logo: {
    maxWidth: '80%',
    marginTop: '15px'
  },
  tabs: {
    backgroundColor: '#8C2875'
  },
  default_tab: {
    color: '#fff',
    backgroundColor: '#8C2875',
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


const ToastCloseButton = ({ YouCanPassAnyProps, closeToast }) => (
  <span onClick={closeToast}>CLOSE</span>
);


localStorage.setItem('loggedIn', false);





export class Header extends Component {
  render() {
    return (
      <div className="text-center">
        <img src={logo} alt="Logo" style={styles.logo}  />
      </div>
    );
  }
}


/* https://medium.com/technoetics/create-basic-login-forms-using-create-react-app-module-in-reactjs-511b9790dede */
/* material input validation : https://www.npmjs.com/package/react-material-ui-form-validator */
/* core input validation : https://www.npmjs.com/package/react-form-validator-core */
export class Login extends Component {
  
  constructor(props){
      super(props);
      this.state={
        email:''
      }
      this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
      const email = event.target.value;
      this.setState({ email });
  }

  handleSubmit() {
    // form submit logic
    const { history } = this.props;

    this.setState({ error: false });

    if (!(this.state.email === 'jerome.ferrier@europarl.europa.eu')) {
      return this.setState({ error: true });
    }

    localStorage.setItem('loggedIn', true);
    history.push(baseUrl + "/App");

    /*
    var apiBaseUrl = "http://localhost:4000/api/";
    var self = this;
    var payload={
      "email":this.state.username,
    }
    axios.post(apiBaseUrl+'login', payload).then(function (response) {
      console.log(response);
      if(response.data.code == 200){
        console.log("Login successfull");
        var uploadScreen=[];
        uploadScreen.push(<UploadScreen appContext={self.props.appContext}/>)
        self.props.appContext.setState({loginPage:[],uploadScreen:uploadScreen})
      } else if(response.data.code == 204){
        console.log("Username do not match");
        alert("username do not match")
      } else{
        console.log("Username does not exists");
        alert("Username does not exist");
      }
    }).catch(function (error) {
      console.log(error);
    });
    */

  }

  render() {
    const { email } = this.state;
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
                  validators={['required', 'isEmail', 'matchRegexp:^[a-z0-9](\.?[a-z0-9]){3,}@europarl\.europa\.eu|@ext\.europarl\.europa\.eu$/i']}
                  errorMessages={['This field is required', 'Please provide a valid email address', 'Please provide a valid @europarl.europa.eu or @ext.europarl.europa.eu email address']}
                />
                <RaisedButton type="Submit" style={styles.button} label="Login" backgroundColor="#8C2875" labelColor="#fff" onClick={(event) => this.handleSubmit(event)}/>
              </ValidatorForm>
              
            </MuiThemeProvider>
          </div>
        </div>
      </div>

    );
  }
}


export class BottomNav extends Component {

  constructor(props){
    super(props);
    this.state={
      index: '',
      activeTabIndex: this.props.defaultActiveTabIndex
    };
    this.handleActive = this.handleActive.bind(this);
  }

  handleChange = (value) => {
    this.setState({
      value: value,
    });
  };
    
  handleActive(tab) {
    var route = tab.props['data-route'];
    this.setState({
        activeTabIndex: tab.props['value']
    })
    setTimeout(() => {
      this.props.history.push(baseUrl + route);
    }, 300)
  }

  render() {

    return (
      this.props.logged ?
      <MuiThemeProvider>
        <Tabs value={this.state.value} onChange={this.handleChange} inkBarStyle={{background: '#fff', display: 'none'}} style={styles.tabs} className="tabs">
          
          <Tab
            icon={
              <svg width="20px" height="13px" viewBox="0 0 20 13" xmlns="http://www.w3.org/2000/svg">
                <g id="tabNavBtn1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Home/login" transform="translate(-36.000000, -610.000000)" fill="#FFFFFF" fillOpacity="0.5">
                        <g id="toolbar" transform="translate(0.000000, 592.000000)">
                            <g id="navbar" transform="translate(36.000000, 9.000000)">
                                <g id="icon_rank" transform="translate(0.000000, 9.000000)">
                                    <path d="M14,11 L18,11 L18,7 L14,7 L14,11 Z M8,11 L12,11 L12,2 L8,2 L8,11 Z M2,11 L6,11 L6,6 L2,6 L2,11 Z M19,5 L14,5 L14,1 C14,0.448 13.552,0 13,0 L7,0 C6.448,0 6,0.448 6,1 L6,4 L1,4 C0.448,4 0,4.448 0,5 L0,12 C0,12.552 0.448,13 1,13 L7,13 L13,13 L19,13 C19.552,13 20,12.552 20,12 L20,6 C20,5.448 19.552,5 19,5 L19,5 Z"></path>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
              </svg>
            }
            /* label="Stats" */
            value='0'
            data-route="/Stats"
            onActive={(event) => this.handleActive(event)}
            className={this.state.activeTabIndex == 0 ? "tab active" : "tab"}
          >
          

          </Tab>
          <Tab
            icon={
              <svg width="20px" height="20px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <g id="STEP2" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Home/login" transform="translate(-172.000000, -604.000000)">
                        <g id="toolbar" transform="translate(0.000000, 592.000000)">
                            <g id="navbar" transform="translate(36.000000, 9.000000)">
                                <g id="qr-code" transform="translate(134.000000, 0.000000)">
                                    <g>
                                        <g id="Frame_-_24px">
                                            <rect id="Rectangle-path" x="0" y="0.999" width="24" height="24"></rect>
                                        </g>
                                        <g id="Line_Icons" transform="translate(2.000000, 2.000000)" fillRule="nonzero" fill="#FFFFFF" fillOpacity="0.5">
                                            <g id="Group">
                                                <polygon id="Shape" points="10 8.999 8 8.999 8 4.999 12 4.999 12 6.999 10 6.999"></polygon>
                                                <polygon id="Shape" points="9 13.999 4 13.999 4 8.999 6 8.999 6 11.999 9 11.999"></polygon>
                                                <rect id="Rectangle-path" x="10" y="9.999" width="2" height="4"></rect>
                                                <polygon id="Shape" points="16 12.999 14 12.999 14 10.999 13 10.999 13 8.999 16 8.999"></polygon>
                                                <path d="M18,20.999 L2,20.999 C0.897,20.999 0,20.103 0,18.999 L0,2.999 C0,1.895 0.897,0.999 2,0.999 L18,0.999 C19.103,0.999 20,1.895 20,2.999 L20,18.999 C20,20.103 19.103,20.999 18,20.999 Z M2,2.999 L2,18.999 L18.001,18.999 L18,2.999 L2,2.999 Z" id="Shape"></path>
                                                <rect id="Rectangle-path" x="4" y="4.999" width="3" height="3"></rect>
                                                <rect id="Rectangle-path" x="13" y="13.999" width="3" height="3"></rect>
                                                <rect id="Rectangle-path" x="13" y="4.999" width="3" height="3"></rect>
                                                <rect id="Rectangle-path" x="7" y="14.999" width="5" height="2"></rect>
                                                <rect id="Rectangle-path" x="4" y="14.999" width="2" height="2"></rect>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
              </svg>
            }
            /* label="QR Scan" */
            value='1'
            data-route="/App"
            onActive={(event) => this.handleActive(event)}
            className={this.state.activeTabIndex == 1 ? "tab active" : "tab"}
          />
          <Tab
            icon={
              <svg width="16px" height="16px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <polygon id="path-1" points="7.99985 7 0 7 0 0 15.9997 0 15.9997 7"></polygon>
                </defs>
                <g id="STEP2" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Home/login" transform="translate(-308.000000, -607.000000)">
                        <g id="toolbar" transform="translate(0.000000, 592.000000)">
                            <g id="navbar" transform="translate(36.000000, 9.000000)">
                                <g id="icon_user" transform="translate(272.000000, 6.000000)">
                                    <g>
                                        <path d="M8,2 C6.897,2 6,2.896 6,4 C6,5.103 6.897,6 8,6 C9.103,6 10,5.103 10,4 C10,2.896 9.103,2 8,2 M8,8 C5.794,8 4,6.206 4,4 C4,1.794 5.794,0 8,0 C10.206,0 12,1.794 12,4 C12,6.206 10.206,8 8,8" id="Fill-1" fill="#FFFFFF" fillOpacity="0.5"></path>
                                        <g id="body" transform="translate(0.000000, 9.000000)">
                                            <mask id="mask-2" fill="white">
                                                <use xlinkHref="#path-1"></use>
                                            </mask>
                                            <g id="Clip-4"></g>
                                            <path d="M2.1587,5 L13.8417,5 C13.2427,3.192 11.0077,2 7.9997,2 C4.9917,2 2.7567,3.192 2.1587,5 L2.1587,5 Z M15.9997,7 L-0.0003,7 L-0.0003,6 C-0.0003,2.467 3.2897,0 7.9997,0 C12.7107,0 15.9997,2.467 15.9997,6 L15.9997,7 Z" id="Fill-3" fill="#FFFFFF" fillOpacity="0.5" mask="url(#mask-2)"></path>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
              </svg>
            }
            /* label="User" */
            value='2'
            data-route="/Login"
            onActive={(event) => this.handleActive(event)}
            className={this.state.activeTabIndex == 2 ? "tab active" : "tab"}
          />
        </Tabs>
      </MuiThemeProvider>
      :
      <div className="text-center">
        <p>You're not logged</p>
      </div>
    );
  }
}



export class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      delay: 300,
      result: 'No result',
      value: 1,
    }
    this.handleScan = this.handleScan.bind(this);
    this.history;
  }

  handleScan(data){
    if(data){
      this.setState({
        result: data,
      })
    }
  }

  handleError(err){
    console.error(err)
  }

  handleLogout(event){
    const { history } = this.props;
    localStorage.setItem('loggedIn', false);
    history.push(baseUrl + "/Login");
  }



  render(){

    return(

        <div className="container">
          <h3 className="overallTitle">SCAN A QR CODE</h3>
          <QrReader
            delay={this.state.delay}
            onError={this.handleError}
            onScan={this.handleScan}
            style={{ width: '100%' }}
          />

          <p>{this.state.result}</p>
        
          <MuiThemeProvider>
            <RaisedButton label="Logout" style={styles.fullwidth} backgroundColor="#8C2875" labelColor="#fff" rippleStyle={styles.button} onClick={(event) => this.handleLogout(event)} />
          </MuiThemeProvider>

          {/* <Button raised >Logout</Button> */}

        </div>


    )
  }
}

/* https://github.com/iqnivek/react-circular-progressbar/tree/c3796f26d82cc5da81714cfec5b2bf9b9ffb4b96 */
class ChangingProgressbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPercentageIndex: 0,
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        currentPercentageIndex: (this.state.currentPercentageIndex + 1) % this.props.percentages.length
      });
    }, this.props.interval);
  }

  render() {
    return <CircularProgressbar {...this.props} percentage={this.props.percentages[this.state.currentPercentageIndex]} initialAnimation={true} strokeWidth={5} />;
  }
}
ChangingProgressbar.defaultProps = {
  interval: 1500,
}


export class Stats extends Component {
  
  constructor(props){
    super(props);
  }

  notify = () => toast("Happy to see you again 😀");

  render(){

    return(
      <div className="container">

        <div className="row">
          <div className="col-xs-6 col-xs-offset-3 col-md-4 col-md-offset-4">
            <ChangingProgressbar percentages={[0, 21, 43, 62, 89, 100]} />

            <button onClick={this.notify}>Notify !</button>
            <ToastContainer position={'bottom-center'} hideProgressBar={true} autoClose={false} closeButton={<ToastCloseButton YouCanPassAnyProps="foo" />} />

          </div> 
        </div>

     
        
      </div>  

    )
  }
}


