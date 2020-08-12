import React from 'react';
import { usersService } from '../services/users.service.js';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as UserActions from '../actions/users';

class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        let match_id = this.props.match.params.match_id || '';
        this.state = {
            email: '',
            password: '',
            error: '',
            loading: false,
            sucess_message:'',

        };

        this.handleChange = this.handleChange.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
    }

    componentDidMount() {
        let user = JSON.parse(localStorage.getItem('user'));
        if(user && user.token) {
            this.props.history.push('/home/');
        }
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({[name]: value });
    }

    resetPassword(e) {
        e.preventDefault();
        const { email } = this.state;
        if (!email) {
            this.setState({ error: 'Please fill the required fields.' });
            return;
        }

        usersService.resetPassword(email).then(
            response => {
                this.setState({sucess_message:null, error:null});
                if(response.data.status == 200) {
                    this.setState({ loading: false });
                    this.setState({sucess_message: response.data.message});
                } else {
                	this.setState({error: response.data.message});
                }
                
            }
        );
    }

    render() {
        const { email,  loading, error, sucess_message, register_link } = this.state;
        return (
             <div className="card-container">
                    <div className="card">
                        <div className="logo-container mt-5 mb-2">
							<img src="/images/logo_transparent_background.svg" className="img-fluid"></img>
						</div>
                        <h1 className="text-center" id="login-title">Reset your password</h1>
                        <div className="card-body">
                        
                            {sucess_message &&
                                <div className={'alert alert-success'}>{sucess_message}</div>
                            }
                            {error &&
                                <div className={'alert alert-danger'}>{error}</div>
                            }
                            <form onSubmit={this.resetPassword}>
                                <div className="input-group form-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fas fa-user"></i></span>
                                    </div>
                                    <input type="text" name="email" className="form-control" placeholder="email" value={email}
                                        onChange={this.handleChange}/>
                                </div>
                               
                            <button disabled={loading} className="btn btn-red full-width mb-4">Reset Password</button>
                            <hr></hr>
                            <p className="text-center">
                                Already have an account?
                            </p>
                            <Link to='/login'><button  className="btn btn-red full-width">Login</button></Link>
                            
                            <hr></hr>
                            <p className="text-center">
                                Need an account?
                            </p>
                                <Link to='/register'><button disabled={loading} className="btn btn-light full-width"> Create Account</button></Link>

                            {loading &&
                                    <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                            }
                            </form>
                        </div>
                    </div>
                </div>
        );
    }
}

export default connect(undefined, UserActions)(ResetPassword);