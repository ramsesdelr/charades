import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserLayout } from './layouts/UserLayout';

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => {
        const user = localStorage.getItem('user');
        if (!user) {
            // not logged in so redirect to login page with the return url
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }
        // authorised so return component
        return (
                <div>
                    <UserLayout/>
                    <Component {...props} />
                </div>
            );
    }} />
)