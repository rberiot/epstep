import React, { Component } from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import {
  HashRouter as Router,
  Route,
  Redirect,
  withRouter
} from 'react-router-dom';

import QrReader from 'react-qr-reader';

import $ from 'jquery'; 

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

import {Tabs, Tab} from 'material-ui/Tabs';

import CircularProgressbar from 'react-circular-progressbar';
import CountUp from 'react-countup';

import { ToastContainer, toast } from 'react-toastify';

import Confetti from 'react-dom-confetti';

import './App.css';
import './Loader.css';

import {UserPicturePlaceholder, IconUserTab, QrcodeTab, IconRankTab, IconCalories, IconSteps, Atomium, Montain, MontEuropa, IconStats, Star, Medal, Logo} from './SVGicon';

import SVGInline from "react-svg-inline"
import icon_rank from './icon_rank.svg'

//import logo from './logo.png';
import '../node_modules/material-components-web/dist/material-components-web.css';


/* for correct path after build */
const baseUrl = process.env.PUBLIC_URL;

//const wsbaseurl = "http://localhost:8000";
let wsbaseurl = "https://1893420d.ngrok.io";
//let wsbaseurl = "";

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
  bgQR: {
    height: 'calc(100vh - 80px)',
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



const ToastCloseButton = ({ closeToast }) => (
  <span onClick={closeToast}>CLOSE</span>
);


export class Header extends Component {
  render() {
    return (
      <div className="text-center">
        {/*<img src={logo} alt="Logo" style={styles.logo}  />*/}
        <Logo />
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
              className={this.state.activeTabIndex === '/Scan' ? "tab active" : "tab"}
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
    let match = props.match;

    this.state = {
      message: 'SCAN A QR CODE',
      delay: 1000,
      qrcode_in: null,
      distance: null,
      timeout: null,
      loading: false,
      result: false,
      orientation: null
    }
    // preserve the initial state in a new object
    this.baseState = this.state;
    
    localStorage.removeItem('qrcode_in');
    this.handleScan = this.handleScan.bind(this);
    this.handleError = this.handleError.bind(this);
    
  }

  componentWillReceiveProps(nextProps){
    this.setState({result: false})
  }


  handleScan(data){

    if(!data)
      return

    var scan_qr = getAllUrlParams(data).qr_id;

    if(scan_qr == localStorage.getItem('qrcode_in'))
      return;

    if(!scan_qr)
      return;

    navigator.vibrate(500);

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

              navigator.vibrate(500);
              
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

                    console.log(data.status);

                    if (data && data.status === "OK") {

                      this.setState({
                        message: 'THANK YOU, CHECK YOUR STATS !',
                        //result: true
                      })
                      setTimeout(() => {
                        this.props.history.push('/Stats');
                      }, 1000)
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
    console.error(err)
    this.setState({
        message: err,
        loading: false
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

    if (window.orientation == 90 || window.orientation == -90) {
      _this.setState({orientation: 'landscape'})
    } else {
      _this.setState({orientation: 'portrait'})
    }
    
    window.addEventListener("orientationchange", function() {
      if (window.orientation == 90 || window.orientation == -90) {
        _this.setState({orientation: 'landscape'})
      } else {
        _this.setState({orientation: 'portrait'})
      }
    });
  
  }


  componentDidMount(){

    const { match } = this.props
    

    if(match.params.qr_id){
      alert(match.params.qr_id)
      localStorage.setItem('qrcode_in', match.params.qr_id)
      //this.handleScan
    }

  }


  render(){

    const previewStyle = {}
    const { match } = this.props

    //alert(match.params.qr_id)


      if (this.state.orientation == 'landscape') {
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
      } else {
    
      if (!this.state.result) {
        return(
          <div className="container">
            <div className="row" style={styles.bgQR}>

            {this.state.loading &&
              <div className="overallLoader">
                <div className="loader_white">
                  <div className="loader__bar"></div>
                  <div className="loader__bar"></div>
                  <div className="loader__bar"></div>
                  <div className="loader__bar"></div>
                  <div className="loader__bar"></div>
                  <div className="loader__ball"></div>
                </div>
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
      percentage: this.props.percentages,
      prestige: this.props.prestige,
    };
  }

  componentDidMount(){
    //this.handleConfetti();
    //this.handleToast();
  }

  handleConfetti() {
    setTimeout(() => {
      this.setState({showConfetti: true});
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

    challenge_star = prestigeConfig()

    const onCountUpComplete = () => {
      console.log('Completed! 👏'+this.state.percentage);
      if(this.state.prestige > 0)
        this.handleConfetti();
    };
    
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
                <div className={"challenge_star "+ (this.state.showConfetti ? 'bounce' : '')}>{challenge_star}</div>
              </div>

            ):(
              <div className="challenge_first">
                <h4 className="value" onClick={() => history.push('/Scan')}>SCAN YOUR FIRST QR CODE</h4>
              </div>
            )}

         

            {this.props.total_meters &&
              <div className="challenge_meters">
                <h4 className="value">{this.props.total_meters}m</h4>
              </div>
            }

            <Confetti active={ this.state.showConfetti } config={ confetti_config } />
            <ToastContainer position={'top-center'} hideProgressBar={true} toastClassName={'helloToast'} autoClose={false} closeButton={<ToastCloseButton />} />


          </div>

        </div>

      </div>

      
      );
  }
}


/* https://fkhadra.github.io/react-toastify/ */
/* https://github.com/glennreyes/react-countup */
export class Stats extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      challenge_name: null,
      total_meters: null,
      current_percent: null,
      scoreResults: [],
      avatar: null,
      profileLoaded: false
    };

  }

  min = 1;
  max = 100;

  componentDidMount(){
    this.setState({profileResults: false});
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
          avatar:<UserPicturePlaceholder />,
          profileLoaded: true
      })
    } else {
      this.getStatsData();
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

          //console.log(data.current_challenge.current_steps)

          this.setState({
              challenge_name: data.current_challenge.name,
              current_percent: data.current_challenge.current_steps/data.current_challenge.total_steps,
              nick_name: data.nick_name,
              total_calories: data.all_time_stats.all_time_cal,
              total_steps: data.all_time_stats.all_time_steps,
              total_meters: Math.floor(data.all_time_stats.all_time_meters),
              prestige: data.current_challenge.prestige,
              weekly_stats: data.weekly_stats
          })

        }
        this.setState({
          //avatar: "https://randomuser.me/api/portraits/men/"+Math.floor((Math.random() * (this.max - this.min)))+".jpg",
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
    //alert(this.state.imageStatus)
    return(
      this.state.profileLoaded ?
        <div className="container">
          <div className="row">
            <ProfileResult nick_name={this.state.nick_name} total_calories={this.state.total_calories} total_steps={this.state.total_steps} total_meters={this.state.total_meters} avatar={this.state.avatar} />
            <ChangingProgressbar history={this.props.history} percentages={this.state.current_percent*100} challenge_name={this.state.challenge_name} total_meters={this.state.total_meters} prestige={this.state.prestige} />
            {this.state.challenge_name &&
              <Graph data={this.state.weekly_stats} />
            }
            <ScoreResults scoreResults={this.state.scoreResults} />
            <BottomNav history={this.props.history} logged={true} />
          </div>
        </div>  
      :
        <div className="container">
          <div className="row text-center">
            <div className="marginVerticalTop40">
              <div className="loader">
                <div className="loader__bar"></div>
                <div className="loader__bar"></div>
                <div className="loader__bar"></div>
                <div className="loader__bar"></div>
                <div className="loader__bar"></div>
                <div className="loader__ball"></div>
              </div>
            </div>
          </div>
          <BottomNav history={this.props.history} logged={true} />
        </div>
    )
  }
}


export class Wall extends Component {

  constructor(props){
    super(props);
    this.state = {
      scoreResults: [],
    };

    this.getTop10();

  }

  getTop10() {
    $.ajax({
      url: wsbaseurl+'/top_ten',
      dataType : 'json',
      type: "GET",
      cache: false, 
      success: function (data) {
        if (data && data.status === "OK") {

          console.log(JSON.stringify(data.top_10));

          this.setState({
              scoreResults: data.top_10,
          })

        }

      }.bind(this),
      complete: function () {

      }.bind(this),
      error: function(xhr, ajaxOptions, thrownError) {
        console.log(thrownError);      
      }
    });
  }


  render() {
    return (
      this.state.scoreResults ?
        <div className="container">
          <div className="row">
            <ScoreResults scoreResults={this.state.scoreResults} wallOfFameOnly={true} />
            <BottomNav history={this.props.history} logged={true} />
          </div>
        </div>  
      :
        <div className="container">
          <div className="row text-center">
            <div className="loader">
              <div className="loader__bar"></div>
              <div className="loader__bar"></div>
              <div className="loader__bar"></div>
              <div className="loader__bar"></div>
              <div className="loader__bar"></div>
              <div className="loader__ball"></div>
            </div>
          </div>
          <BottomNav history={this.props.history} logged={true} />
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

          {/*<h3>{this.state.nick_name}</h3>*/}
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

export class ScoreResults extends Component {

  constructor(props){
    super(props);
    this.state = {
      scoreResults: [],
    };

    this.getTop10()

  }

  componentDidMount(){
    //var URL1 = 'https://randomuser.me/api/?nat=fr&results=20';
    //this.scoreSearch(URL1)
  }

  getTop10() {
    $.ajax({
      url: wsbaseurl+'/top_ten',
      dataType : 'json',
      type: "GET",
      cache: false, 
      success: function (data) {
        if (data && data.status === "OK") {
          console.log(JSON.stringify(data.top_10));
          this.setState({
              scoreResults: data.top_10,
          })
        }

      }.bind(this),
      complete: function () {

      }.bind(this),
      error: function(xhr, ajaxOptions, thrownError) {
        console.log(thrownError);      
      }
    });
  }

  showScoreResults(response){

    function shuffleData(a) {
      for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
      }
      return a.slice(0, 10);
    }

    function sortPostcode(data, key, way) {
      return data.sort(function(a, b) {
          var x = a[key].postcode; var y = b[key].postcode;
          if (way === 'asc' ) { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
          if (way === 'desc') { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
      }).slice(0, 10);
    }


    this.setState({
        scoreResults: sortPostcode(response.results, 'location', 'desc')
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


  render(){

      var resultItems = this.state.scoreResults.map(function(result, index) {
          return <ScoreResultItem key={index.toString()} nickname={result.name} steps={result.total_steps} prestige={result.prestige} index={index+1} />
      });

      return(
          <div className="wallOfFame">
            
            <div className={(this.props.wallOfFameOnly ? 'hidden' : '')}>
              <div className="col-xs-6 sepa"></div>
              <div className="col-xs-6"></div>
            </div>

            <div className="col-xs-12 text-center marginVertical20">
              <SVGInline svg={ icon_rank } style={{marginLeft: '-3px'}} />
            </div>

            <div className="col-xs-12 hidden">
              <h4>Wall of fame</h4>
            </div>
            <div className="col-xs-12 fullwidth">
              <div className="scoreResultsTitle">
                  <span className="nick_name">Nickname</span>
                  <span className="stars">Prestige</span>
                  <span className="total_meters">Steps</span>
              </div>
              <ul className="scoreResults">
                  {resultItems}
              </ul>
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
        <li>
          <span className="badge"><span>{this.props.index}</span></span>
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

        <div className="col-xs-12 text-center marginVertical20">
          <IconStats />
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
      
      <div className={ 'Charts' + (this.props.horizontal ? ' horizontal' : '' ) }>
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




