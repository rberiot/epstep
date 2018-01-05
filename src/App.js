import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import VisibilitySensor from 'react-visibility-sensor';

import QrReader from 'react-qr-reader';

import $ from 'jquery'; 

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

import {Tabs, Tab} from 'material-ui/Tabs';

import CircularProgressbar from 'react-circular-progressbar';
import CountUp from 'react-countup';

import { ToastContainer, toast } from 'react-toastify';

import { BarChart } from 'react-easy-chart';
import ContainerDimensions from 'react-container-dimensions'

import Confetti from 'react-dom-confetti';

import './App.css';
import './Loader.css';


import {IconUserTab, QrcodeTab, IconRankTab, IconCalories, IconSteps, Atomium, Montain, MontEuropa, Placeholder, IconUserEdit, IconStats, Star} from './SVGicon';

import SVGInline from "react-svg-inline"
import icon_rank from './icon_rank.svg'

import logo from './logo.png';
import '../node_modules/material-components-web/dist/material-components-web.css';


/* for correct path after build */
const baseUrl = process.env.PUBLIC_URL;

//const wsbaseurl = "http://localhost:8000";
let wsbaseurl = "https://90dadbd1.ngrok.io";

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


const toastId = null;
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
              icon={<IconUserTab />}
              /* label="User" */
              value='/Login'
              data-route="/Login"
              onActive={(event) => this.handleActive(event)}
              className={this.state.activeTabIndex === '/Login' ? "tab active" : "tab"}
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
              icon={<IconRankTab />}
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
      message: 'SCAN A QR CODE',
      delay: 1000,
      result: 'No result',
      qrcode_in: null,
      qrcode_out: null,
      loading: false
    }
    
    localStorage.removeItem('qrcode_in')
    this.handleScan = this.handleScan.bind(this);
  }

  handleScan(data){
   
    if(data){
      this.setState({
        result: data,
        message: 'NOW, PLEASE TAKE THE STAIRS...',
        loading: true
      })

      if(localStorage.getItem('qrcode_in') !== null){

        this.setState({
            qrcode_in: localStorage.getItem('qrcode_in'),
            qrcode_out: getAllUrlParams(this.state.result).qr_id_2,
            loading: false
        })

        alert(this.state.qrcode_in +' / '+ this.state.qrcode_out)

        $.ajax({
            url: wsbaseurl+'/distance',
            type: "GET",
            dataType: 'json',
            data: { qr_id_1: this.state.qrcode_in, qr_id_2: this.state.qrcode_out },
            success: function(data){
              if (data && data.status === "OK") {
                alert(data.distance);
              }
            }.bind(this),
            complete: function(){
              this.setState({
                  message: 'THANK YOU, CHECK YOUR STATS !'
              })
              localStorage.removeItem('qrcode_in')
            }.bind(this),
            error: function(xhr, ajaxOptions, thrownError) {
              alert(thrownError);      
            }
        });
        

      } else{
 
        this.setState({
            qrcode_in: getAllUrlParams(this.state.result).qr_id_1
        })
        localStorage.setItem('qrcode_in', this.state.qrcode_in)
      }
      

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
          <h3 className="overallTitle">{this.state.message}</h3>
          
          {this.state.loading &&
          <div className="overallLoader">
            <div className="loader">
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
      next_level_access: false,
    };
  }

  componentDidMount(){
    setTimeout(() => {
      this.setState({next_level_access: true});
    }, 5000);
  }

  render() {

    const confetti_config = {
      angle: 90,
      spread: 40,
      startVelocity: 25,
      elementCount: 60,
      decay: 0.93
    };

    let challenge_icon = null;
    let challenge_icon_location = null;
    let challenge_star = null;

    if (this.props.challenge_name === "Atomium") {
      challenge_icon = <Atomium />
      challenge_icon_location = <small>Brussels, Belgium</small>
    } else if (this.props.challenge_name === "MONT EUROPA") {
      challenge_icon = <MontEuropa />
      challenge_icon_location = <small>Brussels, Belgium</small>
    } else {
      challenge_icon = <Montain />;
      challenge_icon_location = <small>Alpes, France</small>
    }

    if (this.props.total_meters <= 1000) {
      challenge_star = <Star />
    } else if (this.props.total_meters <= 2000){
      challenge_star = <div><Star /><Star /></div>
    } else if (this.props.total_meters <= 3000){
      challenge_star = <div><Star /><Star /><Star /></div>
    } else if (this.props.total_meters <= 4000){
      challenge_star = <div><Star /><Star /><Star /><Star /></div>
    } else if (this.props.total_meters <= 5000){
      challenge_star = <div><Star /><Star /><Star /><Star /><Star /></div>
    }
    
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

          <div style={{ width: '100%', padding: '17%', marginBottom: '30%' }} className="text-center progress_ctn" >

            <div className="challenge_title">
              <h4 className="value uppercase">{this.props.challenge_name}</h4>
              {challenge_icon_location}
            </div>

            <div className="challenge_icon">
              {challenge_icon}
            </div>

            {challenge_star}

            <div className="challenge_meters">
              <h4 className="value">{this.props.total_meters}m</h4>
            </div>

            <Confetti active={ this.state.next_level_access } config={ confetti_config } />

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
      random: null,
      scoreResults: [],
      profileResults: [],
      avatar: null,
      profileLoaded: false
    };

  }

  min = 1;
  max = 100;

  componentDidMount(){
    this.setState({random: this.min + Math.floor((Math.random() * (this.max - this.min))), profileResults: false});
    this.handleToast();
    var query    = "Hallyday";
    var category = "song";
    //var URL1      = 'https://itunes.apple.com/search?term=' + query +'&country=us&limit=50&entity=' + category;
    var URL1 = 'https://randomuser.me/api/?inc=name&results=50';
    this.scoreSearch(URL1)
    //var URL2 = "https://randomuser.me/api/";
    //this.profileSearch(URL2)
    this.getStatsData()
  }
 
  showScoreResults(response){
    function shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
      }
      return a.slice(0, 10);
    }
    this.setState({
        scoreResults: shuffle(response.results)
    })
  }

  // showProfileResults(response){
  //   alert(response)
  //   this.setState({
  //       profileResults: response.results
  //   })
  // }

  showStatsResults(response){
    this.setState({
        profileResults: response
    })
  }

  getStatsData() {
    $.ajax({
      url: wsbaseurl+'/profile',
      dataType : 'json',
      data: { email: null, token: null },
      type: "GET",
      cache: false, 
      success: function (data) {
        if (data && data.status === "OK") {

          this.setState({
              challenge_name: data.current_challenge.name,
              current_percent: data.current_challenge.current_percent,
              nick_name: data.nick_name,
              total_calories: data.total_calories,
              total_steps: data.total_steps,
              total_meters: data.total_meters
          })

          //this.showStatsResults(basicObj);
        }
        this.setState({
          avatar: "https://randomuser.me/api/portraits/men/"+Math.floor((Math.random() * (this.max - this.min)))+".jpg",
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
  // profileSearch(URL){
  //   $.ajax({
  //       type: "GET",
  //       dataType: 'jsonp',
  //       url: URL,
  //       success: function(response){
  //           this.showProfileResults(response);
  //       }.bind(this)
  //   });
  // }

  handleToast(tab) {
    setTimeout(() => {
      if (! toast.isActive(this.toastId)) {
        this.toastId = toast("Happy to see you again "+localStorage.getItem('nickname')+"!");
      }
    }, 3500);
  }

  render(){
    //alert(this.state.imageStatus)
    return(
      this.state.profileLoaded ?
        <div className="container">
          <div className="row">
            <ProfileResult nick_name={this.state.nick_name} total_calories={this.state.total_calories} total_steps={this.state.total_steps} total_meters={this.state.total_meters} avatar={this.state.avatar} />
            <ChangingProgressbar percentages={this.state.current_percent*100} challenge_name={this.state.challenge_name} total_meters={this.state.total_meters} />
            <Graph />
            <ScoreResults scoreResults={this.state.scoreResults} />
            <ToastContainer position={'top-center'} hideProgressBar={true} toastClassName={'helloToast'} autoClose={false} closeButton={<ToastCloseButton YouCanPassAnyProps="foo" />} />
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
    )
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

          <img src={this.state.avatar} alt=""  className="img-circle" />

          <h3>{this.state.nick_name}</h3>
         
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
  render(){
      var resultItems = this.props.scoreResults.map(function(result, index) {
          return <ScoreResultItem key={index.toString()} nickname={result.name.first} index={index+1} />
      });
      return(
          <div className="wallOfFame">

            <div className="col-xs-6 sepa"></div>
            <div className="col-xs-6"></div>

            <div className="col-xs-12 text-center">
              <SVGInline svg={ icon_rank } style={{marginLeft: '-3px'}} />
            </div>

            <div className="col-xs-12">
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
      wof_meters: null,
      wof_stars: null
    };
  }

  componentDidMount(){
    let wof_value = Math.floor(Math.random() * 5000)
    this.setState({
      wof_meters: wof_value,
      wof_stars: Math.floor(wof_value/1000)
    });
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
          <span className="total_meters">{this.state.wof_meters}</span>
        </li>
      );
  }
};



export class History extends React.Component {

  constructor(props){
    super(props);
    this.state = {

    };
  }

  render(){

      return(

          <div className="col-xs-12 history">

            <div className="col-xs-6 sepa"></div>
            <div className="col-xs-6"></div>

            <div className="col-xs-12 text-center">
              <SVGInline svg={ icon_rank } style={{marginLeft: '-3px'}} />
            </div>


            <h4>History</h4>

            <ContainerDimensions> 
            { ({ width, height }) => 

            <BarChart
              
              axes={(this.state.componentWidth) > 400 ? true : true}
              yAxisOrientRight
              yTickNumber={5}
              colorBars
              grid
              width={width - 20}
              height={width / 1.7 }
              barWidth={30}

              xType={'time'}
              xDomainRange={['18-Dec-17', '26-Dec-17']}
              yDomainRange={[50, 500]}
              data={[
                { x: '18-Dec-17', y: 200, color: '#a1197d' },
                { x: '19-Dec-17', y: 160, color: '#f5e8f2' },
                { x: '20-Dec-17', y: 350, color: '#a1197d' }
              ]}
            />
            }
            </ContainerDimensions> 

          </div>        
      );
  }
};


function getRandomInt(min, max) {  
  return Math.floor(Math.random() * (max - min)) + min;
}

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
      //data: [],
      series: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
      labels: ['Day steps', 'Maximum weekly steps'],
      colors: ['#A1197D', '#F5E8F1']
    });
  }

  populateArray(){
    var data = [[72], [215], [142], [49], [0]],
        series = 5

    // for (var i = series; i--; ) {
    //   var tmp = [];
    //   tmp.push(getRandomInt(0, 300));
    //   data.push(tmp);     
    // }
    this.setState({ data: data });
    
  }

  onChange(isVisible) {
    console.log('Element is now %s', isVisible ? 'visible' : 'hidden');

    if(isVisible){
      this.populateArray();
    }
   
  };

  render() {
    return (

      

      <div className="col-xs-12 history">

        <div className="col-xs-6 sepa"></div>
        <div className="col-xs-6"></div>

        <div className="col-xs-12 text-center">
          <IconStats />
        </div>

        <div className="col-xs-12">
          <h4>History</h4>
          <section>
    
            <VisibilitySensor
              delayedCall={true}
              partialVisibility='bottom'
              offset={{bottom:150}}
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

    //alert(this.props.data)

    var self = this,
      data = this.props.data,
      layered = this.props.grouping === 'layered' ? true : false,
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




