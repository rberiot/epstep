import React, { Component } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import PropTypes from 'prop-types';
import {
  withRouter
} from 'react-router-dom';
import Cookies from 'universal-cookie';
import QrReader from 'react-qr-reader';
import $ from 'jquery'; 
import MobileDetect from 'mobile-detect';
import Swiper from 'swiper';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import CircularProgressbar from 'react-circular-progressbar';
import CountUp from 'react-countup';
import { toast } from 'react-toastify';
import Confetti from 'react-dom-confetti';
import Webcam from 'react-webcam';
import { ValidatorForm } from 'react-form-validator-core';
import { TextValidator} from 'react-material-ui-form-validator';
import './Loader.css';
import 'swiper/dist/css/swiper.min.css';
import {IconRank, IconUser, Share, QrcodeTour, EditPlaceholder, EditPen, IconUserEdit, UserPicturePlaceholder, IconUserTab, QrcodeTab, IconRankTab, IconCalories, IconSteps, Atomium, Montain, IconStats, Star, Medal, Logo, Climber} from './SVGicon';
import '../node_modules/material-components-web/dist/material-components-web.css';
import './App.css';

const cookies = new Cookies();

/* for correct path after build */
const baseUrl = process.env.PUBLIC_URL;

//const wsbaseurl = "http://localhost:8000";
//let wsbaseurl = "https://a2780b8b.ngrok.io/app";
let wsbaseurl = "/app";

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


const ToastCloseButton = ({ closeToast }) => (
  <span className="closeToastButton" onClick={closeToast}>X</span>
)

export class NavLockedMsg extends Component {

  handleClickCancel = () => {
    toast.dismiss(this.toastId);
  }; 

  handleClickUnlock = () => {
    let fromPath = this.props.path
    navLocked = false;
    toast.dismiss(this.toastId);
    setTimeout(() => {
      this.props.history.push(fromPath);
    }, 500)
  }; 

  render() {
    return (
      <div>
        <h2>Are you sure?</h2>
        <p>If you change tab now, your current scanning will be lost</p>
        <button onClick={this.handleClickCancel}>Cancel</button>
        <button onClick={this.handleClickUnlock}>Change anyway</button>
      </div>
    );
  }
}



export class AlreadyValid extends Component {

  dismiss = () => {
    toast.dismiss(this.toastId);
    window.history.pushState({}, document.title, "/" + "#/Stats");
  }; 

  render() {
    return (
      <div>
        <div className="content">
          <h2>Hello, {cookies.get('nickname')}</h2>
          <p>Your token is already valid</p>
        </div>
        <button onClick={this.dismiss}>OK</button>
      </div>
    )
  }
}

export class TourMsg extends Component {

  componentDidMount() {
    let mySwiper = new Swiper('.swiper-container', {init:false, loop:false, spaceBetween:40, autoHeight:false, grabCursor:true, pagination: {el: '.swiper-pagination', clickable:true} });
    mySwiper.init()
  }

  dismiss = () => {
    toast.dismiss(this.toastId);
    //localStorage.setItem('acceptTour', 'true');
    cookies.set('acceptTour', 'true', { path: '/', expires: new Date(2030, 0, 1)});
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
                    <p>You will find QR codes next to the entrances of the staircases.<br /><br />
                    Before entering the staircase, scan your first QR code by clicking the QR code symbol in the middle of the toolbar.<br /><br />
                    Scan the exit QR code when leaving the staircase and the total amount of stairs you took will be automatically added to your total!</p>
                  </div>

                  <div className="swiper-slide">  
                    <div className="head">
                      <IconRank />
                      <h3 className="title">SECOND STEP</h3>
                      <h4 className="subtitle">Check your stats and share your results!</h4>
                    </div>     
                    <p>Check your ranking in the "Walk of Fame" by clicking the stats symbol on the left of the toolbar.<br /><br />
                    Setup a stair climbing challenge with your colleagues by clicking "Share my results" on the top left of the screen!<br /><br />
                    Your colleague(s) will receive an email challenging them to participate.</p>
                  </div>

                  <div className="swiper-slide">  
                    <div className="head"> 
                      <IconUser /> 
                      <h3 className="title">THIRD STEP</h3>
                      <h4 className="subtitle">Edit your profile</h4>
                    </div>     
                    <p>Add your picture to your profile or edit your nickname.<br /><br />
                    Make the EP climbing challenge more personal and more fun by adding your profile picture! Just click the person icon on the right of the toolbar and choose “Edit my account” on the top right of the screen. <br /><br />Click the grey logo to add your picture!</p>
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
      cookies.remove("email", { path: '/' });
      cookies.remove("loggedIn", { path: '/' });
      cookies.remove("loggedInServer", { path: '/' });
      cookies.remove("nickname", { path: '/' });
      cookies.remove("token", { path: '/' });
      cookies.remove("acceptCookie", { path: '/' });
      cookies.remove("acceptTour", { path: '/' });
      cookies.remove("timeout", { path: '/' });
      cookies.remove("firstVisit", { path: '/' });
      localStorage.removeItem("avatarImg64");

      window.location.reload();
    }

    handleShareResults() {
      var page = window.location.protocol+"//"+window.location.hostname;
      var email = "";
      var subject = "Invitation to join a stair challenge on EPStairs";
      var body = `Hey! \r\n\r\n I've just setup a mini stair climbing challenge with EPStairs. \r\n Join me and let's compare our results. \r\n\r\n ${page}`;
      window.location.href = "mailto:"+email+"?Subject=" + subject + "&body=" + encodeURIComponent(body);
    }

    render() {
      const { location, history } = this.props
        return (
          //localStorage.getItem('loggedIn') === 'true' ?
          cookies.get('loggedIn') === 'true' ?
          
          <div className="container account">
            <div className="row">
              <div className="col-xs-6 sepa">
                <div onClick={this.handleShareResults} className="pointer">
                  <Share />
                  <span>Share my results</span>
                </div>
              </div>
              <div className="col-xs-6 text-right">
                {location.pathname === '/Edit' ? (
                  
                  <div onClick={() => history.push('/Stats')} className="pointer">
                    <span>Back to my profile </span>
                    <IconUser />
                  </div>
                  
                ):(
                  <div onClick={() => history.push('/Edit')} className="pointer">
                    <span>Edit my account </span>
                    <IconUserEdit />
                  </div>
                )}
              </div>
            </div>
          </div>
          :
          <p>You're not logged</p>
        )
    }
}

const TopBar = withRouter(Topbar);
let navLocked = false;

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
    if(!navLocked){
      this.setState({
        activeTabIndex: value,
      });
    }
  };
    
  handleActive(tab) {
    //check if nav is locked between scans
    if(navLocked){
      if (! toast.isActive(this.toastId)) {
        this.toastId = toast(<NavLockedMsg history={this.props.history} path={tab.props['data-route']} />, {className:'confirmToast'});
      }
      return
    }

    var route = tab.props['data-route'];
    this.setState({
        activeTabIndex: tab.props['value']
    })
    setTimeout(() => {
      this.props.history.push(route);
    }, 150)
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
              className={this.state.activeTabIndex === '/Scan' ? "tab active" : "tab"}
            />

            <Tab
              icon={<IconUserTab />}
              /* label="User" */
              value='/Stats'
              data-route="/Stats"
              onActive={(event) => this.handleActive(event)}
              className={this.state.activeTabIndex === '/Stats' || this.state.activeTabIndex === '/' ? "tab active" : "tab"}
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
    //cookies.remove('qrcode_in', { path: '/' });

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

    if(localStorage.getItem('qrcode_in') == null || new Date().getTime() > cookies.get('timeout')){
      localStorage.setItem('qrcode_in', scan_qr)
      cookies.set('timeout', new Date().getTime() + 5*60*1000, { path: '/', expires: new Date(2030, 0, 1)});
      this.setState({
          message: 'PLEASE TAKE THE STAIRS AND SCAN THE EXIT QR CODE...',
          loading: true
      })
      navLocked = true;
    } else {
      $.ajax({
          url: wsbaseurl+'/distance',
          type: "GET",
          //data: { qr_id_1: localStorage.getItem('qrcode_in'), qr_id_2: scan_qr },
          //data: { qr_id_1: cookies.get('qrcode_in'), qr_id_2: scan_qr },
          data: { qr_id_1: localStorage.getItem('qrcode_in'), qr_id_2: scan_qr },
          success: function(data){
            if (data && data.status === "OK") {

              if (data.distance === "STAIRWELL_MISSMATCH"){
                this.setState({
                  message: 'Please scan QR code from the same stairwell',
                  scansComplete: true,
                  loading: false
                })
                return;
              }

              if ("vibrate" in navigator) {
                window.navigator.vibrate([100,50]);
              }
              
              this.setState({
                message: 'DISTANCE CALCULATION',
                distance: data.distance,
                loading: false
              })

              localStorage.setItem('lastDistance', data.distance);

              //cookies.remove('qrcode_in', { path: '/' });
              localStorage.removeItem('qrcode_in');

              if(cookies.get('firstVisit') === undefined || cookies.get('firstVisit') === "true"){
                cookies.set('firstVisit', 'false', { path: '/', expires: new Date(2030, 0, 1)});
              }

              $.ajax({
                  url: wsbaseurl+'/log_distance',
                  type: "GET",
                  data: { steps: this.state.distance, token: cookies.get('token') },
                  success: function(data){
                    //console.log(data.status);
                    if (data && data.status === "OK") {

                      navLocked = false;

                      this.setState({
                        message: 'THANK YOU, LOOK AT YOUR STATS !',
                        scansComplete: true
                        //result: true
                      })
                      setTimeout(() => {
                        this.props.history.push('/Stats');
                      }, 800);

                    }

                  }.bind(this),
                  error: function(xhr, ajaxOptions, thrownError) {
                   
                    const errorMsg = <div><h2>Oops...</h2><p>Error message: {xhr.status} ({thrownError})</p><p>Please try later</p></div>;
                    if (! toast.isActive(this.toastId)) {
                      this.toastId = toast(errorMsg, {closeButton: <ToastCloseButton />, className:'errorToast'});
                    }
                    this.setState({
                        message: errorMsg,
                        loading: false
                    }) 
                  }.bind(this)
              });

            }
          }.bind(this),
          error: function(xhr, ajaxOptions, thrownError) {
            const errorMsg = <div><h2>Oops...</h2><p>Error message: {xhr.status} ({thrownError})</p><p>Please try later</p></div>;
            if (! toast.isActive(this.toastId)) {
              this.toastId = toast(errorMsg, {closeButton: <ToastCloseButton />, className:'errorToast'});
            }
            this.setState({
                message: errorMsg,
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
      //message: err,
      loading: false,
      camera: 'inactive'
    })
    
    const errorMsg = <div><h2>Oops...</h2><p>Please be sure you're connected over https and activate your camera</p></div>;
    if (! toast.isActive(this.toastId)) {
      this.toastId = toast(errorMsg, {closeButton: <ToastCloseButton />, className:'errorToast'});
    }

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

  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }


  componentDidMount(){
    const search = this.props.location.search; // could be '?foo=bar'
    // fallback for edge 17- (URLSearchParams is undefined)
    if (typeof URLSearchParams !== undefined){
      const params = new URLSearchParams(search);
      const qr_id = params.get('qr_id');
      this.handleScan(qr_id, true)
    } else {
      console.log(`Your browser ${navigator.appVersion} does not support URLSearchParams so we trying fallback...`);
      const qr_id = this.getParameterByName('qr_id')
      this.handleScan(qr_id, true)
    }

    
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
          <BottomNav history={this.props.history} logged={true} />
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
      showStars: null,
      currentPercentageIndex: 0,
      current_steps: 0,
      prestige: 0,

      start_count: 0,
      end_count: 0,
    };
  }

  componentWillMount(){

    this.setState({
      start_count: this.props.percentages[0] || 0,
      end_count: this.props.percentages[1],
      current_steps: this.props.current_steps,
      prestige: this.props.prestige
    });

    setTimeout(() => {
      this.setState({
        currentPercentageIndex: (this.state.currentPercentageIndex + 1) % this.props.percentages.length
      });
    }, 100);

    //localStorage.setItem('previous_percentage', this.props.percentages[1]);
    cookies.set('previous_percentage', this.props.percentages[1], { path: '/', expires: new Date(2030, 0, 1)});

    //this.handleConfetti();
    //this.handleToast();
  }

  handleConfetti() {
    console.log('show confetti')
    setTimeout(() => {
      this.setState({showConfetti: true});
      //this.setState({showStars: true});
    }, 200);
  }

  handleToast = () => {
    setTimeout(() => {
      if (! toast.isActive(this.toastId)) {
        this.toastId = toast("Happy to see you again "+cookies.get('nickname')+"!");
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
      console.log(`Completed! 👏 --PRESTIGE:${this.state.prestige} --previous percentage:${this.props.percentages[0]} / ${this.props.prev_percent} --current percentage:${this.props.percentages[1]}`);
      if(this.state.prestige > 0 && (this.props.percentages[1] < this.props.prev_percent)){
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
              start={this.state.start_count}
              end={this.state.end_count}
              duration={1.2}
              useEasing={true}
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
                    start={this.state.start_count*10}
                    end={this.state.current_steps}
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
      total_steps: null,
      //previous_percent: localStorage.getItem('previous_percentage'),
      previous_percent: cookies.get('previous_percentage'),
      current_percent: null,
      scoreResults: [],
      scoreResultsAllTime: [],
      avatar: null,
      current_steps: 0,
      weekly_stats: null,
      profileLoaded: false,
      scoreResultsLoaded: false,
      scoreResultsAllTimeLoaded: false
    };

    this.getStatsData();

  }

  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  componentWillMount(props){
    const search = this.props.location.search;
    // fallback for edge 17- (URLSearchParams is undefined)
    if (typeof URLSearchParams !== undefined){
      const params = new URLSearchParams(search);
      let alreadyValid = params.get('alreadyvalid');
      if(alreadyValid == 'true'){
        this.handleToast4alreadyValid();
      }
    } else {
      console.log(`Your browser ${navigator.appVersion} does not support URLSearchParams so we trying fallback...`);
      let alreadyValid = this.getParameterByName('alreadyvalid')
      if(alreadyValid == 'true'){
        this.handleToast4alreadyValid();
      }
    }
  }

  handleToast4alreadyValid() {
    setTimeout(() => {
      if (!toast.isActive(this.toastId)) {
        this.toastId = toast(<AlreadyValid />, {className:'cookieToast'});
      }
    }, 200);
  }

  getStatsData() {
    $.ajax({
      url: wsbaseurl+'/profile',
      dataType : 'json',
      //data: { email: localStorage.getItem('email'), token: localStorage.getItem('token') },
      data: { token: cookies.get('token') },
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
            current_challenge: data.current_challenge.total_steps,
            profileLoaded: true
          })
          cookies.set('nickname', data.nick_name, { path: '/', expires: new Date(2030, 0, 1)});
        }
        this.setState({
          avatar:<UserPicturePlaceholder />
        });
      }.bind(this),
      complete: function () {
        if(this.state.total_steps !== null && this.state.total_steps > 0){
          this.getMyPositionWeekly();
          this.getMyPositionAlltime();
        } else {
          this.setState({
            challenge_name: null,
            current_percent: '0',
            nick_name: cookies.get('nickname'),
            total_calories: '0',
            total_steps: '0',
            total_meters: null,
            prestige: null,
            weekly_stats: null,
            weekly_total_steps: null,
            avatar:<UserPicturePlaceholder />,
            profileLoaded: true,
            scoreResultsLoaded: true,
            scoreResultsAllTimeLoaded: true,
            current_steps: '0',
            current_challenge: '0'
          })
        }
      }.bind(this),
      error: function(xhr, ajaxOptions, thrownError, data) {
        const errorMsg = <div><h2>Oops...</h2><p>Error message: {xhr.status} ({thrownError})</p></div>;
        if (! toast.isActive(this.toastId)) {
          this.toastId = toast(errorMsg, {closeButton: <ToastCloseButton />, className:'errorToast'});
        }     
      }.bind(this)
    });
  }


  handleToast4tour(tab) {
    setTimeout(() => {
      if (!toast.isActive(this.toastId)) {
        this.toastId = toast(<TourMsg />, {className:'tourToast'});
      }
    }, 200);
  }

  handleGoToWebsite(tab) {
    window.location.href = "https://epstairs.europarl.europa.eu/";
  }


  componentDidMount(){
    if(cookies.get('acceptTour') === undefined || cookies.get('acceptTour') === 'false'){
      this.handleToast4tour();
    }
  }

  getMyPositionWeekly() {
    $.ajax({
      url: wsbaseurl+'/my_ranking_weekly',
      dataType : 'json',
      data: { token: cookies.get('token') },
      type: "GET",
      cache: false, 
      success: function (data) {
        if (data && data.status === "OK") {
          this.setState({
            scoreResults: data.ranking,
            scoreResultsLoaded: true
          })
        }
      }.bind(this),
      error: function(xhr, ajaxOptions, thrownError) {
        const errorMsg = <div><h2>Oops...</h2><p>Error message: {xhr.status} ({thrownError})</p></div>;
        if (! toast.isActive(this.toastId)) {
          this.toastId = toast(errorMsg, {closeButton: <ToastCloseButton />, className:'errorToast'});
        }     
      }.bind(this)
    });
  }

  getMyPositionAlltime() {
    $.ajax({
      url: wsbaseurl+'/my_ranking_all_time',
      dataType : 'json',
      data: { token: cookies.get('token') },
      type: "GET",
      cache: false, 
      success: function (data) {
        if (data && data.status === "OK") {
          this.setState({
            scoreResultsAllTime: data.ranking,
            scoreResultsAllTimeLoaded: true
          })
        }
      }.bind(this),
      error: function(xhr, ajaxOptions, thrownError) {
        const errorMsg = <div><h2>Oops...</h2><p>Error message: {xhr.status} ({thrownError})</p></div>;
        if (! toast.isActive(this.toastId)) {
          this.toastId = toast(errorMsg, {closeButton: <ToastCloseButton />, className:'errorToast'});
        }     
      }.bind(this)
    });
  }

  

  renderProfile(){
    if (this.state.scoreResultsLoaded && this.state.scoreResultsAllTimeLoaded && this.state.profileLoaded){
      return (
        <div>
          <TopBar />
          <div className="container">
            <div className="row">
              <ProfileResult nick_name={this.state.nick_name} total_calories={this.state.total_calories} total_steps={this.state.total_steps} total_meters={this.state.total_meters} avatar={this.state.avatar} />
             
              {this.state.current_percent <= this.state.previous_percent ?
                <ChangingProgressbar history={this.props.history} percentages={[0, this.state.current_percent]} prev_percent={this.state.previous_percent} startFrom0={true} challenge_name={this.state.challenge_name} total_meters={this.state.total_meters} current_steps={this.state.current_steps} current_challenge={this.state.current_challenge} prestige={this.state.prestige} />
              :
                <ChangingProgressbar history={this.props.history} percentages={[this.state.previous_percent, this.state.current_percent]} prev_percent={this.state.previous_percent} startFrom0={false} challenge_name={this.state.challenge_name} total_meters={this.state.total_meters} current_steps={this.state.current_steps} current_challenge={this.state.current_challenge} prestige={this.state.prestige} />
              }
              
              <ScoreResults {...this.props} scoreResults={this.state.scoreResults} scoreResultsAllTime={this.state.scoreResultsAllTime} wallOfFameOnly={false} />

              {this.state.weekly_stats &&
                <Graph data={this.state.weekly_stats} />
              }

              <div className="col-xs-12 text-center howto">

                <div className="col-xs-6 sepa"></div>
                <div className="col-xs-6"></div>

                <div className="col-xs-12 text-center howto">
                  <h3 className="title">Learn more?</h3>
                  <h4 className="subtitle">About the app and the initiative</h4>
                  <div className="small-btn" onClick={() => this.handleToast4tour()}>Get the tour</div><br />
                  <div className="small-btn" onClick={() => this.handleGoToWebsite()}>Go to website</div>
                </div>

              </div>

              <BottomNav history={this.props.history} logged={true} />

            </div>
          </div>
        </div>
      );
    } else {
      return (
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
      );
    }
  }

  render(){
    return(
      <div>
        { this.renderProfile() }
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
    this.getTop10Weekly();
    this.getTop10AllTime();
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
      complete: function () {
        this.setState({
          scoreResultsLoaded: true
        })
      }.bind(this),
      error: function(xhr, ajaxOptions, thrownError) {
        const errorMsg = <div><h2>Oops...</h2><p>Error message: {xhr.status} ({thrownError})</p></div>;
        if (! toast.isActive(this.toastId)) {
          this.toastId = toast(errorMsg, {closeButton: <ToastCloseButton />, className:'errorToast'});
        }     
      }.bind(this)
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
      complete: function () {
        this.setState({
          scoreResultsAllTimeLoaded: true
        })
      }.bind(this)
    });
  }


  render() {
    return (
      this.state.scoreResultsLoaded && this.state.scoreResultsAllTimeLoaded ?
      <div>
        <TopBar />
        <div className="container">
          <div className="row">
            
            <TopTen {...this.props} scoreResults={this.state.scoreResults} scoreResultsAllTime={this.state.scoreResultsAllTime} wallOfFameOnly={true} />

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
      nick_name: this.props.nick_name,
      total_calories: null,
      total_steps: null,
      last_calories: null,
      last_steps: null,
      total_meters: null,
      avatar: null
    };
    
  }

  componentDidMount(){

    let last_distance = localStorage.getItem('lastDistance');
    let last_calories = Math.floor(last_distance*0.17);

    if (last_distance !== null){
      this.setState({
        total_calories: Math.floor(this.props.total_calories - last_calories),
        total_steps: this.props.total_steps - last_distance,
        total_meters: this.props.total_meters,
        avatar: this.props.avatar,
        last_calories: last_calories,
        last_steps: last_distance
      });
    } else {
      this.setState({
        total_calories: Math.floor(this.props.total_calories),
        total_steps: this.props.total_steps,
        total_meters: this.props.total_meters,
        avatar: this.props.avatar
      });
    }

  }

  componentWillUnmount(){
    localStorage.removeItem('lastDistance');
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

          <h3>{this.state.nick_name}</h3>
         
          <div className="col-xs-6 calories">
            <div className="row">
              <div className="col-xs-4">
                <IconCalories />
              </div>
              <div className="col-xs-8 pull-right">
                <h4 className="title text-right">CALORIES</h4>
                <h4 className="value text-right">
                  <span>{this.state.total_calories}</span>
                  {this.state.last_calories &&
                    <CountUp
                      className="last-calories"
                      start={0}
                      end={this.state.last_calories}
                      duration={1.5}
                      useEasing={true}
                      useGrouping={true}
                      prefix="+"
                      separator=""
                      decimals={0}
                      decimal=","
                    />
                  }
                </h4>

              </div>
            </div>
          </div>
   
          <div className="col-xs-6 steps">
            <div className="row">
              <div className="col-xs-8 pull-left">
                <h4 className="title text-left">STAIRS</h4>
                <h4 className="value text-left">
                  <span>{this.state.total_steps}</span>
                  {this.state.last_steps &&
                    <CountUp
                      className="last-steps"
                      start={0}
                      end={this.state.last_steps}
                      duration={1.5}
                      useEasing={true}
                      useGrouping={true}
                      prefix="+"
                      separator=""
                      decimals={0}
                    />
                  }
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
      scoreResults: this.props.scoreResults,
      scoreResultsAllTime: this.props.scoreResultsAllTime,
      wallOfFameSubtitle : 'The one week challenge'
    }

    this.handleTab = this.handleTab.bind(this);
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
                      <span className="total_meters">Stairs</span>
                    </div>
                    <ul className="scoreResults">
                      {resultItems}
                    </ul>
                  </div>
                ):(
                  <div className="col-xs-12 col-sm-6 col-sm-offset-3 center">
                    <div className="marginVerticalTop20">
                      <Climber />
                      <p className="content">Be the first to figure on this weekly top ten</p>
                      <MuiThemeProvider>
                        <RaisedButton type="Button" style={styles.button} label="Scan QR-Code" backgroundColor="#a1197d" labelColor="#fff" onClick={() => history.push('/Scan')} />
                      </MuiThemeProvider>
                    </div>

                  </div>
                )}
              </SwitchTab>
              <SwitchTab title="All time">
                {this.state.scoreResultsAllTime.length > 0 ?(
                  <div>
                    <div className="scoreResultsTitle">
                      <span className="nick_name">Nickname</span>
                      <span className="stars">Prestige</span>
                      <span className="total_meters">Stairs</span>
                    </div>
                    <ul className="scoreResults">
                        {resultItemsAllTime}
                    </ul>
                  </div>
                ):(
                  <div className="col-xs-12 col-sm-6 col-sm-offset-3 center">
                    <div className="marginVerticalTop20">
                      <Climber />
                      <p className="content">Be the first to figure on this all time top ten</p>
                      <MuiThemeProvider>
                        <RaisedButton type="Button" style={styles.button} label="Scan QR-Code" backgroundColor="#a1197d" labelColor="#fff" onClick={() => history.push('/Scan')} />
                      </MuiThemeProvider>
                    </div>
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

    this.handleTab = this.handleTab.bind(this);

  }

  componentDidMount(){
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
        wallOfFameSubtitle : 'My rank'
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
          <h3 className="title">{this.state.wallOfFameSubtitle}</h3>
        </div>


        <div>

          <div className="col-xs-12 fullwidth">
            
            <SwitchTabs className="tabs-wrapper" onChangeTab={this.handleTab}>
              <SwitchTab active="true" title="Weekly" >
                {this.state.scoreResults.length > 0 ?(
                  <div>
                    <div className="scoreResultsTitle">
                      <span className="nick_name">Nickname</span>
                      <span className="stars">Prestige</span>
                      <span className="total_meters">Stairs</span>
                    </div>
                    <ul className="scoreResults">
                      {resultItems}
                    </ul>
                  </div>
                ):(
                  <div className="col-xs-12 col-sm-6 col-sm-offset-3 center">
                    <div className="marginVerticalTop20">
                      <Climber />
                      <p className="content">You're not ranked yet this week,<br /> climb some stairs and come back</p>
                      <MuiThemeProvider>
                        <RaisedButton type="Button" style={styles.button} label="Scan QR-Code" backgroundColor="#a1197d" labelColor="#fff" onClick={() => history.push('/Scan')} />
                      </MuiThemeProvider>
                    </div>
                  </div>
                )}
              </SwitchTab>
              <SwitchTab title="All time">
                {this.state.scoreResultsAllTime.length > 0 ?(
                  <div>
                    <div className="scoreResultsTitle">
                      <span className="nick_name">Nickname</span>
                      <span className="stars">Prestige</span>
                      <span className="total_meters">Stairs</span>
                    </div>
                    <ul className="scoreResults">
                        {resultItemsAllTime}
                    </ul>
                  </div>
                ):(
                  <div className="col-xs-12 col-sm-6 col-sm-offset-3 center">
                    <div className="marginVerticalTop20">
                      <Climber />
                      <p className="content">You're not ranked yet,<br /> climb some stairs and come back</p>
                      <MuiThemeProvider>
                        <RaisedButton type="Button" style={styles.button} label="Scan QR-Code" backgroundColor="#a1197d" labelColor="#fff" onClick={() => history.push('/Scan')} />
                      </MuiThemeProvider>
                    </div>
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
      labels: ['Daily stairs', 'Maximum weekly stairs'],
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
              offset={{bottom:60}}
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

    //console.log(JSON.stringify(this.props.data))

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
        //email: localStorage.getItem("email"),
        //nickname: localStorage.getItem("nickname"),
        email: cookies.get("email"),
        nickname: cookies.get("nickname"),
        showCameraPreview: null,
        avatarImg64: null
      }
      this.handleChange2 = this.handleChange2.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

      this.setRef = this.setRef.bind(this);
      this.capture = this.capture.bind(this);
      this.editPlaceholder = this.editPlaceholder.bind(this);
  }

  componentWillMount(){
    /*
    let self = this;
    
    function getAuth(self, email, token){
      $.ajax({
        url: wsbaseurl+'/auth',
        dataType : 'json',
        data: { email: email, token: token },
        type: "GET",
        cache: false, 
        success: function (data) {
          if (data && data.status === "OK") {
            cookies.set('nickname', data.public_name, { path: '/', expires: new Date(2030, 0, 1)});
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          const errorMsg = <div><h2>Oops...</h2><p>Error message: {xhr.status} ({thrownError})</p></div>;
          if (! toast.isActive(self.toastId)) {
            self.toastId = toast(errorMsg, {closeButton: <ToastCloseButton />, className:'errorToast'});
          }     
        }
      });
    }
    getAuth(self, cookies.get('email'), cookies.get('token'));
    */
  }

  handleContactUs() {
    var email = "epstairs@europarl.europa.eu";
    var subject = "Request from EPStairs ";
    window.location.href = "mailto:"+email+"?Subject=" + subject;
  }

  handleChange2(event) {
    const nickname = event.target.value;
    this.setState({ nickname });
  }

  handleSubmit() {

    let self = this;
    //localStorage.setItem("nickname", this.state.nickname);
    cookies.set('nickname', this.state.nickname, { path: '/', expires: new Date(2030, 0, 1)});

    $.ajax({
      url: wsbaseurl+'/update_profile',
      type: "GET",
      //data: { nickname: this.state.nickname, token: localStorage.getItem('token') },
      data: { nickname: this.state.nickname, token: cookies.get('token') },
      success: function(data){
        if (data && data.status === "OK") {
           //console.log("nickname correctly updated on DB");
           self.props.history.push('/Stats');
        }
      },
      error: function(xhr, ajaxOptions, thrownError) {
        const errorMsg = <div><h2>Oops...</h2><p>Error message: {xhr.status} ({thrownError})</p></div>;
        if (! toast.isActive(self.toastId)) {
          self.toastId = toast(errorMsg, {closeButton: <ToastCloseButton />, className:'errorToast'});
        }     
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
                  <div className="editPlaceholder pointer" onClick={this.editPlaceholder}>
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

            <div className="col-xs-12 col-md-4 col-md-offset-4">
              <p className="default_text text-center nonbold marginVerticalTop20">For any further request, contact us by <span className="bold underline" onClick={this.handleContactUs}>email</span></p>
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


