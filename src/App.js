import React, { Component } from 'react';
import './App.css';
import OAuthButton from './OAuthButton';
import Amplify, { Auth, Hub } from 'aws-amplify';
import awsconfig from './aws-exports'; // your Amplify configuration

// your Cognito Hosted UI configuration
const oauth = {
  domain: 'pr-landing-page.auth.us-west-2.amazoncognito.com',
  scope: ['email',  'openid'],
  
  
  responseType: 'token' // or 'token', note that REFRESH token will only be generated when the responseType is code
};

Amplify.configure(awsconfig);
//Auth.configure({ oauth });

class App extends Component {
  constructor(props) {
    super(props);
    this.signOut = this.signOut.bind(this);
    // let the Hub module listen on Auth events
    Hub.listen('auth', (data) => {
        switch (data.payload.event) {
            case 'signIn':
                this.setState({authState: 'signedIn', authData: data.payload.data});
                break;
            case 'signIn_failure':
                this.setState({authState: 'signIn', authData: null, authError: data.payload.data});
                break;
            default:
                break;
        }
    });
    this.state = {
      authState: 'loading',
      authData: null,
      authError: null
    }
  }

  componentDidMount() {
    console.log('on component mount');
    Auth.federatedSignIn().then(credentials => {
          console.log('credentials', credentials);
           this.setState({authState: 'signedIn'});
        }).catch(e => {
          this.setState({authState: 'signIn'});
          
          console.log(e);
          throw e;
    });
    
    // check the current user when the App component is loaded
   // Auth.currentAuthenticatedUser().then(user => {
   //   console.log(user);
    //  this.setState({authState: 'signedIn'});
   // }).catch(e => {
   //   console.log(e);
   //   this.setState({authState: 'signIn'});
   // });
  }

  signOut() {
    Auth.signOut().then(() => {
      this.setState({authState: 'signIn'});
    }).catch(e => {
      console.log(e);
    });
  }

  render() {
    const { authState } = this.state;
    return (
      <div className="App">
        {authState === 'loading' && (<div>loading...</div>)}
        {authState === 'signIn' && <OAuthButton/>}
        {authState === 'signedIn' && <button onClick={this.signOut}>Sign out</button>}
      </div>
    );
  }
}

export default App;
