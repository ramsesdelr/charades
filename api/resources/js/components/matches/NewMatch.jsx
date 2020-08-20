import React from 'react';
import { matchesService } from '../../services/matches.service'
import { connect } from 'react-redux';
import { usersService } from '../../services/users.service';
import { Modal, Button , Alert} from 'react-bootstrap';


class NewMatch extends React.Component {
    constructor(props) {
        super(props);
        let COLOR_LIST =  ['aqua', 'black', 'brown', 'cyan', 'magenta', 'cadetblue','blueviolet','burlywood', 'tistle', 'tomato', 'slategray', 'slateblue', 'skyblue', 'sienna', 'seagreen'];
        this.state = {
            match_name: '',
            categories_id: '',
            error: '',
            loading: false,
            user:{},
            bg_color: COLOR_LIST,
            categories:[],
            modal_show: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.createMatch = this.createMatch.bind(this);
        this.selectCategory = this.selectCategory.bind(this);
        this.modalHandleClose = this.modalHandleClose.bind(this);

    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({[name]: value });
    }

    createMatch(e){
        e.preventDefault();
        let date = new Date();
        const { categories_id } = this.state;
        let match_date = date.toLocaleString();
        let match_data = {
            name: `Match - ${match_date}` ,
            users_id: this.props.user.id,
            categories_id: categories_id

        };
        matchesService.createMatch(match_data).then(
            response => {

                if (response.status == 201) {   
                    this.props.history.push(`/current_match/${response.data.id}`);
                } else {
                    console.log(response)
                }
                this.setState({ loading: false });
            }
        );
    }

    componentDidMount() {
        usersService.getCategories().then( response => {
            this.setState({categories:response});
        });
    }

    
    modalHandleShow() {
        this.setState({modal_show: true});
        //assign the winner if the match has ended for the match woner
        if(this.state.match_info.users_id == this.state.player_id) {
            matchesService.addMatchWinner(this.props.match.params.match_id);
        }
    }

    modalHandleClose() {
        this.setState({modal_show: false, categories_id: null});
    }

    selectCategory(category_id) {
        this.setState({categories_id: category_id, modal_show:true});
    }

    render() {
        const {loading, bg_color, categories, modal_show } = this.state;

        return (
            <div>
                <div className="row">
                    {categories.length > 0 &&
                        categories.map((category, index)  =>  {
                            return <div key={index} className="col-lg-6 col-md-6 col-sm-6 col-xs-12 category-name" style={{backgroundColor: bg_color[Math.floor(Math.random() * bg_color.length)]}}>
                            <a className="category-link" onClick={() => { this.selectCategory(category.id) }}>{category.title}</a>
                        </div>
                        })
                    }
                </div>
                <Modal show={modal_show} onHide={this.modalHandleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Match</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Start a Match with this category?</Modal.Body>
                    <Modal.Footer>
                        <a className="btn btn-primary btn-red" onClick={this.modalHandleClose}>Cancel</a>
                        <a className="btn btn-primary btn-red" onClick={this.createMatch}>Start</a>
                    </Modal.Footer>
                </Modal>
        </div>
        )
    }
}
 
const mapStateToProps = state => (
	{
	  user: state.user,
	}
);

export default connect(mapStateToProps, undefined)(NewMatch);
