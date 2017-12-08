import React, { Component } from "react";
import { Redirect } from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

/* https://medium.com/technoetics/create-basic-login-forms-using-create-react-app-module-in-reactjs-511b9790dede */



class Login extends Component {
  constructor(props){
      super(props);
      this.state={
      username:'',
      password:''
    }
  }

  handleClick(event){

    alert(this.state.username +" / "+ this.state.password);
    
    const { history } = this.props;

    this.setState({ error: false });
    if (!(this.state.username === 'jer' && this.state.password === 'fer')) {
      return this.setState({ error: true });
    }

    //store.set('loggedIn', true);
    history.push('/App');

    /*
     var apiBaseUrl = "http://localhost:4000/api/";
     var self = this;
     var payload={
     "email":this.state.username,
     "password":this.state.password
     }
     axios.post(apiBaseUrl+'login', payload)
     .then(function (response) {
     console.log(response);
     if(response.data.code == 200){
     console.log("Login successfull");
     var uploadScreen=[];
     uploadScreen.push(<UploadScreen appContext={self.props.appContext}/>)
     self.props.appContext.setState({loginPage:[],uploadScreen:uploadScreen})
     }
     else if(response.data.code == 204){
     console.log("Username password do not match");
     alert("username password do not match")
     }
     else{
     console.log("Username does not exists");
     alert("Username does not exist");
     }
     })
     .catch(function (error) {
     console.log(error);
     });
     */
  }


  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
           <TextField
             hintText="Enter your Username"
             floatingLabelText="Username"
             onChange = {(event,newValue) => this.setState({username:newValue})}
             />
           <br/>
             <TextField
               type="password"
               hintText="Enter your Password"
               floatingLabelText="Password"
               onChange = {(event,newValue) => this.setState({password:newValue})}
               />
             <br/>
             <RaisedButton label="Submit" style={style} label="Login" backgroundColor="#8C2875" labelColor="#fff" onClick={(event) => this.handleClick(event)}/>
         </div>
         </MuiThemeProvider>
      </div>
    );
  }
}
const style = {
 width: '100%'
};
export default Login;