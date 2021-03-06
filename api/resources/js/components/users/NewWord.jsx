import React from 'react';
import { usersService } from '../../services/users.service'
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
            word_added: false,
            word_error: false,
            categories: [],

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
        this.disableNewWordAlert();
        const { title, categories_id } = this.state;
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
                    this.setState({word_error:true});
                }
            }
    );
    }

    componentDidMount() {
        usersService.getCategories().then( response => {
            this.setState({categories:response});
        });
    }

    disableNewWordAlert() {
        this.setState({word_added:false, word_error:false});
    }

    render() {
        const {loading, word_added, title, word_error, categories } = this.state;
        return (
            <div className="new-word-container">
                <p className="title--sub-dashboard mb-2 col-12">Adding some words? The more the merrier!</p>
                <section className="col-12 mt-4 d-flex flex-column align-items-center">
                    <div className="user-settings-container">
                        <h1 className="title--main text-center mt-4">New Word</h1>
                        {loading && 
                            <div>Creating...</div>
                        }
                        <form onSubmit={this.createWord}>
                            <div className="card-body">
                                {word_error === true &&
                                    <Alert variant="warning" onClose={() => this.disableNewWordAlert()}  dismissible>
                                        This word already exist
                                    </Alert> 
                                }
                                {word_added === true &&
                                    <Alert variant="success"  onClose={() => this.disableNewWordAlert()}  dismissible>
                                        Word added succesfully!
                                    </Alert> 
                                }
                                <div className="input-group form-group">
                                    <input type="text" name="title" value={title} onChange={this.handleChange} className="form-control text-center" placeholder="Word Title" />
                                </div>

                                <select className="form-control mb-4" name="categories_id" onChange={this.handleChange}>
                                {categories.length > 0 &&
                                        categories.map((category, index) => {
                                            return <option key={index} value={category.id}>{category.title}</option>
                                        })
                                }
                                </select>
                                <div>
                                    <button className="btn login--buton" type="submit">Add Word</button>
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

export default connect(mapStateToProps, undefined)(NewWord);
