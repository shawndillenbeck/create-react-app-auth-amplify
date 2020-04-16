import React, { Component } from 'react';
import './App.css';
import OAuthButton from './OAuthButton';
import Amplify, { Auth, Hub, Cache  } from 'aws-amplify';
import awsconfig from './aws-exports'; // your Amplify configuration

// your Cognito Hosted UI configuration
const oauth = {
  domain: 'pr-landing-page.auth.us-west-2.amazoncognito.com',
  scope: ['email',  'openid'],
  redirectSignIn: 'https://master.d33pteq2oqztkg.amplifyapp.com/index.html',
  
  responseType: 'token' // or 'token', note that REFRESH token will only be generated when the responseType is code
};

Amplify.configure(awsconfig);
Auth.configure({ oauth });

//Auth.configure({
//  oauth: oauth,
//  region: 'us-west-2',
//  userPoolId: 'us-west-2_cognitocf0c6096_userpool_cf0c6096-devc',
//  userPoolWebClientId: '4mbferift1eu845umvfe5el88q'
//});

class App extends Component {
  constructor(props) {
    super(props);
    this.signOut = this.signOut.bind(this);
    // let the Hub module listen on Auth events
    Hub.listen('auth', (data) => {
      console.log(`Data: ${JSON.stringify(data)}`);
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
    
    Hub.listen('authorize', (data) => {
      console.log(`Data: ${JSON.stringify(data)}`);
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
//    Auth.federatedSignIn().then(credentials => {
//          console.log('credentials', credentials);
//          console.log('Cache',Cache.getItem('federatedInfo'));
//           this.setState({authState: 'signedIn'});
 //       }).catch(e => {
 //         this.setState({authState: 'signIn'});
          
  //        console.log(e);
  //        throw e;
   // });
    
    // check the current user when the App component is loaded
    Auth.currentAuthenticatedUser().then(user => {
      console.log(user);
      this.setState({authState: 'signedIn'});
    }).catch(e => {
      console.log(e);
      this.setState({authState: 'signIn'});
    });
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
