import React from 'react';
import { matchesService } from '../../services/matches.service'
import { connect } from 'react-redux';


class NewMatch extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            match_name: '',
            match_password: '',
            error: '',
            loading: false,
            user:{},
        };

        this.handleChange = this.handleChange.bind(this);
        this.createMatch = this.createMatch.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({[name]: value });
    }

    createMatch(e){
        e.preventDefault();
        const { match_name, match_password = null } = this.state;
        let match_data = {
            name: match_name,
            password: match_password,
            users_id: this.props.user.id,
        };
        console.log(this.state);
        matchesService.createMatch(match_data).then(
            response => {

                console.log(response);
                if(response.status == 200) {

                } else {
                } 
                this.setState({ loading: false });
            }
        );
    }

    render() {
        const {loading } = this.state;
        return (
            <div className="match-box col-12 mt-4">
                <div className="card">
                    <h1 className="text-center" id="login-title">New Match</h1>
                    {loading && 
                        <div>Creating...</div>
                    }
                    <form onSubmit={this.createMatch}>
                        <div className="card-body">
                            <div className="input-group form-group">
                                <input type="text" name="match_name" onChange={this.handleChange} className="form-control text-center" placeholder="Match Name" />
                            </div>
                            <div className="input-group form-group">
                                <input type="password" name="match_password" onChange={this.handleChange} className="form-control text-center" placeholder="Match Password" />
                            </div>
                            <div className="button-container">
                                <button className="btn btn-new-match" type="submit">Host</button>
                            </div>   
                        </div>
                    </form>
                </div>

            </div>

        );
    }
}

const mapStateToProps = state => (
	{
	  user: state.user,
	}
);

export default connect(mapStateToProps, undefined)(NewMatch);
