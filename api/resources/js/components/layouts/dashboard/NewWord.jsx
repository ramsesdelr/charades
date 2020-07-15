import React from 'react';
import { usersService } from '../../../services/users.service'
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';


class NewWord extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            title: '',
            users_id: '',
            categories_id: 1,
            error: '',
            loading: false,
            user:{},
            word_added: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.createWord = this.createWord.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({[name]: value });
    }

    createWord(e){
        e.preventDefault();
        const { title, categories_id = null } = this.state;
        let word_data = {
            title: title,
            categories_id: categories_id,
            users_id: this.props.user.id,
        };
        usersService.createWord(word_data).then(
            response => {

                if (response.status == 201) {   
                    this.setState({title:'', word_added: true});
                } else {
                    console.log(response)
                }
            }
        );
    }

    disableNewWordAlert() {
        this.setState({word_added:false});
    }

    render() {
        const {loading, word_added, title } = this.state;
        return (
            <div className="match-box col-12 mt-4">
                <div className="card">
                    <h1 className="text-center" id="login-title">New Word</h1>
                    {loading && 
                        <div>Creating...</div>
                    }
                    <form onSubmit={this.createWord}>
                        <div className="card-body">
                            <div className="input-group form-group">
                                <input type="text" name="title" value={title} onChange={this.handleChange} className="form-control text-center" placeholder="Word Title" />
                            </div>
                           
                            <div className="button-container">
                                <button className="btn btn-new-match" type="submit">Host</button>
                            </div> 
                            {word_added === true &&
                            <Alert variant="success" onClose={() => this.disableNewWordAlert()}  dismissible>
                                <Alert.Heading>Word word_added succesfully!</Alert.Heading>
                            </Alert> 
                            }
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

export default connect(mapStateToProps, undefined)(NewWord);
