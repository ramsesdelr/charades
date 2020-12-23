import React from 'react';
import { usersService } from '../../services/users.service'
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
            profile_img:null,
            update_success: null,
            update_error: null,
        };

        this.handleChange = this.handleChange.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({[name]: value });
    }

    updateUser(e){
        e.preventDefault();
        this.disableNewWordAlert();
        const { name, email, phone, password, password_validate = null, profile_img } = this.state;
        let user_data = {
            name: name,
            phone: phone,
            email: email,
            password: password,
            password_validate: password_validate,
            profile_img: profile_img,
            users_id: this.props.user.id,
        };
        usersService.updateUser(user_data).then(
            response => {
                if (response && response.status == 200) {   
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
        this.setState({name: this.props.user.name, email: this.props.user.email, phone: this.props.user.phone || '', profile_img: this.props.profile_img || null
    });
    }

    onChange(e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length)
              return;
        this.createImage(files[0]);
      }

    createImage(file) {
        let reader = new FileReader();
        reader.onload = (e) => {
            this.setState({
                profile_img: e.target.result
            })
        };
        reader.readAsDataURL(file);
    }

    render() {
        const {loading, update_success, name, email, phone, update_error } = this.state;
        return (
            <div>
                <p className="title--sub-dashboard mb-2 col-12">Looking for some change? Go Ahead!</p>
                	
            <section className="col-12 mt-4 d-flex flex-column align-items-center">
               
                <div className="user-settings-container">
                    <h1 className="title--main text-center mt-4">Update Settings</h1>
                    {loading && 
                        <div>Updating...</div>
                    }
                    <form onSubmit={this.updateUser}>
                        <div className="card-body">
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
                            <div className="form-group">
                                <label htmlFor="exampleFormControlFile1">Profile Image</label>
                                <input type="file" accept='image/jpeg, image/png, image/gif' onChange={this.onChange} />
                            </div>
                                                    
                            <div>
                                <button className="btn login--buton" type="submit">Update</button>
                            </div> 
                           
                        </div>
                    </form>
                </div>
            </section>
            </div>

        );
    }
}
 
const mapStateToProps = state => (
	{
	  user: state.user,
	}
);

export default connect(mapStateToProps, undefined)(UpdateSettings);
