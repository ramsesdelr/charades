import React from 'react';
import { usersService } from '../services/users.service.js';
import { Link } from 'react-router-dom';


class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        usersService.logOut();
        this.state = {
            email: '',
            name: '',
            password: '',
            phone: '',
            error: [],
            loading: false,
            password_v: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.registerUser = this.registerUser.bind(this);
    }

    componentDidMount() {
        let user = JSON.parse(localStorage.getItem('user'));
        if(user && user.token) {
            this.props.history.push('/home/');
        }
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    registerUser(e) {
        e.preventDefault();
        const { email, password, phone, name, password_v} = this.state;
        if (!(email && password && phone && name)) {
            this.setState({ error: <div className="alert alert-danger">Please fill the required fields</div> });
            return;
        }

        if (password != password_v) {
            this.setState({error: <div className="alert alert-danger">Passwords does not match</div>});
            return;
        }

        this.setState({ loading: true });
        const user_data = {
            email: email,
            password: password,
            name: name,
            phone: phone,
            match_id: this.props.match.params.match_id || '', 
        };
        usersService.register(user_data).then(
            response => {
                if (response.status == 200 && response.data.token) {
                    const { from } = this.props.location.state || { from: { pathname: "/" } };
                    if(user_data.match_id != '') {
                        let match_id = atob(user_data.match_id);
                        window.location.replace(`/current_match/${match_id}`)
                    } else {
                        window.location.replace('/home');
                    }
                } else {
                    let all_errors = [];
                    for (const key in response.data.errors) {
                        all_errors.push(<div className={'alert alert-danger'} key={key}>{response.data.errors[key]}</div>);
                    }
                    this.setState({ error: all_errors });
                }
                this.setState({ loading: false });

            }
        );
    }
    render() {
        const { email, password, loading, error, phone, name, password_v } = this.state;
        return (
                <section className="row justify-content-center">
                    <div className="card-container">
                        <div className="register">
                            <div className="mt-3 mb-3 text-center">
                                <img src="/svg/charades-logo.svg" className="logo-top"></img>
                            </div>
                            <h1 className="text-center title--main">Create Account</h1>
                                <h4 className="text-center title--sub">All fields are required</h4>
                                <div className="register--container">
                                    {error &&
                                        <div>{error}</div>
                                    }
                            <form onSubmit={this.registerUser}>
                                <div className="input-group form-group">
                                    <label className="register--label">Email</label>
                                    <input
                                        className="form-control register-input"
                                        type="text"
                                        name="email"
                                        placeholder="sample@email.com"
                                        value={email}
                                        onChange={this.handleChange}
                                    />
                                </div>

                                <div className="input-group form-group">
                                    <label className="register--label">Full Name</label>
                                    <input
                                        className="form-control register-input"
                                        type="text"
                                        name="name"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={this.handleChange}
                                    />
                                </div>
                        
                                <div className="input-group form-group">
                                    <label className="register--label">Phone Number</label>
                                    <input
                                        className="form-control register-input"
                                        type="phone"
                                        name="phone"
                                        placeholder="305-000-0000"
                                        value={phone}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className="input-group form-group">
                                    <label className="register--label">Password</label>
                                    <input
                                        className="form-control register-input"
                                        type="password"
                                        name="password"
                                        placeholder="Type password"
                                        value={password}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className="input-group form-group">
                                    <label className="register--label">Confirm Password</label>
                                    <input
                                        className="form-control register-input"
                                        type="password"
                                        name="password_v"
                                        placeholder="Confirm password"
                                        value={password_v}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <button disabled={loading} className="btn register--button"> Register</button>
                                <hr></hr>
                                <div className="text-center">
                                    Already have an account?
                                    <Link to="/" className="white-label">Go to Login</Link>
                                </div>

                                {loading &&
                                    <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                }
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default RegisterForm;
