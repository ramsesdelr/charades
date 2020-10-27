import React from 'react';
import { matchesService } from '../../services/matches.service'
import * as MatchActions from '../../actions/matches';
import { connect } from 'react-redux';
import Pusher from 'pusher-js';
import { useSwipeable, Swipeable } from 'react-swipeable';
import PlayerTurn from './PlayerTurn';
import { Modal, Button , Alert} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ArrowLeftCircle, ArrowRightCircle  } from 'react-bootstrap-icons';
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
library.add(fab, faPaperPlane);
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
class Match extends React.Component {

    constructor(props) {
        super(props);
        this.user = JSON.parse(localStorage.getItem('user'));
        this.state = {
            loading: false,
            match_info: {},
            players: [],
            current_word: '',
            current_player: null,
            invited_player_email: '',
            invited_phone_number:'',
            display_word: false,
            oponent_playing: false,
            player_id: this.user.user_data.id,
            slide_class:'word',
            match_turns_limit: 3,
            current_turn: 0,
            modal_show: false,
            show_invite_notification: false,
            used_words : [],
            portrait:false,
            winner_name:'',
            player_name: this.user.user_data.name

        };

        this.success_audio = new Audio("/media/success.wav");
        this.fail_audio = new Audio("/media/fail.wav");
        this.handleChange = this.handleChange.bind(this);
        this.invitePlayer = this.invitePlayer.bind(this);
        this.modalHandleClose = this.modalHandleClose.bind(this);
        this.validateLandScapeScreen  = this.validateLandScapeScreen.bind(this);

    }


    async getMatch(match_id) {
        try {
            let response = await matchesService.getMatch(match_id);
            this.props.getMatch(response.data);
            this.getNewWord(response.data.match_info.categories_id);
            this.setState({ match_info: response.data.match_info, players: response.data.players });
            this.validateLandScapeScreen();
        }
        catch {
            this.setState({ loading: false });
        }
    }

    async getNewWord(category_id = null) {
        let match_category = this.state.match_info.categories_id;
        if(category_id) {
            match_category = category_id;
        }
        let new_word = await matchesService.getRandomWord(this.state.used_words, match_category);
        let new_used_words = [
            ...this.state.used_words,
            new_word
        ];
        this.setState({ current_word: new_word, used_words: new_used_words});
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({[name]: value });
    }

    async invitePlayer(e) {
        e.preventDefault();
    
        let invite_info = {
            phone_number: this.state.invited_phone_number,
            email :this.state.invited_player_email
        };
        let invite_confirmation = await matchesService.invitePlayer(invite_info, this.props.match.params.match_id);
        if(invite_confirmation.status == 200) {
            this.setState({invited_player_email:'', show_invite_notification:true, invited_player_email:''});
        }
    }
    
    componentDidMount() {
        this.getMatch(this.props.match.params.match_id);
        window.addEventListener("resize", this.validateLandScapeScreen);
        const pusher = new Pusher(process.env.MIX_PUSHER_APP_KEY, {
            cluster: process.env.MIX_PUSHER_APP_CLUSTER,
            forceTLS: true
        });

        const channel = pusher.subscribe('scoring-channel');

        channel.bind('add-score', data => {
            if(data && data.score) {
                this.props.updateScoring(data.score);
                this.setState({ players: this.props.players });
            }
        });

        channel.bind('add-player-to-match', data => {
            this.getMatch(this.props.match.params.match_id);
        });

        channel.bind('match-status', data => {
            
            if (data.match_status.status == 'started') {

                if (data.match_status.player_id == this.user.user_data.id) {
                    this.setState({ display_word: true, oponent_playing: false });
                } else {
                    this.setState({ display_word: false, oponent_playing: true });
                }
                //check if current is the match owner so we can update the turns
                if (data.match_status.player_id == this.state.match_info.users_id ) {
                    this.setState({ current_turn: this.state.current_turn + 1 });      
                }
            } else if(data.match_status.status == 'stopped') {              
                //hide the words for the player that just finished its turn  
                if (data.match_status.player_id == this.user.user_data.id) {
                    this.setState({ display_word: false });
                } else {
                    this.setState({ oponent_playing: false });
                    matchesService.updatePlayerTurn(this.user.user_data.id, this.state.match_info.id);
                }
                //check if turn ended and guest player was the last one to play
                if(this.state.current_turn == this.state.match_turns_limit && data.match_status.player_id != this.state.match_info.users_id) {
                    this.setMatchWinner(this.props.match.params.match_id);
                }
            } else {
                this.modalHandleShow(data.match_status.player_id);
                console.log('show!');
            }
        });

    }

    slideLeft(eventData=null, player_id=null) {
        this.fail_audio.play();
        this.setState({slide_class:'word word-visible-left'});
        setTimeout(()=> {
            this.getNewWord();
            this.setState({slide_class:'word'});
        },1000);

    }
    
    addPointToPlayer(eventData, player_id) {
        this.success_audio.play();
        this.setState({slide_class:'word word-visible-right'});
        matchesService.addScorePoint(player_id, this.props.match.params.match_id);
        setTimeout(()=> {   
            this.getNewWord();
            this.setState({slide_class:'word'});
        },1000);
    }

    async modalHandleShow(winner_id) {
        let winner_index  =  await matchesService.getplayerIndex(winner_id, this.state.players);
        if(winner_index != null) { 
            this.setState({modal_show: true, winner_name: this.state.players[winner_index].name});
        }
    }
    async setMatchWinner() {
        let winner = await matchesService.addMatchWinner(this.props.match.params.match_id);
        if(winner.status == 200) { 
        matchesService.notifyPlayerMatchEnded(winner.winnder_id);
        }
    }

    modalHandleClose() {
        this.setState({modal_show: false});
    }

    disableInviteAlert() {
        this.setState({show_invite_notification:false});
    }

    validateLandScapeScreen() {
        if(window.innerHeight > window.innerWidth) {
            this.setState({portrait:true});
        } else {
            this.setState({portrait:false});
        }
    }

    render() {
        const { modal_show, match_info, players, current_word, display_word, oponent_playing, player_id, slide_class, show_invite_notification, portrait, winner_name, player_name } = this.state;
        let left_side = <div className="col-6 container-column text-center">
            <img src="/images/profile.jpg" className="profile-container--image mb-1"></img>
             <div className="title--main">{player_name.split(" ")[0]}</div> 
             <p className="invite-friend--text">This is not a solo game!</p>
             <p className="invite-friend--text">Go ahead and invite some friends. We know you're not shy.</p>
        </div>

        if(display_word === false && players.length > 1) {
            left_side = players.map((value, index) => {
                return <div key={value.id} className="col-6 player-container">
                            {index == 1 &&
                                <div className="vs-right">S</div>
                            }
                            {index == 0 &&
                                <div className="vs-spacing"></div>
                            }
                            <div className="score-container">
                                <div className="current-score">
                                    <img src="/images/profile.jpg" className="profile-container--image mb-1"></img>
                                </div>
                                <div className="title--main">
                                    {value.name.split(" ")[0]}
                                </div>
                                <div className="score">{value.score}</div>
                            </div>
                            {index == 0 &&
                                <div className="vs-left">V</div>
                            }
                            {index == 1 &&
                                <div className="vs-spacing"></div>
                            }
                        </div>
            });
        }
        
        return (
            <section>
                <div className="col-12 mt-4">    
                   
                    {oponent_playing &&
                        <div>Your opponent it's currently playing</div>
                    }
                </div>
                <div className="d-flex flex-column align-items-center">
                    {players.length > 0 &&
                        <PlayerTurn players={players} player_id={player_id} match={match_info} />
                    }
                </div>
                {display_word &&
                        <div className="row">
                            <div className="col-1 d-flex align-items-center">
                                <a className="arrow-link"  onClick={(eventData) => this.addPointToPlayer(eventData, player_id)}>
                                    <ArrowLeftCircle size={48} color="#4caf50" />
                                </a>
                            </div>
                            <div className="col-10">
                                <Swipeable onSwipedLeft={(eventData) => this.addPointToPlayer(eventData, player_id)} onSwipedRight={(eventData) => this.slideLeft(eventData, player_id)}>
                                    <div className="word-container">
                                        <h1 className={slide_class}>{current_word}</h1>
                                    </div>
                                </Swipeable>
                            </div>
                            <div className="col-1 d-flex align-items-center">
                                <a className="arrow-link right"  onClick={(eventData) => this.slideLeft(eventData, player_id)}>
                                    <ArrowRightCircle color="#d05249" size={48}/>
                                </a>
                            </div>
                        </div>
                        
                    }
                <div className="row">

                    {left_side}

                    {players.length == 1 &&
                    <div className="col-md-6 col-sm-12">
                        <form onSubmit={this.invitePlayer}>
                            <div>
                                <h3 className="title--main text-center">Get your friend over here!</h3>
                               {show_invite_notification === true &&               
                                    <Alert variant="success" onClose={() => this.disableInviteAlert()}  dismissible>
                                        <Alert.Heading>Invitation send</Alert.Heading>
                                       
                                    </Alert>
                                }
                                <div className="invite-friend--container">
                                    <div className="input-group form-group">
                                        <label className="register--label">Player's Email</label>
                                        <input type="email" name="invited_player_email" onChange={this.handleChange} className="form-control" placeholder="sample@email.com" /> 
                                    </div>
                                    <div className="text-center color-dark-blue">Or</div>
                                    <div className="input-group form-group">
                                        <label className="register--label">Player's Phone Number</label>
                                        <input type="phone" name="invited_phone_number" onChange={this.handleChange} className="form-control" placeholder="222-000-0000" />
                                    </div>
                                    <div className="text-center">
                                        <button className="invite-match--buton" type="submit">Send invite <FontAwesomeIcon  icon="paper-plane" className="ml-1" /></button>
                                    </div>  
                                </div> 
                            </div>
                        </form>   
                    </div>                  
                    }
                </div>
            
                <Modal show={portrait}  backdrop="static" keyboard={false}>
                        <Modal.Body>
                            <img className="rotate-phone" src="/images/rotate-phone.svg"></img>
                            <span className="title--main--modal m-4">Don't miss the fun, and flip that phone!</span>
                            <p className="modal-text mt-0 pt-0 mb-4">The experience works better on landscape mode.</p>
                        </Modal.Body> 
                </Modal>

                <Modal show={modal_show} onHide={this.modalHandleClose}  backdrop="static" keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Finished Match</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Your match just ended and the winner is: <strong>{winner_name}</strong>! <br></br> 
                    Thank you for playing!
                    </Modal.Body>
                    <Modal.Footer>
                    <div className="row w-100">
                        <div className="col-6"><Link className="btn btn-red" to="/">Back</Link></div>
                        <div className="col-6 text-right"><Link className="btn btn-red" to="/match/new">Start a new match</Link></div>
                    </div>
                    </Modal.Footer>
                </Modal>
            </section>
        );
    }
}

const mapStateToProps = state => (
    {
        user: state.user,
        players: state.match.players
    }
);


export default connect(mapStateToProps, MatchActions)(Match);
