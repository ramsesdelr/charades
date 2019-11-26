import React from 'react';
import { matchesService } from '../../services/matches.service'
// import { Link } from 'react-router-dom';


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
        const { match_name, match_password } = this.state;
        console.log(this.state);
        matchesService.createMatch(match_name, match_password).then(
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
		const { user } = this.state;
        console.log(user);
        return (
            <div className="match-box col-12 mt-4">
                <div className="card">
                    <h1 className="text-center" id="login-title">New Match</h1>
                    <form onSubmit={this.createMatch}>
                        <div className="card-body">
                            <div className="input-group form-group">
                                <input type="text" name="match_name" onChange={this.handleChange} className="form-control text-center" placeholder="Match Name" />
                            </div>
                            <div className="input-group form-group">
                                <input type="password" name="match_password" onChange={this.handleChange} className="form-control text-center" placeholder="Match Password" />
                            </div>
                            {user.user_data && 
                                <input type="hidden" value={user.user_data.name} name="user_id" />
                            }
                            <div className="button-container">
                                <button className="btn btn-new-match" type="submit">Submit</button>
                            </div>   
                        </div>
                    </form>
                </div>

            </div>

        );
    }
}

export { NewMatch };