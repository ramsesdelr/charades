import React from 'react';
import { usersService } from '../services/users.service.js';
import { Link } from 'react-router-dom';


class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        usersService.logout();
        this.state = {
            email: '',
            password: '',
            error: '',
            loading: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.loginUser = this.loginUser.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({[name]: value });
    }

    loginUser(e) {
        e.preventDefault();
        const { email, password } = this.state;
        if (!(email && password)) {
            this.setState({ error: 'Please fill the required fields.' });
            return;
        }

        this.setState({ loading: true });

        usersService.login(email, password).then(
            response => {
                if(response.status == 200) {
                	const { from } = this.props.location.state || { from: { pathname: "/" } };
                	this.props.history.push(from);
                } else {
                	this.setState({error: 'Invalid email/password, please check your info and try again.'});
                } 
                this.setState({ loading: false });

            }
        );
    }
    render() {
        const { email, password, loading, error } = this.state;
        return (
            <div>
	  		 	<div className="container">
                    {error &&
                        <div className={'alert alert-danger'}>{error}</div>
                    }
			        <form onSubmit={this.loginUser}>
                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <input 
                                className="form-control" 
                                type="text"
                                name="email"
                                value={email}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Password</label>
                            <input
                                className="form-control" 
                                type="password" 
                                name="password"
                                value={password}
                                onChange={this.handleChange} 
                            />
                        </div>
			          <button disabled={loading} className="btn btn-primary"> Login</button>
                        <Link to="/register"><button disabled={loading} className="btn btn-primary"> Register</button></Link>
                      

			          {loading &&
                            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                      }

			        </form>
		        </div>
		    </div>
        );
    }
}

export { LoginForm };
