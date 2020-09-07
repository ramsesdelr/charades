import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import UserLayout from './layouts/userLayout';
import { usersService } from '../services/users.service.js';
import { connect } from 'react-redux';
import * as UserActions from '../actions/users';

class AuthenticateToken extends React.Component {

    constructor(props) {
        super(props);

        this.user = JSON.parse(localStorage.getItem('user')) || {};
        
        this.state = {
            loading: false,
            user_exists: null,
        };
        
    }

    async validateToken() {

        this.setState({ loading: true});
        try {
            let result = await usersService.getUser(this.user.token);
            this.setState( { user_exists: result.status == 200 });
            this.props.loginUser(result.data);
            return;
        }
        catch {
            localStorage.removeItem('user');
            this.setState({ user_exists: false });
        }
        finally {
            this.setState({ loading: false});      
        }
        
    }

    componentDidMount() {
        
        if (!this.user.token) {
            this.setState({ user_exists: false});
        } else {
            console.log('validate');
            this.validateToken();
        }
    }

    render() {
        
        const {Component, ...props} = this.props;
        if (this.state.user_exists === false) {
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }

        if(this.state.user_exists === null ) {
            return null;
        }

        if(this.state.loading) {
            return  (
              <div>
                  Loading...
              </div>
            );
        }

        return (
            <div>
                <UserLayout {...props}/>
                <Component {...props} />
            </div>
        )
        
    }

}

const ConnectedAuthenticateToken = connect(undefined, UserActions)(AuthenticateToken); 

const PrivateRoute = ({ component: Component, ...rest} ) => {
    return(
          <div>      
            <Route {...rest} render={(props) => (<ConnectedAuthenticateToken Component={Component} {...props} />) } />
          </div>
    ) 
};

export default PrivateRoute;