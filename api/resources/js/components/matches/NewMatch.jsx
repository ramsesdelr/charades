import React from 'react';
import { matchesService } from '../../services/matches.service'
import { connect } from 'react-redux';
import { usersService } from '../../services/users.service';
import { Modal, Button , Alert} from 'react-bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faFilm, faHatWizard, faPersonBooth, faSmile, faTv } from '@fortawesome/free-solid-svg-icons'
library.add(fab, faFilm, faHatWizard, faPersonBooth, faSmile, faTv);
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class NewMatch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            match_name: '',
            categories_id: '',
            error: '',
            loading: false,
            user:{},
            categories:[],
            modal_show: false,
            modal_category_icon: {
                0: 'film',
                1: 'film',
                2: 'hat-wizard',
                3: 'person-booth',
                4: 'smile',
                5: 'tv',
            },
            modal_category_title: '',
            modal_category_bg_color: ''
        };

        //@TODO: Capture title and bg color for confirmation modal

    
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
        this.setState({modal_show: false, categories_id: 0});
    }

    selectCategory(category_id, category_title, category_bg_color) {
        this.setState({categories_id: category_id, modal_category_title:category_title, modal_category_bg_color: `col-6 text-center category-container ${category_bg_color}`, modal_show:true});
    }

    render() {
        const {loading, modal_category_icon, modal_category_bg_color, modal_category_title, categories_id , modal_show } = this.state;

        return (
            <div>
				<section className="container">
				    <p className="title--sub-dashboard mb-2">Select the genre to continue</p>

                    <div className="row no-gutters">
						<div className="col-6">
                            <a className="text-center category-container bg-red" onClick={() => { this.selectCategory(1, 'Movies', 'bg-red') }}>
                                <div className="text-center">
                                    <FontAwesomeIcon className="color-white" icon="film" size="3x" />
                                    <div className="mt-1 category-title">Movies</div>		
                                </div>
                            </a>
						</div>
						<div className="col-6">
                            <a className="text-center category-container bg-yellow" onClick={() => { this.selectCategory(2, 'Random', 'bg-yellow') }}>
                                <div className="text-center">
                                    <FontAwesomeIcon className="color-white" icon="hat-wizard" size="3x" />
                                    <div className="mt-1 category-title">Random</div>
                                </div>
                            </a>
						</div>
                        
                        <div className="col-6">
                            <a className="text-center category-container bg-blue" onClick={() => { this.selectCategory(3, 'Act it Out', 'bg-blue') }}>
                                <div className="text-center">
                                    <FontAwesomeIcon className="color-white" icon="person-booth" size="3x" />
                                    <div className="mt-1 category-title">Act it Out</div>		
                                </div>
                            </a>
                        </div>
                        <div className="col-6">
                            <a className="text-center category-container bg-green" onClick={() => { this.selectCategory(4, 'People', 'bg-green') }}>
                                <div className="text-center">
                                    <FontAwesomeIcon className="color-white" icon="smile" size="3x" />
                                    <div className="mt-1 category-title">People</div>		
                                </div>
                            </a>
                        </div>
                        <div className="col-6">
                            <a className="text-center category-container bg-dark-blue" onClick={() => { this.selectCategory(5, 'TV Shows', 'bg-dark-blue') }}>
                                <div className="text-center">
                                    <FontAwesomeIcon className="color-white" icon="tv" size="3x" />
                                    <div className="mt-1 category-title">TV Shows</div>		
                                </div>
                            </a>
                        </div>
                    </div>
                 </section>
                <Modal show={modal_show} onHide={this.modalHandleClose}>
                    <Modal.Body>
                        <div className={modal_category_bg_color}>
                            <div className="text-center">
                                <FontAwesomeIcon className="color-white"icon={modal_category_icon[categories_id]} size="3x" />
                                <div className="mt-1 category-title--modal">{modal_category_title}</div>		
                            </div>
                        </div>
                        <span className="title--main--modal mt-4">Nice Catch!</span>
                        <p className="modal-text">Are you sure this is the real deal? You can pick another category if you're not feeling it.</p>
                        <div className="d-flex w-100">
                            <div className="col-6">
                                <a onClick={this.modalHandleClose}>Nah, go back</a>
                            </div>
                            <div className="col-6 modal-button--confirmation">
                                <a className="title--main" onClick={this.createMatch}>Let's Play!</a>
                            </div>
                        </div>
                         </Modal.Body>
    
                </Modal>
            </div>
        //     <section>
        //         <div className="row">
        //             {categories.length > 0 &&
        //                 categories.map((category, index)  =>  {
        //                     return <div key={index} className="col-lg-6 col-md-6 col-sm-6 col-xs-12 category-name" style={{backgroundColor: bg_color[Math.floor(Math.random() * bg_color.length)]}}>
        //                     <a className="category-link" onClick={() => { this.selectCategory(category.id) }}>{category.title}</a>
        //                 </div>
        //                 })
        //             }
        //         </div>
        //         <Modal show={modal_show} onHide={this.modalHandleClose}>
        //             <Modal.Header closeButton>
        //                 <Modal.Title>New Match</Modal.Title>
        //             </Modal.Header>
        //             <Modal.Body>Start a Match with this category?</Modal.Body>
        //             <Modal.Footer>
        //                 <a className="btn btn-primary btn-red" onClick={this.modalHandleClose}>Cancel</a>
        //                 <a className="btn btn-primary btn-red" onClick={this.createMatch}>Start</a>
        //             </Modal.Footer>
        //         </Modal>
        // </section>
        )
    }
}
 
const mapStateToProps = state => (
	{
	  user: state.user,
	}
);

export default connect(mapStateToProps, undefined)(NewMatch);
