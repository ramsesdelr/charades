import React from 'react';
import { usersService } from '../../../services/users.service'
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';


class UpdateSettings extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            users_id: null,
            name: '',
            email: '',
            phone: '',
            password: null,
            password_validate: null,
            loading: false,
            user: {},
            update_success: null,
            update_error: null,
        };

        this.handleChange = this.handleChange.bind(this);
        this.updateUser = this.updateUser.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({[name]: value });
    }

    updateUser(e){
        e.preventDefault();
        this.disableNewWordAlert();
        const { name, email, phone, password, password_validate = null } = this.state;
        let user_data = {
            name: name,
            phone: phone,
            email: email,
            password: password,
            password_validate: password_validate,
            users_id: this.props.user.id,
        };
        usersService.updateUser(user_data).then(
            response => {
                if (response.status == 200) {   
                    this.setState({ update_success: response.message});
                } else {
                    this.setState({ update_error: response.message});
                } 
            }
        );
    }

    disableNewWordAlert() {
        this.setState({update_success: null, update_error: null});
    }

    componentDidMount() {
        this.setState({name: this.props.user.name, email: this.props.user.email, phone: this.props.user.phone});
    }

    render() {
        const {loading, update_success, name, email, phone, update_error } = this.state;
        return (
            <section className="match-box col-12 mt-4">
                <div className="card">
                    <h1 className="text-center mt-4" id="login-title">Update Settings</h1>
                    {loading && 
                        <div>Updating...</div>
                    }
                    <form onSubmit={this.updateUser}>
                        <div className="card-body">
                            <div className="input-group form-group">
                                <input type="text" name="name" value={name} onChange={this.handleChange} className="form-control text-center" placeholder="Full name" />
                            </div>
                            <div className="input-group form-group">
                                <input type="email" name="email" value={email} onChange={this.handleChange} className="form-control text-center" placeholder="E-mail" />
                            </div>
                            <div className="input-group form-group">
                                <input type="phone" name="phone" value={phone} onChange={this.handleChange} className="form-control text-center" placeholder="Phone Number" />
                            </div>
                            <div className="input-group form-group">
                                <input type="password" name="password" onChange={this.handleChange} className="form-control text-center" placeholder="Password" />
                            </div>
                            <div className="input-group form-group">
                                <input type="password" name="password_validate" onChange={this.handleChange} className="form-control text-center" placeholder="Repeat your Password" />
                            </div>
                           
                            <div className="button-container">
                                <button className="btn btn-new-match" type="submit">Update</button>
                            </div> 
                            {update_success != null &&
                            <Alert variant="success"  onClose={() => this.disableNewWordAlert()}  dismissible>
                                {update_success}
                            </Alert> 
                            }
                            {update_error != null &&
                            <Alert variant="warning" onClose={() => this.disableNewWordAlert()}  dismissible>
                                {update_error}
                            </Alert> 
                            }
                        </div>
                    </form>
                </div>
            </section>

        );
    }
}
 
const mapStateToProps = state => (
	{
	  user: state.user,
	}
);

export default connect(mapStateToProps, undefined)(UpdateSettings);
