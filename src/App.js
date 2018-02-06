import React, { Component } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import PropTypes from 'prop-types';
import {
  withRouter
} from 'react-router-dom';
import QrReader from 'react-qr-reader';
import $ from 'jquery'; 
import MobileDetect from 'mobile-detect';
import Swiper from 'swiper';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import CircularProgressbar from 'react-circular-progressbar';
import CountUp from 'react-countup';
import { ToastContainer, toast } from 'react-toastify';
import Confetti from 'react-dom-confetti';
import Webcam from 'react-webcam';
import { ValidatorForm } from 'react-form-validator-core';
import { TextValidator} from 'react-material-ui-form-validator';

import './Loader.css';
import 'swiper/dist/css/swiper.min.css';
import {IconRank, IconUser, Share, QrcodeTour, EditPlaceholder, EditPen, IconUserEdit, Bin, Filter, UserPicturePlaceholder, IconUserTab, QrcodeTab, IconRankTab, IconCalories, IconSteps, Atomium, Montain, MontEuropa, IconStats, Star, Medal, Logo, Climber} from './SVGicon';
//import logo from './logo.png';
import '../node_modules/material-components-web/dist/material-components-web.css';
import './App.css';

/* for correct path after build */
const baseUrl = process.env.PUBLIC_URL;

//const wsbaseurl = "http://localhost:8000";
//let wsbaseurl = "https://a2780b8b.ngrok.io";
let wsbaseurl = "";

const styles = {

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
  loginErrorStyle: {
    color: '#ccc',
  },
  loginUnderlineStyle: {
    borderColor: '#a1197d',
  },
  loginFloatingLabelFocusStyle: {
    color: '#a1197d',
  },
  fullwidth: {
    width: '100%'
  },
  bgQR: {
    height: 'calc(100vh - 48px)',
    backgroundColor: 'rgba(161, 25, 125, 0.7)',
    position: 'relative',
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


function getAllUrlParams(url) {
  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
  // we'll store the parameters here
  var obj = {};
  // if query string exists
  if (queryString) {
    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];
    // split our query string into its component parts
    var arr = queryString.split('&');
    for (var i=0; i<arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');
      // in case params look like: list[]=thing1&list[]=thing2
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1,-1);
        return '';
      });
      // set parameter value (use 'true' if empty)
      var paramValue = typeof(a[1])==='undefined' ? true : a[1];
      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      paramValue = paramValue.toLowerCase();
      // if parameter name already exists
      if (obj[paramName]) {
        // convert value to array (if still string)
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        // if no array index number specified...
        if (typeof paramNum === 'undefined') {
          // put the value on the end of the array
          obj[paramName].push(paramValue);
        }
        // if array index number specified...
        else {
          // put the value at that index number
          obj[paramName][paramNum] = paramValue;
        }
      }
      // if param name doesn't exist yet, set it
      else {
        obj[paramName] = paramValue;
      }
    }
  }
  return obj;
}


const Loader = () => (
  <div className="loader">
    <div className="loader__bar"></div>
    <div className="loader__bar"></div>
    <div className="loader__bar"></div>
    <div className="loader__bar"></div>
    <div className="loader__bar"></div>
    <div className="loader__ball"></div>
  </div>
);

/*
const ToastCloseButton = ({ closeToast }) => (
  <span onClick={closeToast}>CLOSE</span>
)
*/
 
export class TourMsg extends Component {

  componentDidMount() {
    let mySwiper = new Swiper('.swiper-container', {init:false, loop:false, spaceBetween:40, autoHeight:false, grabCursor:true, pagination: {el: '.swiper-pagination', clickable:true} });
    mySwiper.init()
  }

  dismiss = () => {
    toast.dismiss(this.toastId);
    localStorage.setItem('acceptTour', 'true');
  }; 

  render() {

    return (
      <div>
        
        <div className="content">
          <div className="swiper-container">

              <div className="swiper-wrapper">

                  <div className="swiper-slide">  
                    <div className="head"> 
                      <QrcodeTour /> 
                      <h3 className="title">FIRST STEP</h3>
                      <h4 className="subtitle">SCAN A QR CODE</h4>
                    </div>     
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  </div>

                  <div className="swiper-slide">  
                    <div className="head"> 
                      <IconUser /> 
                      <h3 className="title">SECOND STEP</h3>
                      <h4 className="subtitle">CREATE YOUR PROFILE</h4>
                    </div>     
                    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                  </div>

                  <div className="swiper-slide">  
                    <div className="head"> 
                      <IconRank />
                      <h3 className="title">THIRD STEP</h3>
                      <h4 className="subtitle">CHECK YOUR STATS</h4>
                    </div>     
                    <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                  </div>
                  
              </div>

              <div className="swiper-pagination"></div>
           
          </div>

        </div>

        <button onClick={this.dismiss}>Got it</button>
      </div>
    )
  }
}


export class Header extends Component {
  render() {
    return (
      <div className="text-center">
        {/*<img src={logo} alt="Logo" style={styles.logo} />*/}
        <Logo />
      </div>
    );
  }
}


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
      //let self = this;
      
      localStorage.removeItem("email");
      localStorage.removeItem("firstVisit");
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("nickname");
      localStorage.removeItem("token");
      localStorage.removeItem("acceptCookie");
      localStorage.removeItem("avatarImg64");
      localStorage.removeItem("timeout");

      //self.props.history.push('/');
      window.location.reload();
    }

    handleShareResults() {
      var page = window.location.protocol+"//"+window.location.hostname;
      var email = "";
      var subject = "Invitation to join a stair challenge on EPStairs";
      var body = "Hey!"+"\r\n\r\n"+"I've just setup a mini stair climbing challenge with EPStairs."+"\r\n"+"Join me and let's compare our results."+"\r\n\r\n"+page;
      window.location.href = "mailto:"+email+"?Subject=" + subject + "&body=" + encodeURIComponent(body);
    }

    render() {
      const { location, history } = this.props
        return (
          localStorage.getItem('loggedIn') === 'true' ?
            <div className="container account">

              {location.pathname === "/OtherTopBar" ?(
                <div className="row">
                  <div className="col-xs-6 sepa">
                    <div>
                      <span>Hello <strong>{localStorage.getItem('nickname')}</strong> <span className="hidden">@ {location.pathname}</span></span>
                    </div>
                  </div>
                  <div className="col-xs-6 text-right">
                    <div>
                      <span onClick={this.props.action}>All time ranking </span>
                      <Filter />
                    </div>
                  </div>
                </div>

                ):(

                <div className="row">
                  <div className="col-xs-6 sepa">
                    <div>
                      <Share />
                      <span onClick={this.handleShareResults}>Share my results</span>
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

                )}
            </div>
          :
            <p>You're not logged</p>
        )
    }
}

const TopBar = withRouter(Topbar);


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
    }, 200)
  }

  render() {

    return (
      this.props.logged ?
      <footer id="bottomnav">
        <MuiThemeProvider>
          <Tabs value={this.state.activeTabIndex} onChange={this.handleChange} inkBarStyle={{background: '#fff', display: 'none'}} style={styles.tabs} className="tabs">
            
            <Tab
              icon={<IconRankTab />}
              /* label="Wall" */
              value='/Wall'
              data-route="/Wall"
              onActive={(event) => this.handleActive(event)}
              className={this.state.activeTabIndex === '/Wall' ? "tab active" : "tab"}
            />

            <Tab
              icon={<QrcodeTab />}
              /* label="QR Scan" */
              value='/Scan'
              data-route="/Scan"
              onActive={(event) => this.handleActive(event)}
              className={this.state.activeTabIndex === '/Scan' || this.state.activeTabIndex === '/' ? "tab active" : "tab"}
            />

            <Tab
              icon={<IconUserTab />}
              /* label="User" */
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
          
        </div>
      </footer>
    );
  }
}


export class Scan extends React.Component {

  constructor(props){
    super(props)
    //let match = props.match;

    this.state = {
      message: 'SCAN A QR CODE',
      delay: 1000,
      qrcode_in: null,
      distance: null,
      timeout: null,
      loading: false,
      result: false,
      scansComplete: false,
      orientation: null,
      platform: null
    }
    // preserve the initial state in a new object
    //this.baseState = this.state;
    
    localStorage.removeItem('qrcode_in');
    this.handleScan = this.handleScan.bind(this);
    this.handleError = this.handleError.bind(this);
    
  }

  componentWillReceiveProps(nextProps){
    this.setState({result: false})
  }

  handleScan(data, directAccess){

    this.setState({
        camera: 'active'
    })

    var scan_qr;

    if(!data)
      return

    if(!directAccess){
      scan_qr = getAllUrlParams(data).qr_id;
    } else {
      scan_qr = data;
    }

    if(scan_qr === localStorage.getItem('qrcode_in'))
      return;

    if(!scan_qr)
      return;

    if(this.state.scansComplete)
      return;

    if ("vibrate" in navigator) {
      window.navigator.vibrate([100,30]);
    }

    if(localStorage.getItem('qrcode_in') == null || new Date().getTime() > localStorage.getItem('timeout')){
      localStorage.setItem('qrcode_in', scan_qr)
      localStorage.setItem('timeout', new Date().getTime() + 5*60*1000)
      this.setState({
          message: 'PLEASE TAKE THE STAIRS AND SCAN THE EXIT QR CODE...',
          loading: true
      })
    } else {
      $.ajax({
          url: wsbaseurl+'/distance',
          type: "GET",
          data: { qr_id_1: localStorage.getItem('qrcode_in'), qr_id_2: scan_qr },
          success: function(data){
            if (data && data.status === "OK") {

              if ("vibrate" in navigator) {
                window.navigator.vibrate([100,50]);
              }
              
              this.setState({
                message: 'DISTANCE CALCULATION',
                distance: data.distance,
                loading: false
              })

              localStorage.removeItem('qrcode_in');

              if(localStorage.getItem('firstVisit') === 'true'){
                localStorage.setItem('firstVisit', 'false');
              }

              $.ajax({
                  url: wsbaseurl+'/log_distance',
                  type: "GET",
                  data: { steps: this.state.distance, token: localStorage.getItem('token') },
                  success: function(data){
                    //console.log(data.status);
                    if (data && data.status === "OK") {
                      this.setState({
                        message: 'THANK YOU, LOOK AT YOUR STATS !',
                        scansComplete: true
                        //result: true
                      })
                      setTimeout(() => {
                        this.props.history.push('/Stats');
                      }, 700)
                    }

                  }.bind(this),
                  error: function(xhr, ajaxOptions, thrownError) {
                    console.log(thrownError);
                    this.setState({
                        message: xhr.responseText,
                        loading: false
                    })
                  }.bind(this)
              });

            }
          }.bind(this),
          error: function(xhr, ajaxOptions, thrownError) {
            console.log(xhr.responseText);
            this.setState({
                message: xhr.responseText,
                loading: false
            })
          }.bind(this)
      });
    }
  }

  handleError(err){
    console.log(err);
    //this.props.history.push('/Stats');
    this.setState({
        message: err,
        loading: false,
        camera: 'inactive'
    })
  }

  handleCheckStats(event){
    const { history } = this.props;
    history.push(baseUrl + "/Stats");
  }

  /*
  handleScanAgain = () => {
    this.setState(this.baseState)
  }
  */

  componentWillMount(){
    let _this = this;

    //https://github.com/hgoebl/mobile-detect.js/
    let md = new MobileDetect(window.navigator.userAgent);

    if (md.phone() !== null || md.tablet() !== null) {
      _this.setState({platform: 'mobile'})
    } else {
      _this.setState({platform: 'desktop'})
    }

    if (window.orientation === 90 || window.orientation === -90) {
      _this.setState({orientation: 'landscape'})
    } else {
      _this.setState({orientation: 'portrait'})
    }
    
    window.addEventListener("orientationchange", function() {
      if (window.orientation === 90 || window.orientation === -90) {
        _this.setState({orientation: 'landscape'})
      } else {
        _this.setState({orientation: 'portrait'})
      }
    });
  }


  componentDidMount(){
    const search = this.props.location.search; // could be '?foo=bar'
    const params = new URLSearchParams(search);
    const qr_id = params.get('qr_id'); // bar
    this.handleScan(qr_id, true)
  }


  render(){

    const previewStyle = {}
    //const { match } = this.props

    if (this.state.camera === 'inactive') {
      return(
        <div style={{
        position: "fixed",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        backgroundColor: "rgba(161, 25, 125, 1)",
        overflowX: "hidden",
        overflowY: "auto",
        outline: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
        }}>
          <div>
          <h3 style={{color: "#fff", fontSize: "14px", textTransform: "uppercase"}}>Please allow EPStairs to access your camera</h3><br /><br />
          <MuiThemeProvider>
            <RaisedButton label="Scan QR-Code" style={styles.fullwidth} backgroundColor="#fff" labelColor="#a1197d" rippleStyle={styles.button} onClick={(event) => window.location.reload()} />
          </MuiThemeProvider>
          </div>
        </div>
      )
    }


    if (this.state.orientation === 'landscape') {
      return(
        <div style={{
        position: "fixed",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        backgroundColor: "rgba(161, 25, 125, 1)",
        overflowX: "hidden",
        overflowY: "auto",
        outline: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
        }}>
          <h3 style={{color: "#fff", fontSize: "14px", textTransform: "uppercase"}}>Please rotate your device to portrait mode</h3>
        </div>
      )
    } else if (this.state.platform === 'desktop') {
      return(
        <div>
          <div style={{
          position: "fixed",
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
          backgroundColor: "rgba(161, 25, 125, 1)",
          overflowX: "hidden",
          overflowY: "auto",
          outline: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
          }}>
            <h3 style={{color: "#fff", fontSize: "14px", textTransform: "uppercase"}}>Please use a mobile device to scan a QR-Code</h3>
          </div>
          <BottomNav history={this.props.history} logged={true} />
        </div>
      )
    } else {
  
      if (!this.state.result) {
        return(
          <div className="container">
            <div className="row" style={styles.bgQR}>

              {this.state.loading &&
              <div className="overallLoader loader_white">
                <Loader />
              </div>
              }
              <QrReader
                delay={this.state.delay}
                onError={this.handleError}
                onScan={this.handleScan}
                style={previewStyle}
              />
              <h3 className="overallTitle">{this.state.message}</h3>
              <BottomNav history={this.props.history} logged={true} />
            </div>
          </div>
        )
      } else {
        return(
          <div className="container">
            <div className="row ">
              <div className="col-xs-8 col-xs-offset-2 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4" >
                <div className="scan_success">
                  <h4 className="value uppercase">Great !</h4>
                  <Medal />
                  <h5 className="value uppercase">You just walked</h5>
                  <CountUp
                    className="account-balance CircularProgressbar-text"
                    start={0}
                    end={this.state.distance*0.18}
                    duration={2}
                    useEasing={true}
                    useGrouping={true}
                    separator=" "
                    decimals={1}
                    decimal="."
                    suffix="m"
                  />
                </div>
              </div>

              <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
                <div className="marginVertical20">
                  <MuiThemeProvider >
                    <RaisedButton label="Check your stats" style={styles.fullwidth} backgroundColor="#a1197d" labelColor="#fff" rippleStyle={styles.button} onClick={(event) => this.handleCheckStats(event)} />
                  </MuiThemeProvider>
                </div>
              </div>
              <BottomNav history={this.props.history} logged={true} />
            </div>
          </div>
        )
      }
    }
  }
}


/* https://github.com/iqnivek/react-circular-progressbar/tree/c3796f26d82cc5da81714cfec5b2bf9b9ffb4b96 */
class ChangingProgressbar extends Component {

  toastId = null;
 
  constructor(props) {
    super(props);
    this.state = {
      showConfetti: false,
      showStars: false,
      currentPercentageIndex: 0,
      current_steps: this.props.current_steps,
      //percentage: this.props.percentages,
      prestige: this.props.prestige,
    };
  }

  componentDidMount(){
    setTimeout(() => {
      this.setState({
        currentPercentageIndex: (this.state.currentPercentageIndex + 1) % this.props.percentages.length
      });
    }, 100);

    localStorage.setItem('previous_percentage', this.props.percentages[1]);
    //this.handleConfetti();
    //this.handleToast();
  }

  handleConfetti() {
    setTimeout(() => {
      this.setState({showConfetti: true});
      this.setState({showStars: true});
    }, 200);
  }

  handleToast = () => {
    setTimeout(() => {
      if (! toast.isActive(this.toastId)) {
        this.toastId = toast("Happy to see you again "+localStorage.getItem('nickname')+"!");
      }
    }, 3000);
  }

  render() {

    const { history } = this.props;
    const confetti_config = {
      angle: 90,
      spread: 37,
      startVelocity: 30,
      elementCount: 70,
      decay: 0.92
    };

    let challenge_icon = null;
    let challenge_icon_location = null;
    let challenge_name = null;
    let challenge_star = null;

    if (this.props.challenge_name === "Atomium") {
      challenge_icon = <Atomium />
      challenge_icon_location = <small>Brussels, Belgium</small>
    } else if (this.props.challenge_name === "mount_europa") {
      challenge_name = "MOUNT EUROPA"
      challenge_icon = <Montain />
      challenge_icon_location = <small>Brussels, Belgium</small>
    }

    const prestigeConfig = () => {
      let prestige = this.state.prestige;
      var stars = [];
      for (var i = 0; i < prestige; i++) {
          stars.push(<Star key={i}/>);
      } 
      return (<div>{stars}</div>);
    }

    challenge_star = prestigeConfig();

    const onCountUpComplete = () => {
      console.log('Completed! 👏'+'--previous percentage:'+Math.floor(this.props.percentages[0])+'--current percentage:'+Math.floor(this.props.percentages[1]));
      if(this.state.prestige > 0 && (Math.floor(this.props.percentages[1]) < Math.floor(this.props.percentages[0]))){
        this.handleConfetti();
        this.setState({showStars: true});
      } else {
        this.setState({showStars: false});
      }
    };
    
    return (
      <div className="col-xs-8 col-xs-offset-2 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4" >

        <div style={{ position: 'relative', width: '100%', height: '100%'}} className="CircularProgressdata">
          <div style={{ position: 'absolute', width: '100%' }}>
            <CircularProgressbar className="" {...this.props} percentage={this.props.percentages[this.state.currentPercentageIndex]} initialAnimation={this.props.startFrom0} strokeWidth={5} counterClockwise={false} />
            <CountUp
              className="account-balance CircularProgressbar-text"
              start={this.props.percentages[0]}
              end={this.props.percentages[1]}
              duration={1.5}
              useEasing={true}
              useGrouping={false}
              separator=" "
              decimals={this.props.percentages[1] % 1 === 0 ? 0 : 1}
              decimal="."
              suffix="%"
              onComplete={onCountUpComplete}
            />
          </div>

          <div style={{ width: '100%', padding: '17%', marginBottom: '30%' }} className="text-center progress_ctn" >

            <div className="challenge_title">
              <h4 className="value uppercase">{challenge_name}</h4>
              {challenge_icon_location}
            </div>

            {challenge_icon !== null ? (
              <div className={"challenge_icon "+ (this.state.showConfetti ? '' : '')}>
                {challenge_icon}
                <div className={"challenge_star "+ (this.state.showStars ? 'bounce' : '')}>{challenge_star}</div>
              </div>
            ):(
              <div className="challenge_first">
                <h4 className="value" onClick={() => history.push('/Scan')}>SCAN YOUR FIRST QR CODE</h4>
              </div>
            )}
         
            {this.props.total_meters &&
              <div className="challenge_meters">
                <h4 className="value">
                  <CountUp
                    start={this.props.percentages[0]*10}
                    end={this.props.current_steps}
                    duration={1.5}
                    useEasing={true}
                    useGrouping={true}
                    separator=""
                    decimals={0}
                    suffix={"/"+this.props.current_challenge}
                  />
                </h4>
                <h5 className="value">Stairs</h5>
              </div>
            }

            <Confetti active={ this.state.showConfetti } config={ confetti_config } />
            {/*<ToastContainer position={'top-center'} hideProgressBar={true} toastClassName={'helloToast'} autoClose={false} closeButton={<ToastCloseButton />} />*/}

          </div>

        </div>

      </div>

      
      );
  }
}


/* https://fkhadra.github.io/react-toastify/ */
/* https://github.com/glennreyes/react-countup */
export class Stats extends Component {
  
  toastId = null;

  constructor(props){
    super(props);
    this.state = {
      challenge_name: null,
      total_meters: null,
      previous_percent: localStorage.getItem('previous_percentage'),
      current_percent: null,
      scoreResults: [],
      scoreResultsAllTime: [],
      avatar: null,
      profileLoaded: false,
      current_steps: null,
      weekly_stats: null
    };
  }

  handleToast4tour(tab) {
    setTimeout(() => {
      if (!toast.isActive(this.toastId)) {
        this.toastId = toast(<TourMsg />);
      }
    }, 200);
  }

  componentDidMount(){
    this.setState({profileResults: false});

    if(localStorage.getItem('acceptTour') === null || localStorage.getItem('acceptTour') === 'false'){
      this.handleToast4tour();
    }

    if(localStorage.getItem('firstVisit') === null || localStorage.getItem('firstVisit') === 'true'){
      
      this.setState({
          challenge_name: null,
          current_percent: '0',
          //nick_name: data.nick_name,
          total_calories: '0',
          total_steps: '0',
          total_meters: null,
          prestige: null,
          weekly_stats: null,
          weekly_total_steps: null,
          avatar:<UserPicturePlaceholder />,
          profileLoaded: true,
          current_steps: '0',
          current_challenge: '0'

      })
      
      //this.getStatsData();
    } else {
      this.getStatsData();
      //this.handleToast4tour();
    }
  }

  getStatsData() {
    $.ajax({
      url: wsbaseurl+'/profile',
      dataType : 'json',
      data: { email: localStorage.getItem('email'), token: localStorage.getItem('token') },
      type: "GET",
      cache: false,
      success: function (data) {
        if (data && data.status === "OK") {
          this.setState({
            challenge_name: data.current_challenge.name,
            current_percent: (data.current_challenge.current_steps/data.current_challenge.total_steps)*100,
            nick_name: data.nick_name,
            total_calories: data.all_time_stats.all_time_cal,
            total_steps: data.all_time_stats.all_time_steps,
            total_meters: Math.floor(data.all_time_stats.all_time_meters),
            prestige: data.current_challenge.prestige,
            weekly_stats: data.weekly_stats,
            weekly_total_steps: data.weekly_stats.total_steps,
            current_steps: data.current_challenge.current_steps,
            current_challenge: data.current_challenge.total_steps
          })
        }
        this.setState({
          avatar:<UserPicturePlaceholder />
        });
      }.bind(this),
      complete: function () {
        this.setState({
            profileLoaded: true,
        })
      }.bind(this),
      error: function(xhr, ajaxOptions, thrownError) {
        console.log(thrownError);      
      }
    });
  }

  render(){

    return(
      this.state.profileLoaded ?
      <div>
        <TopBar />
        <div className="container">
          <div className="row">
            <ProfileResult nick_name={this.state.nick_name} total_calories={this.state.total_calories} total_steps={this.state.total_steps} total_meters={this.state.total_meters} avatar={this.state.avatar} />
           
            {this.state.current_percent <= this.state.previous_percent ?
              <ChangingProgressbar history={this.props.history} percentages={[0, this.state.current_percent]} startFrom0={false} challenge_name={this.state.challenge_name} total_meters={this.state.total_meters} current_steps={this.state.current_steps} current_challenge={this.state.current_challenge} prestige={this.state.prestige} />
            :
              <ChangingProgressbar history={this.props.history} percentages={[this.state.previous_percent, this.state.current_percent]} startFrom0={false} challenge_name={this.state.challenge_name} total_meters={this.state.total_meters} current_steps={this.state.current_steps} current_challenge={this.state.current_challenge} prestige={this.state.prestige} />
            }
            
            <TopTen wallOfFameOnly={false} />

            {this.state.weekly_stats &&
              <Graph data={this.state.weekly_stats} />
            }

            

            <div className="col-xs-12 text-center howto">

              <div className="col-xs-6 sepa"></div>
              <div className="col-xs-6"></div>

              <div className="col-xs-12 text-center howto">
                <h3 className="title">How it works ?</h3>
                <h4 className="subtitle">Step by step explanation</h4>
                <div className="small-btn" onClick={() => this.handleToast4tour()}s>Get the tour</div>
              </div>
            </div>

            <BottomNav history={this.props.history} logged={true} />
            <ToastContainer position={'top-center'} hideProgressBar={true} toastClassName={'tourToast'} autoClose={false} closeOnClick={false} closeButton={false} />
          </div>
        </div>
      </div>
      :
      <div>
        <TopBar />
        <div className="container">
          <div className="row text-center">
            <div className="marginVerticalTop40">
              <Loader />
            </div>
          </div>
          <BottomNav history={this.props.history} logged={true} />
        </div>
      </div>
    )
  }
}


export class Wall extends Component {

  constructor(props){
    super(props);
    this.state = {
      scoreResults: [],
      scoreResultsAllTime: [],
      scoreResultsLoaded: false,
      scoreResultsAllTimeLoaded: false
    };
  }

  componentWillMount(){
    this.getMyPosition();
    this.getTop10AllTime();
  }

  getMyPosition() {
    $.ajax({
      url: wsbaseurl+'/my_ranking_weekly',
      dataType : 'json',
      data: { token: localStorage.getItem('token') },
      type: "GET",
      cache: false, 
      success: function (data) {
        if (data && data.status === "OK") {
          console.log(JSON.stringify(data.ranking));
          this.setState({
              scoreResults: data.ranking,
              scoreResultsLoaded: true
          })
        }
      }.bind(this),
      complete: function () {},
      error: function(xhr, ajaxOptions, thrownError) {
        console.log(thrownError);      
      }
    });
  }

  getTop10AllTime() {
    $.ajax({
      url: wsbaseurl+'/all_time_top_ten',
      dataType : 'json',
      type: "GET",
      cache: false, 
      success: function (data) {
        if (data && data.status === "OK") {
          //console.log(JSON.stringify(data.top_10));
          this.setState({
              scoreResultsAllTime: data.top_10,
              scoreResultsAllTimeLoaded: true
          })
        }
      }.bind(this),
      complete: function () {},
      error: function(xhr, ajaxOptions, thrownError) {
        console.log(thrownError);      
      }
    });
  }

  render() {
    return (
      this.state.scoreResultsLoaded && this.state.scoreResultsAllTimeLoaded ?
      <div>
        <TopBar />
        <div className="container">
          <div className="row">
            <ScoreResults {...this.props} scoreResults={this.state.scoreResults} scoreResultsAllTime={this.state.scoreResultsAllTime} wallOfFameOnly={true} />
            <BottomNav history={this.props.history} logged={true} />
          </div>
        </div> 
      </div> 
      :
      <div>
        <TopBar />
        <div className="container">
          <div className="row text-center">
            <Loader />
          </div>
          <BottomNav history={this.props.history} logged={true} />
        </div>
      </div>
    );
  }

}


export class ProfileResult extends Component {

  constructor(props){
    super(props);
    this.state = {
      nick_name: null,
      total_calories: null,
      total_steps: null,
      total_meters: null,
      avatar: null
    };
  }

  componentDidMount(){
    this.setState({
      nick_name: this.props.nick_name,
      total_calories: this.props.total_calories,
      total_steps: this.props.total_steps,
      total_meters: this.props.total_meters,
      avatar: this.props.avatar
    });
  }

  render(){
    return (
      <div className="col-xs-12 col-sm-6 col-sm-offset-3">
        <div className="row profile text-center">
          <div>
            {localStorage.getItem("avatarImg64") ?(
              <img src={localStorage.getItem("avatarImg64")} alt="" className="img-circle mirror" />
            ):(
              this.state.avatar
            )}
          </div>

          <h3>{localStorage.getItem('nickname')}</h3>
         
          <div className="col-xs-6 calories">
            <div className="row">
              <div className="col-xs-4">
                <IconCalories />
              </div>
              <div className="col-xs-8 pull-right">
                <h4 className="title text-right">CALORIES</h4>
                <h4 className="value text-right">
                <CountUp
                  className="account-balance"
                  start={0}
                  end={this.state.total_calories}
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
                  end={this.state.total_steps}
                  duration={1.5}
                  useEasing={true}
                  useGrouping={true}
                  separator=""
                  decimals={0}
                />
                </h4>
              </div>
              <div className="col-xs-4">
                <IconSteps />
              </div>
            </div>
          </div>
        </div>  
      </div> 
    );
  }
};

export class TopTen extends Component {

  constructor(props){
    super(props);

    this.state = {
      scoreResults: [],
      scoreResultsAllTime: [],
      wallOfFameSubtitle : 'The one week challenge'
    }
    this.getTop10Weekly();
    this.getTop10AllTime();
    this.handleTab = this.handleTab.bind(this);
  }

  getTop10Weekly() {
    $.ajax({
      url: wsbaseurl+'/top_ten',
      dataType : 'json',
      type: "GET",
      cache: false, 
      success: function (data) {
        if (data && data.status === "OK") {
          //console.log(JSON.stringify(data.top_10));
          this.setState({
            scoreResults: data.top_10,
          })
        }
      }.bind(this),
      complete: function () {},
      error: function(xhr, ajaxOptions, thrownError) {
        console.log(thrownError);      
      }
    });
  }

  getTop10AllTime() {
    $.ajax({
      url: wsbaseurl+'/all_time_top_ten',
      dataType : 'json',
      type: "GET",
      cache: false, 
      success: function (data) {
        if (data && data.status === "OK") {
          //console.log(JSON.stringify(data.top_10));
          this.setState({
            scoreResultsAllTime: data.top_10,
          })
        }
      }.bind(this),
      complete: function () {},
      error: function(xhr, ajaxOptions, thrownError) {
        console.log(thrownError);      
      }
    });
  }
  

  handleTab = (key) => {
    if(key === "0"){
      this.setState({
        wallOfFameSubtitle : 'The one week challenge'
      });
    } else {
      this.setState({
        wallOfFameSubtitle : 'The all time challenge'
      });
    }
  }


  render(){

    const { history } = this.props;

    var resultItems = this.state.scoreResults.map(function(result, index) {
        return <ScoreResultItem key={index.toString()} nickname={result.name} steps={result.total_steps} prestige={result.prestige} index={index+1} />
    });

    var resultItemsAllTime = this.state.scoreResultsAllTime.map(function(result, index) {
        return <ScoreResultItem key={index.toString()} nickname={result.name} steps={result.total_steps} prestige={result.prestige} index={index+1} />
    });

    return(
      <div className="wallOfFame">
        
        <div className={(this.props.wallOfFameOnly ? 'hidden' : '')}>
          <div className="col-xs-6 sepa"></div>
          <div className="col-xs-6"></div>
        </div>

        <div className="col-xs-12 text-center marginVerticalTop20">
          <IconRank />
        </div>

        <div className="col-xs-12">
          <h3 className="title">Walk of fame</h3>
          <h4 className="subtitle">{this.state.wallOfFameSubtitle}</h4>
        </div>

        <div>

          <div className="col-xs-12 fullwidth">
            
            <SwitchTabs className="tabs-wrapper" onChangeTab={this.handleTab}>
              <SwitchTab active="true" title="Week" >
                {this.state.scoreResults.length > 0 ?(
                  <div>
                    <div className="scoreResultsTitle">
                      <span className="nick_name">Nickname</span>
                      <span className="stars">Prestige</span>
                      <span className="total_meters">Steps</span>
                    </div>
                    <ul className="scoreResults">
                      {resultItems}
                    </ul>
                  </div>
                ):(
                  <div className="col-xs-12 col-sm-6 col-sm-offset-3 center marginVerticalTop20">
                    <Climber />
                    <p className="content">Be the first to figure on this weekly top ten</p>
                    <MuiThemeProvider>
                      <RaisedButton type="Button" style={styles.button} label="Scan QR-Code" backgroundColor="#a1197d" labelColor="#fff" onClick={() => history.push('/Scan')} />
                    </MuiThemeProvider>
                  </div>
                )}
              </SwitchTab>
              <SwitchTab title="All time">
                {this.state.scoreResultsAllTime.length > 0 ?(
                  <div>
                    <div className="scoreResultsTitle">
                      <span className="nick_name">Nickname</span>
                      <span className="stars">Prestige</span>
                      <span className="total_meters">Steps</span>
                    </div>
                    <ul className="scoreResults">
                        {resultItemsAllTime}
                    </ul>
                  </div>
                ):(
                  <div className="col-xs-12 col-sm-6 col-sm-offset-3 center marginVerticalTop20">
                    <Climber />
                    <p className="content">Be the first to figure on this all time top ten</p>
                    <MuiThemeProvider>
                      <RaisedButton type="Button" style={styles.button} label="Scan QR-Code" backgroundColor="#a1197d" labelColor="#fff" onClick={() => history.push('/Scan')} />
                    </MuiThemeProvider>
                  </div>
                )}
              </SwitchTab>
            </SwitchTabs>
          </div>
        </div>
      </div>     
    );
  }
};

// with my rank
export class ScoreResults extends Component {

  constructor(props){
    super(props);

    this.state = {
      scoreResults: [],
      scoreResultsAllTime: [],
      wallOfFameSubtitle : 'My rank'
    }

    //this.getMyPosition();
    //this.getTop10AllTime();

    this.handleTab = this.handleTab.bind(this);

  }

  componentWillMount(){
    this.setState({
      scoreResults: this.props.scoreResults,
      scoreResultsAllTime: this.props.scoreResultsAllTime
    });
  }

  handleTab = (key) => {
    if(key === "0"){
      this.setState({
        wallOfFameSubtitle : 'My rank'
      });
    } else {
      this.setState({
        wallOfFameSubtitle : 'Best ranks'
      });
    }
  }

  render(){

    const { history } = this.props;

    var resultItems = this.state.scoreResults.map(function(result, index) {
        return <ScoreResultItem key={index.toString()} nickname={result.name} steps={result.total_steps} prestige={result.prestige} index={index+1} ranking={result.ranking+1} isUser={result.isUser} />
    });

    var resultItemsAllTime = this.state.scoreResultsAllTime.map(function(result, index) {
        return <ScoreResultItem key={index.toString()} nickname={result.name} steps={result.total_steps} prestige={result.prestige} index={index+1} ranking={result.ranking+1} isUser={result.isUser} />
    });

    return(
      <div className="wallOfFame">
        
        <div className={(this.props.wallOfFameOnly ? 'hidden' : '')}>
          <div className="col-xs-6 sepa"></div>
          <div className="col-xs-6"></div>
        </div>

        <div className="col-xs-12 text-center marginVerticalTop20">
          <IconRank />
        </div>

        <div className="col-xs-12">
          <h3 className="title">Walk of fame</h3>
          <h4 className="subtitle">{this.state.wallOfFameSubtitle}</h4>
        </div>


        <div>

          <div className="col-xs-12 fullwidth">
            
            <SwitchTabs className="tabs-wrapper" onChangeTab={this.handleTab}>
              <SwitchTab active="true" title="My rank" >
                {this.state.scoreResults.length > 0 ?(
                  <div>
                    <div className="scoreResultsTitle">
                      <span className="nick_name">Nickname</span>
                      <span className="stars">Prestige</span>
                      <span className="total_meters">Steps</span>
                    </div>
                    <ul className="scoreResults">
                      {resultItems}
                    </ul>
                  </div>
                ):(
                  <div className="col-xs-12 col-sm-6 col-sm-offset-3 center marginVerticalTop20">
                    <Climber />
                    <p className="content">You're not ranked yet, climb some stairs and come back</p>
                    <MuiThemeProvider>
                      <RaisedButton type="Button" style={styles.button} label="Scan QR-Code" backgroundColor="#a1197d" labelColor="#fff" onClick={() => history.push('/Scan')} />
                    </MuiThemeProvider>
                  </div>
                )}
              </SwitchTab>
              <SwitchTab title="Best ranks">
                {this.state.scoreResultsAllTime.length > 0 ?(
                  <div>
                    <div className="scoreResultsTitle">
                      <span className="nick_name">Nickname</span>
                      <span className="stars">Prestige</span>
                      <span className="total_meters">Steps</span>
                    </div>
                    <ul className="scoreResults">
                        {resultItemsAllTime}
                    </ul>
                  </div>
                ):(
                  <div className="col-xs-12 col-sm-6 col-sm-offset-3 center marginVerticalTop20">
                    <Climber />
                    <p className="content">Be the first to figure on this all time top ten</p>
                    <MuiThemeProvider>
                      <RaisedButton type="Button" style={styles.button} label="Scan QR-Code" backgroundColor="#a1197d" labelColor="#fff" onClick={() => history.push('/Scan')} />
                    </MuiThemeProvider>
                  </div>
                )}
              </SwitchTab>
            </SwitchTabs>
          </div>
        </div>
      </div>     
    );
  }
};

export class ScoreResultItem extends Component {

  constructor(props){
    super(props);
    this.state = {
      wof_stars: this.props.prestige
    };
  }

  getStars(){
    var stars=[];
    for(var i=0;i<this.state.wof_stars;i++ ){
      stars.push(<Star key={i} />);
    }
    return stars;
  }

  render(){
    return (
      <li className={ this.props.isUser ? 'current_user' : ''}>
        <span className="badge"><span>{this.props.ranking ? this.props.ranking : this.props.index}</span></span>
        <span className="nick_name">{this.props.nickname}</span>
        <span className="stars">{this.getStars()}</span>
        <span className="total_meters">{this.props.steps}</span>
      </li>
    );
  }
};




function compareNumbers(a, b) {  
  return a - b;
}

/* https://codepen.io/maydie/pen/WvpzPG */
export class Graph extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      data: [],
      series: [],
      labels: [],
      colors: []
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount(){
    //setInterval(this.populateArray, 2000);
    this.setState({
      weekly_stats: this.props.data,
      series: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
      labels: ['Daily steps', 'Maximum weekly steps'],
      colors: ['#A1197D', '#F5E8F1']
    });
  }

  populateArray(){
    var data = [[this.state.weekly_stats.monday], 
                [this.state.weekly_stats.tuesday], 
                [this.state.weekly_stats.wednesday], 
                [this.state.weekly_stats.thursday], 
                [this.state.weekly_stats.friday]]
    this.setState({ data: data });
  }

  onChange(isVisible) {
    //console.log('Element is now %s', isVisible ? 'visible' : 'hidden');
    if(isVisible){
      this.populateArray();
    }
  };

  render() {
    return (

      <div className="col-xs-12 history">

        <div className="col-xs-6 sepa"></div>
        <div className="col-xs-6"></div>

        <div className="col-xs-12 text-center marginVerticalTop20">
          <IconStats />
        </div>

        <div className="col-xs-12">
          <h3 className="title">Historical graph</h3>
          <h4 className="subtitle">Your weekly performance</h4>
        </div>

        <div className="col-xs-12 hidden">
          <h4>History</h4>
        </div>

        <div className="col-xs-12">
          <section>
    
            <VisibilitySensor
              delayedCall={true}
              partialVisibility='bottom'
              offset={{bottom:70}}
              onChange={this.onChange}
            >

              <Charts
                data={ this.state.data }
                labels={ this.state.series }
                colors={ this.state.colors }
                height={ 150 }
                opaque={ true }
              />
            
            </VisibilitySensor>
          
            <Legend labels={ this.state.labels } colors={ this.state.colors } />

          </section>
        </div>
      </div>
      
    );
  }
};


class Legend extends React.Component {

  render() {
    var labels = this.props.labels,
      colors = this.props.colors;

    return (
      <div className="Legend">
        { labels.map(function(label, labelIndex) {
          return (
          <div key={labelIndex}>
            <span className="Legend--color" style={{ backgroundColor: colors[labelIndex % colors.length]  }} />
            <span className="Legend--label">{ label }</span>
          </div>
          );
        }) }
      </div>
    );
  }
};

class Charts extends React.Component { 

  render() {


    var self = this,
      data = this.props.data,
      //layered = this.props.grouping === 'layered' ? true : false,
      stacked = this.props.grouping === 'stacked' ? true : false,
      opaque = this.props.opaque,
      max = 0;

    for (var i = data.length; i--; ) {
      for (var j = data[i].length; j--; ) {
        if (data[i][j] > max) {
          max = data[i][j];
        }
      }
    }


    return (
      
      <div className={ 'Charts' + (this.props.horizontal ? 'horizontal' : '' ) }>
        { data.map(function (serie, serieIndex) {
          var sortedSerie = serie.slice(0),
            sum;

          sum = serie.reduce(function (carry, current) {
            return carry + current;
          }, 0);
          sortedSerie.sort(compareNumbers);           

          return (
            <div className={ 'Charts--serie ' + (self.props.grouping) }
              key={ serieIndex }
              style={{ height: self.props.height ? self.props.height: 'auto' }}
            >
            <label>{ self.props.labels[serieIndex] }</label>
            { serie.map(function (item, itemIndex) {

              var color = self.props.colors[itemIndex], 
                style,
                size = item / (stacked ? sum : max) * 100;

              style = {
                backgroundColor: color,
                opacity: opaque ? 1 : (item/max + .05)
              };

              if (self.props.horizontal) {
                style['width'] = size + '%';
              } else {                
                style['height'] = size + '%';           
              }




              return (
               <div
                className={ 'Charts--item ' + (self.props.grouping) }
                style={ style }
                key={ itemIndex }
              >
                <b style={{ color: color }}>{ item }</b>
               </div>
               
            );
            }) }
            </div>
          );
        }) }
      </div>
      
    );
  }
};


export class Edit extends React.Component {

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
        if (data && data.status === "OK") {
           //console.log("nickname correctly updated on DB");
           self.props.history.push('/Stats')
        }
      },
      error: function(xhr, ajaxOptions, thrownError) {
        console.log(thrownError);
      }
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
      <div>
        <TopBar />
        <div className="container">
          <div className="row">
            <div className="col-xs-8 col-xs-offset-2 col-md-4 col-md-offset-4">
         
              <div className="editprofile">

                {this.state.showCameraPreview === 'true' ? (
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
                    validators={['required', 'isEmail', 'matchRegexp:^[a-zA-Z0-9](.?[a-zA-Z0-9]){3,}@europarl.europa.eu|^[a-zA-Z0-9](.?[a-zA-Z0-9]){3,}@ext.europarl.europa.eu|^[a-zA-Z0-9](.?[a-zA-Z0-9]){3,}@ep.europa.eu$']}
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
      </div>
    );
  }
}


class SwitchTabs extends React.Component {
  constructor() {
    super();
    this.state = {
        activeIndex : 0
    };
  }

  handleOnClick(key, event) {
    event.preventDefault();
    this.setState({
        activeIndex : key
    });
    this.props.onChangeTab(key); 
  }

  renderNavItem(key) {
    let tab = this.props.children[key];
    return (
        <li key={ key } className={ this.state.activeIndex == key ? 'active' : ''}>
            <a href="#" onClick={ this.handleOnClick.bind(this, key) }>{ tab.props.title }</a>
        </li>
    );
  }

  render() {
    let index = 0;
    let active = this.state.activeIndex;
    let tabs = React.Children.map(this.props.children, function (child) {
        return React.cloneElement(child, {
            active : child.props.active == true ? true : (active == index++)
        });
    });
    return (
      <div className={ this.props.className }>
          <ul className="switchtabs-nav">
              { Object.keys(this.props.children).map(this.renderNavItem.bind(this)) }
          </ul>
          <div className="switchtabs-content">
              { tabs }
          </div>
      </div>
    )
  }
}

class SwitchTab extends React.Component {
  render() {
    return (
      <div className={ "switchtab-panel" + (this.props.active ? ' active' : '') }>
        { this.props.children }
      </div>
    )
  }
}

SwitchTab.defaultProps = { 
  active : false 
};


