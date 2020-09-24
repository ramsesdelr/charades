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
            redirect_uri: `${process.env.MIX_APP_URL}/login`
        };

        if(match_id != '') {
            localStorage.setItem('match_id', match_id);
        }

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
        let match_id = localStorage.getItem('match_id') || '';
        if(match_id != '') {
            let match_id_decoded = atob(this.props.match.params.match_id);
            let user_added = await usersService.addUserToMatch(user.user_data.email, match_id_decoded);
            window.location.replace(`/current_match/${match_id_decoded}`)
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

        let match_id = localStorage.getItem('match_id') || '';
        let login_data = {
            email: email,
            password: password,
            match_id: match_id
        };

        usersService.login(login_data).then(
            response => {
                this.setState({ loading: false });
               
                if(response.status == 200) {
                    const { from } = this.props.location.state || { from: { pathname: "/home" } };
                    this.props.loginUser(response.data.user_data);
                    if(login_data.match_id != '') {
                        let match_id = atob(login_data.match_id);
                        localStorage.removeItem('match_id');
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
                    let user = this.props.loginUser(response.data.user_data);
                    let match_id = localStorage.getItem('match_id') || '';
                    if(match_id != '') {
                        let match_id_decoded = atob(match_id);
                        let user_added =  usersService.addUserToMatch(user.data.email, match_id_decoded).then( response=> {
                            if(user_added) {
                                localStorage.removeItem('match_id');
                                window.location.replace(`/current_match/${match_id_decoded}`);
                            }
                        });

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
        const { email, password, loading, error, register_link, redirect_uri } = this.state;

        return (
            <section className="row justify-content-center">
                <div className="card-container">
                    <div className="register">
                        <div className="mt-3 mb-3 text-center">
                            <img src="/svg/charades-logo.svg" className="logo-top"></img>
                        </div>
                        <h1 className="text-center title--main--login">Welcome back!</h1>
                        <div className="register--container--login">
                            {error &&
                                <div className={'alert alert-danger'}>{error}</div>
                            }
                            <form onSubmit={this.loginUser}>
                                <div className="input-group form-group">
                                    <label className="register--label">Email</label>

                                    <input type="text" name="email" className="form-control register-input" placeholder="email" value={email} onChange={this.handleChange} />
                                </div>
                                <div className="input-group form-group">
                                    <label className="register--label">Password</label>

                                    <input type="password" name="password" value={password} onChange={this.handleChange} className="form-control register-input" placeholder="password" />
                                </div>
                                <Link to='/forgot-password' className="register--label">Forgot password?</Link>

                                <button disabled={loading} className="btn login--buton"> Login</button>
                                <hr></hr>
                                <p className="text-center ">
                                    Need an account? 
                                    <Link to={register_link} className="login--create-acount text-center d-block">Create an Account</Link>

                                     </p>

                                {loading &&
                                    <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                }
                                <div className="text-center mt-4">
                                    <FacebookLogin
                                        appId="314974593065150"
                                        autoLoad={false}
                                        fields="name,email,picture"
                                        size="medium"
                                        textButton="Facebook Login"
                                        disableMobileRedirect={true}
                                        isMobile={true}
                                        redirectUri={redirect_uri}
                                        callback={this.loginUserOnFacebook} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default connect(undefined, UserActions)(LoginForm);