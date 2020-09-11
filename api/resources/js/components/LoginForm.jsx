import React from 'react';
import { usersService } from '../services/users.service.js';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as UserActions from '../actions/users';
import FacebookLogin from 'react-facebook-login';
class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        let match_id = this.props.match.params.match_id || '';
        this.state = {
            email: '',
            password: '',
            error: '',
            loading: false,
            register_link: `/register/${match_id}`,
        };

        this.handleChange = this.handleChange.bind(this);
        this.loginUser = this.loginUser.bind(this);
        this.loginUserOnFacebook = this.loginUserOnFacebook.bind(this);
    }

    componentDidMount() {
        let user = JSON.parse(localStorage.getItem('user'));
       
        if(user && user.token) {
           this.addUserToMatch(user);
        }
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({[name]: value });
    }

    async addUserToMatch(user) {
        if(this.props.match.params.match_id) {
            let match_id = atob(this.props.match.params.match_id);
            let user_added = await usersService.addUserToMatch(user.user_data.email, match_id);
            if(user_added.data.response.status == 400) {
            }
            window.location.replace(`/current_match/${match_id}`)
        } else {
            this.props.history.push('/home/');
        }
    }

    loginUser(e) {
        e.preventDefault();
        const { email, password } = this.state;
        if (!(email && password)) {
            this.setState({ error: 'Please fill the required fields.' });
            return;
        }

        this.setState({ loading: true });
        let login_data = {
            email: email,
            password: password,
            match_id: this.props.match.params.match_id || ''
        };

        usersService.login(login_data).then(
            response => {
                this.setState({ loading: false });
               
                if(response.status == 200) {
                    const { from } = this.props.location.state || { from: { pathname: "/home" } };
                    this.props.loginUser(response.data.user_data);
                    if(login_data.match_id != '') {
                        let match_id = atob(login_data.match_id);
                        window.location.replace(`/current_match/${match_id}`)
                    } else {
                        window.location.reload()
                    }
                } else {
                	this.setState({error: 'Invalid email/password, please check your info and try again.'});
                }
                
            }
        );
    }

    loginUserOnFacebook(facebook_data) {
        if(facebook_data === undefined) {
            return;
        }
        usersService.loginFacebook(facebook_data).then(
            response => {
                this.setState({ loading: false });
               
                if(response.status == 200) {
                    const { from } = this.props.location.state || { from: { pathname: "/home" } };
                    this.props.loginUser(response.data.user_data);
                    if(this.props.match.params.match_id) {
                        let match_id = atob(this.props.match.params.match_id);
                        window.location.replace(`/current_match/${match_id}`)
                    } else {
                        window.location.reload()
                    }
                } else {
                	this.setState({error: 'Invalid email/password, please check your info and try again.'});
                }
                
            }
        );
    }

    render() {
        const { email, password, loading, error, register_link } = this.state;

        return (
             <section className="card-container">
                    <div className="card">
                        <div className="logo-container mt-3">
							<img src="/images/logo_transparent_background.svg" className="img-fluid"></img>
						</div>
                        <h1 className="text-center" id="login-title">Login</h1>
                        <div className="card-body">
                            {error &&
                                <div className={'alert alert-danger'}>{error}</div>
                            }
                            <form onSubmit={this.loginUser}>
                                <div className="input-group form-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fas fa-user"></i></span>
                                    </div>
                                    <input type="text" name="email" className="form-control" placeholder="email" value={email}
                                        onChange={this.handleChange}/>
                                </div>
                                <div className="input-group form-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fas fa-key"></i></span>
                                    </div>
                                    <input type="password" name="password" value={password}
                                        onChange={this.handleChange}  className="form-control" placeholder="password" />
                                </div>
                            <button disabled={loading} className="btn btn-red full-width mb-4"> Login</button>
                            <Link to='/forgot-password'>Forgot password?</Link>
                            <hr></hr>
                            <p className="text-center">
                                Need an account?
                            </p>
                                <Link to={register_link}>
                                <button disabled={loading} className="btn btn-light full-width"> Create Account</button></Link>

                            {loading &&
                                    <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                            }
                            <FacebookLogin
                                appId="314974593065150"
                                autoLoad={false}
                                fields="name,email,picture"
                                callback={this.loginUserOnFacebook} />
                            </form>
                        </div>
                    </div>
                </section>
        );
    }
}

export default connect(undefined, UserActions)(LoginForm);