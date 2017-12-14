import React, { Component } from 'react';
import QrReader from 'react-qr-reader';

import $ from 'jquery'; 

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

import {Tabs, Tab} from 'material-ui/Tabs';

import { ValidatorForm } from 'react-form-validator-core';
import { TextValidator} from 'react-material-ui-form-validator';

import CircularProgressbar from 'react-circular-progressbar';
import CountUp from 'react-countup';

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
    borderColor: '#a1197d',
  },
  loginFloatingLabelStyle: {
    color: '#ccc',
    fontWeight: 'normal',
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


const ToastCloseButton = ({ YouCanPassAnyProps, closeToast }) => (
  <span onClick={closeToast}>CLOSE</span>
);



export class Header extends Component {
  render() {
    return (
      <div className="text-center">
        <img src={logo} alt="Logo" style={styles.logo}  />
      </div>
    );
  }
}


export class BottomNav extends Component {

  constructor(props){
    super(props);
    this.state={
      activeTabIndex: this.props.history.location.pathname
    };
    this.handleActive = this.handleActive.bind(this);
  }

  componentDidMount() {
    let urlPath = this.props.history.location.pathname;
    this.setState({ activeTabIndex: urlPath });
  }

  handleChange = (value) => {
    this.setState({
      activeTabIndex: value,
    });
  };
    
  handleActive(tab) {
    var route = tab.props['data-route'];
    this.setState({
        activeTabIndex: tab.props['value']
    })
    setTimeout(() => {
      this.props.history.push(route);
    }, 300)
  }

  render() {

    return (
      this.props.logged ?
      <footer id="bottomnav">
        <MuiThemeProvider>
          <Tabs value={this.state.activeTabIndex} onChange={this.handleChange} inkBarStyle={{background: '#fff', display: 'none'}} style={styles.tabs} className="tabs">
            

            
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
              value='/Login'
              data-route="/Login"
              onActive={(event) => this.handleActive(event)}
              className={this.state.activeTabIndex === '/Login' ? "tab active" : "tab"}
            />

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
              value='/Scan'
              data-route="/Scan"
              onActive={(event) => this.handleActive(event)}
              className={this.state.activeTabIndex === '/Scan' ? "tab active" : "tab"}
            />

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
              value='/Stats'
              data-route="/Stats"
              onActive={(event) => this.handleActive(event)}
              className={this.state.activeTabIndex === '/Stats' ? "tab active" : "tab"}
            />
            
          </Tabs>
        </MuiThemeProvider>
      </footer>
      :
      <footer id="bottomnav">
        <div className="text-center">
          <p>You're not logged</p>
        </div>
      </footer>
    );
  }
}


export class Scan extends Component {
  constructor(props){
    super(props)
    this.state = {
      delay: 200,
      result: 'No result'
    }
    this.handleScan = this.handleScan.bind(this);

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
    alert(localStorage.getItem('token'));
    history.push(baseUrl + "/Login");
  }


  render(){

    return(

      <div className="container">
        <div className="row">
          <h3 className="overallTitle">SCAN A QR CODE</h3>
          <QrReader
            delay={this.state.delay}
            onError={this.handleError}
            onScan={this.handleScan}
            style={{ width: '100%' }}
          />
          <div className="col-xs-12">
            <p>{this.state.result}</p>
          
            <MuiThemeProvider>
              <RaisedButton label="Logout" style={styles.fullwidth} backgroundColor="#a1197d" labelColor="#fff" rippleStyle={styles.button} onClick={(event) => this.handleLogout(event)} />
            </MuiThemeProvider>
          </div>

          <BottomNav history={this.props.history} logged={true} />
        </div>

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
    /*
    setInterval(() => {
      this.setState({
        currentPercentageIndex: (this.state.currentPercentageIndex + 1) % this.props.percentages.length
      });
    }, this.props.interval);
    */
    
  }

  render() {
    return (
      <div className="col-xs-8 col-xs-offset-2 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4" >

        <div style={{ position: 'relative', width: '100%', height: '100%'}} className="CircularProgressdata">
          <div style={{ position: 'absolute', width: '100%' }}>
            <CircularProgressbar className="" {...this.props} percentage={this.props.percentages} initialAnimation={true} strokeWidth={5} />
            <CountUp
              className="account-balance CircularProgressbar-text"
              start={0}
              end={this.props.percentages}
              duration={1.5}
              useEasing={true}
              useGrouping={true}
              separator=" "
              decimals={0}
              decimal=","
              suffix="%"
            />
          </div>

          <div style={{display: 'flex', flex: 1, flexDirection: 'column', alignItems:'center', justifyContent:'space-between', width: '100%', padding: '17%', marginBottom: '30%' }} className="text-center" >

            <div>
              <h4 className="value uppercase">Fuji mont blanc top of the world</h4>
            </div>
          
            <svg width="45%" height="45%" viewBox="0 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <g id="STEP2" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g transform="translate(-157.000000, -155.000000)">
                  <g transform="translate(0.000000, -110.000000)">
                    <g transform="translate(158.000000, 267.000000)">
                        <polygon fillOpacity="0.5" fill="#a1197d" points="19.618 23.2361 23.618 29.2361 30.618 25.2361 36.618 29.2361 43.618 44.2361 1.618 44.2361 9.618 27.2361"></polygon>
                        <polygon stroke="#a1197d" strokeWidth="2" points="0.618 44.2361 44.618 44.2361 22.618 0.2361"></polygon>
                    </g>
                  </g>
                </g>
              </g>
            </svg>

            <div>
              <h4 className="value">3217m</h4>
            </div>

          </div>

          
          <div className="col-xs-6 sepa"></div>
          <div className="col-xs-6"></div>

          <div className="col-xs-12 text-center">
            <svg width="20px" height="13px" viewBox="0 0 20 13" xmlns="http://www.w3.org/2000/svg" style={{marginLeft: '-3px'}}>
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g transform="translate(-36.000000, -610.000000)" fill="#a1197d">
                      <g transform="translate(0.000000, 592.000000)">
                          <g transform="translate(36.000000, 9.000000)">
                              <g transform="translate(0.000000, 9.000000)">
                                  <path d="M14,11 L18,11 L18,7 L14,7 L14,11 Z M8,11 L12,11 L12,2 L8,2 L8,11 Z M2,11 L6,11 L6,6 L2,6 L2,11 Z M19,5 L14,5 L14,1 C14,0.448 13.552,0 13,0 L7,0 C6.448,0 6,0.448 6,1 L6,4 L1,4 C0.448,4 0,4.448 0,5 L0,12 C0,12.552 0.448,13 1,13 L7,13 L13,13 L19,13 C19.552,13 20,12.552 20,12 L20,6 C20,5.448 19.552,5 19,5 L19,5 Z"></path>
                              </g>
                          </g>
                      </g>
                  </g>
              </g>
            </svg>
          </div>

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
          

        </div>

        
        {/*
        <div className="col-xs-12 text-center">
          <svg width="20px" height="13px" viewBox="0 0 20 13" xmlns="http://www.w3.org/2000/svg" transform="translate(-2.000000, 5)">
            <g id="tabNavBtn1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" >
                <g id="Home/login" fill="#a1197d" fillOpacity="1">
                    <g id="icon_rank" >
                        <path d="M14,11 L18,11 L18,7 L14,7 L14,11 Z M8,11 L12,11 L12,2 L8,2 L8,11 Z M2,11 L6,11 L6,6 L2,6 L2,11 Z M19,5 L14,5 L14,1 C14,0.448 13.552,0 13,0 L7,0 C6.448,0 6,0.448 6,1 L6,4 L1,4 C0.448,4 0,4.448 0,5 L0,12 C0,12.552 0.448,13 1,13 L7,13 L13,13 L19,13 C19.552,13 20,12.552 20,12 L20,6 C20,5.448 19.552,5 19,5 L19,5 Z"></path>
                    </g>
                </g>
            </g>
          </svg>
        </div>
        */}

      </div>

      
      );
  }
}
ChangingProgressbar.defaultProps = {
  interval: 1500,
}

/* https://fkhadra.github.io/react-toastify/ */
/* https://github.com/glennreyes/react-countup */
export class Stats extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      random: null,
      scoreResults: [],
      profileResults: []
    };

  }

  min = 1;
  max = 100;

  componentDidMount(){
    this.setState({random: this.min + Math.floor((Math.random() * (this.max - this.min)))});
    this.handleToast()
    var query    = "Hallyday";
    var category = "song";
    var URL1      = 'https://itunes.apple.com/search?term=' + query +'&country=us&limit=50&entity=' + category;
    var URL2 = "https://randomuser.me/api/";
    this.scoreSearch(URL1)
    this.profileSearch(URL2)
  }
 
  showScoreResults(response){

    function shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
      }
      return a.slice(0, 5);
    }

    this.setState({
        scoreResults: shuffle(response.results)
    })
  }
  showProfileResults(response){
    this.setState({
        profileResults: response.results
    })
  }

  scoreSearch(URL){
    $.ajax({
        type: "GET",
        dataType: 'jsonp',
        url: URL,
        success: function(response){
            this.showScoreResults(response);
        }.bind(this)
    });
  }
  profileSearch(URL){
    $.ajax({
        type: "GET",
        dataType: 'jsonp',
        url: URL,
        success: function(response){
            this.showProfileResults(response);
        }.bind(this)
    });
  }

  handleToast(tab) {
    setTimeout(() => {
      toast("Happy to see you again "+localStorage.getItem('nickname')+"!");
    }, 3500);
  }

  render(){

      return(
        this.state.profileResults.length > 0 ?
          <div className="container">
            <div className="row">
              <ProfileResults profileResults={this.state.profileResults}  />
              <ChangingProgressbar percentages={this.state.random} />
              <ScoreResults scoreResults={this.state.scoreResults} />
              <ToastContainer position={'top-center'} hideProgressBar={true} toastClassName={'toaster'} autoClose={false} closeButton={<ToastCloseButton YouCanPassAnyProps="foo" />} />
              <BottomNav history={this.props.history} logged={true} />
            </div>
          </div>  
        :
          <div className="container">
            <div className="row text-center">Loading...</div>
            <BottomNav history={this.props.history} logged={true} />
          </div>
      )

  }

}

export class ProfileResults extends Component {
  render(){
      var resultItems = this.props.profileResults.map(function(result, index) {
          return <ProfileResultItem key={index} picture={result.picture.large} firstName={result.name.first} lastName={result.name.last} />
      });
      return resultItems;
  }
};

export class ProfileResultItem extends Component {
  

  constructor(props){
    super(props);
    this.state = {
      randomCal: null,
      randomSte: null
    };
  }

  componentDidMount(){
    this.setState({
      randomCal: this.min + Math.floor((Math.random() * (this.max - this.min))),
      randomSte: this.min + Math.floor((Math.random() * (this.max - this.min))*10),
    });
  }

  min = 10;
  max = 1000;

    render(){
        return (
          <div className="col-xs-12 col-sm-6 col-sm-offset-3">
            <div className="row profile text-center">
              <img src={this.props.picture} alt="" className="img-circle" />
              <h3>{this.props.firstName} {this.props.lastName}</h3>
             
                <div className="col-xs-6 calories">
                  <div className="row">
                    
                    <div className="col-xs-4">
                      <svg width="17px" height="24px" viewBox="0 0 17 24" xmlns="http://www.w3.org/2000/svg" style={{position: 'relative', left: '5px'}}>
                          <g id="STEP2" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                              <g id="User-Dashboard" transform="translate(-56.000000, -178.000000)" fill="#a1197d">
                                  <g id="icon_calories" transform="translate(56.000000, 178.000000)">
                                      <path d="M8.34125764,0 C8.52825764,1.515 8.91425764,2.977 8.92925764,4.542 C8.94725764,6.387 8.72625764,8.293 8.09725764,10.024 C7.80225764,10.836 7.39125764,12.228 6.31925764,12.228 C6.30825764,12.228 6.29725764,12.228 6.28625764,12.228 C4.72625764,12.187 5.20125764,9.498 5.20125764,8.487 C2.12125764,9.891 -0.0837423621,13.615 0.766257638,17.732 C1.40325764,20.818 3.81625764,23.272 6.78125764,23.857 C7.28025764,23.956 7.78725764,24.003 8.29525764,24.003 C10.9282576,24.003 13.5602576,22.711 15.0612576,20.491 C17.2072576,17.315 16.4682576,12.515 15.1662576,9.164 C13.9782576,6.105 11.9112576,3.791 9.76925764,1.436 C9.31225764,0.933 8.72825764,0.575 8.34125764,0 M10.9052576,5.813 C11.8672576,7.054 12.7172576,8.385 13.3022576,9.888 C14.3982576,12.709 15.0832576,16.886 13.4032576,19.371 C12.3062576,20.995 10.3482576,22.003 8.29525764,22.003 C7.91225764,22.003 7.53325764,21.967 7.16825764,21.895 C4.98525764,21.464 3.19925764,19.629 2.72525764,17.328 C2.33925764,15.46 2.75425764,13.778 3.57625764,12.49 C3.71025764,12.769 3.88125764,13.033 4.10025764,13.272 C4.64425764,13.866 5.40225764,14.205 6.23425764,14.227 L6.29325764,14.228 L6.31925764,14.228 C8.72625764,14.228 9.56025764,11.88 9.91625764,10.877 L9.97725764,10.707 C10.5072576,9.248 10.8182576,7.606 10.9052576,5.813"></path>
                                  </g>
                              </g>
                          </g>
                      </svg>
                    </div>

                    <div className="col-xs-8 pull-right">
                      <h4 className="title text-right">CALORIES</h4>
                      <h4 className="value text-right">
                      <CountUp
                        className="account-balance"
                        start={0}
                        end={this.state.randomCal}
                        duration={1.5}
                        useEasing={true}
                        useGrouping={true}
                        separator=" "
                        decimals={0}
                        decimal=","
                      />
                      </h4>
                    </div>
                  </div>

                </div>
       
                <div className="col-xs-6 steps">
                  <div className="row">
                    <div className="col-xs-8 pull-left">
                      <h4 className="title text-left">STEPS</h4>
                      <h4 className="value text-left">
                      <CountUp
                        start={0}
                        end={this.state.randomSte}
                        duration={1.5}
                        useEasing={true}
                        useGrouping={true}
                        separator=""
                        decimals={0}
                      />
                      </h4>
                    </div>

                    <div className="col-xs-4">
                      <svg width="24px" height="23px" viewBox="0 0 24 23" xmlns="http://www.w3.org/2000/svg" style={{position: 'relative', right: '5px'}}>
                          <defs>
                              <polygon id="path-1" points="12.00025 0 24 0 24 23 12.00025 23 0.0005 23 0.0005 0"></polygon>
                          </defs>
                          <g id="STEP2" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                              <g id="User-Dashboard" transform="translate(-289.000000, -181.000000)">
                                  <g id="icon_steps" transform="translate(289.000000, 181.000000)">
                                      <g>
                                          <mask id="mask-2" fill="white">
                                              <use xlinkHref="#path-1"></use>
                                          </mask>
                                          <g id="Clip-2"></g>
                                          <path d="M22.0005,0 L15.9995,0 C14.8955,0 14.0005,0.896 14.0005,2 L14.0005,7 L9.0005,7 C7.8965,7 7.0005,7.896 7.0005,9.001 L7.0005,14 L1.9995,14 C0.8955,14 0.0005,14.896 0.0005,16 L0.0005,21 C0.0005,22.104 0.8955,23 1.9995,23 L22.0005,23 C23.1045,23 24.0005,22.104 24.0005,21 L24.0005,2 C24.0005,0.896 23.1045,0 22.0005,0 M22.0005,2 L22.0005,2 L22.0005,21 L2.0005,21 L1.9995,16 L7.0005,16 L9.0005,16 L9.0005,14 L9.0005,9 L14.0005,9 L16.0005,9 L16.0005,7 L15.9995,2 L22.0005,2" id="Fill-1" fill="#a1197d" mask="url(#mask-2)"></path>
                                      </g>
                                  </g>
                              </g>
                          </g>
                      </svg>
                    </div>

                  </div>

                </div>

              
            </div>  
          </div> 
        );
    }
};

export class ScoreResults extends Component {
  render(){
      var resultItems = this.props.scoreResults.map(function(result, index) {
          return <ScoreResultItem key={index} trackName={result.trackName} index={index+1} />
      });
      return(
          <div className="col-xs-12 fullwidth">
            <ul className="scoreResults">
                {resultItems}
            </ul>
          </div>        
      );
  }
};
export class ScoreResultItem extends Component {
    render(){
        return (
          <li><span className="badge">{this.props.index}</span> {this.props.trackName}</li>
        );
    }
};



