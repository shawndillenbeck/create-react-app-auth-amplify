import { withOAuth } from 'aws-amplify-react';
import React, { Component } from 'react';

class OAuthButton extends Component {
  handleClick() {
    // do something meaningful, Promises, if/else, whatever, and then
    window.location.assign('https://pr-landing-page.auth.us-west-2.amazoncognito.com/oauth2/authorize?identity_provider=Okta&redirect_uri=https://master.d33pteq2oqztkg.amplifyapp.com/&response_type=TOKEN&client_id=4mbferift1eu845umvfe5el88q&state=rwi1RTzgj7WcsCvYgDSvaUdOErHxhEHP&scope=email%20openid');
  }
  
  render() {
    return (
      <button onClick={this.handleClick}>
        Sign in with AWS
      </button>
    )
  }
}

export default withOAuth(OAuthButton);
