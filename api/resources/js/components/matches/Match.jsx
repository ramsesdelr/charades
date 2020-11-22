import React from 'react';
import { matchesService } from '../../services/matches.service'
import * as MatchActions from '../../actions/matches';
import { connect } from 'react-redux';
import Pusher from 'pusher-js';
import { useSwipeable, Swipeable } from 'react-swipeable';
import PlayerTurn from './PlayerTurn';
import { Modal,  Alert} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faPaperPlane, faArrowAltCircleLeft, faArrowAltCircleRight, faClock, faStopwatch } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
library.add(fab, faPaperPlane, faArrowAltCircleLeft, faArrowAltCircleRight, faClock, faStopwatch);
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const TURN_TIME = 80;

class Match extends React.Component {

    constructor(props) {
        super(props);
        this.user = JSON.parse(localStorage.getItem('user'));
        this.state = {
            loading: false,
            match_info: {},
            players: [],
            current_word: '',
            invited_player_email: '',
            invited_phone_number:'',
            display_word: false,
            player_id: this.user.user_data.id,
            slide_class:'word',
            match_turns_limit: 1,
            current_turn: 0,
            modal_show: false,
            show_invite_notification: false,
            used_words : [],
            portrait:false,
            winner_name:'',
            player_name: this.user.user_data.name,
            display_match_timer: false,
            start_match_timer:5,
            match_started: false,
            time:80,
            current_player: 0,
            remaining_time:'1:20',
            progress_bar:0,
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
            this.setState({invited_player_email:'', show_invite_notification:true, invited_player_email:'', invited_phone_number:''});
        }
    }

    getRemainingTime(time) {
        this.updateProgressBar(time);
        let minutes = Math.floor(time /60);
        let seconds = time - minutes * 60; 
        this.setState({remaining_time: `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`});
    }

    updateProgressBar(time) {
        let progress_bar = time / TURN_TIME * 100;
        this.setState({progress_bar: 100 - progress_bar});
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
                    this.setState({ display_word: true });
                } else {
                    this.setState({ display_word: false });
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
             
                    matchesService.updatePlayerTurn(this.user.user_data.id, this.state.match_info.id);
                }
                //check if turn ended and guest player was the last one to play
                if(this.state.current_turn == this.state.match_turns_limit && data.match_status.player_id != this.state.match_info.users_id) {
                    this.setMatchWinner(this.props.match.params.match_id);
                }
            } else {
                this.modalHandleShow(data.match_status.player_id);
            }
        });

        channel.bind('current-player', data => {
            console.log(data);
            if(data && data.current_player) {
                let player_index = matchesService.getplayerIndex(data.current_player, this.state.players);
                this.setState({ current_player: player_index });
                
            } 
        });
        
        this.setState({ current_player: matchesService.getplayerIndex(this.props.match.current_player, this.state.players) });

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
        this.setState({modal_show: false, show_invite_notification: false});
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

    
    prepareMatchStart(player_id) {
        this.setState({display_match_timer:true});
        let pre_match_timer = setInterval(() => {

            this.setState({
                start_match_timer: this.state.start_match_timer - 1
            });
            if (this.state.start_match_timer == 0) {
                clearInterval(pre_match_timer);
                this.startMatch(player_id)
                 this.setState({
                    start_match_timer: 5,
                    display_match_timer: false
                 });
            }
        }, 1000);
    }

    startMatch(player_id) {
        this.setState({ match_started: true });

        matchesService.notifyPlayerMatchStarted(player_id);

        let timer = setInterval(() => {
            this.setState({
                time: this.state.time - 1
            });
            this.getRemainingTime(this.state.time);
            if (this.state.time == 0) {
                clearInterval(timer);
                this.setState({ match_started: false, time: TURN_TIME});
                matchesService.notifyPlayerMatchStopped(player_id);
            }
        }, 1000);
    }
 

    render() {
        const { modal_show,  players, current_word, display_word,  player_id, slide_class, show_invite_notification, portrait, winner_name, player_name, match_started, start_match_timer, display_match_timer, current_player, remaining_time, progress_bar, invited_player_email, invited_phone_number  } = this.state;

        let left_side = <div className="col-6 container-column text-center">
            <img src="/images/profile.jpg" className="profile-container--image mb-1"></img>
             <div className="title--main">{player_name.split(" ")[0]}</div> 
             <p className="invite-friend--text">This is not a solo game!</p>
             <p className="invite-friend--text">Go ahead and invite some friends. We know you're not shy.</p>
        </div>

        let match_starting_text;
        if(display_match_timer) {
            match_starting_text = <div className="match--starting-text">Your turn is starting in <span className="h3-title">{start_match_timer}</span></div> 
        } else {
            match_starting_text = <span></span>
        }

        const renderMatchStartingText = (player_id) => {
            if(players[current_player].id != player_id) {
                return <div className="match--starting-text">Stand by...</div>
            }

            if(display_match_timer) {
                return <div className="match--starting-text">Your turn is starting in <span className="h3-title">{start_match_timer}...</span></div> 
            } else {
                return <div className="match--starting-text"></div>;
            }
        }
        const renderStartMatchButton = () => {
            if(!players.length) {
                return;
            }
            if(match_started === false && player_id == players[current_player].id && players.length > 1) {
                return <div className="d-flex flex-column align-items-center">
                        <button className="btn btn-new-match" onClick={this.prepareMatchStart.bind(this, player_id)}>Start</button>
                    </div>
            }
        };

        const renderPlayerTurns = () => {
            if(!players.length || match_started === true) {
                return;
            }
            if(players && players.length < 2) {
                return;
            }

            let player_turn = <div className="col-12"><img className="match-arrow--left" src="/images/hand-pointer-right.png"></img></div>;
            if(current_player == 1) {
                player_turn = <div className="col-12 text-right"><img className="match-arrow--right" src="/images/hand-pointer-left.png"></img></div>
            }
             return <div className="d-flex match--turn-container">
                            {player_turn}
                    </div>

        };
        if(display_word === false && players.length > 1) {
            left_side = players.map((value, index) => {
                return <div key={value.id} className="col-6 player-container pb-4">
                            {index == 1 &&
                                <div className="vs-right">S</div>
                            }
                            <div className="score-container mt-1">
                                <div className="current-score">
                                    <img src="/images/profile.jpg" className="match--profile-image mb-1"></img>
                                </div>
                                <div className="match--profile-name">
                                    {value.name.split(" ")[0]}
                                </div>
                                <div className="score">{value.score}</div>
                                    {renderMatchStartingText(value.id)}   
                            </div>
                            {index == 0 &&
                                <div className="vs-left">V</div>
                            }
                        </div>
            });
        }

        if(display_word  && players.length > 1) {
            left_side = <div></div>;
        }
        
        return (
            <section>
                <div className="col-12">             
                    
                </div>
                {renderStartMatchButton()}
                {display_word &&
                        <div className="row">
                            <div className="col-1 d-flex align-items-center">
                                <a className="arrow-link"  onClick={(eventData) => this.addPointToPlayer(eventData, player_id)}>
                                    <FontAwesomeIcon size="3x" className="color-dark-blue"  icon="arrow-alt-circle-left" />
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
                                    <FontAwesomeIcon  size="3x" className="color-dark-blue" icon="arrow-alt-circle-right" />
                                </a>
                            </div>
                            <div className="timer-container">
                                <div className="timer--clock"><FontAwesomeIcon  className="color-dark-blue" size="sm"  icon="clock" /> {remaining_time}</div>
                                <div className="timer-container--progress-bar">
                                    <div className="timer-container-progress-bar--remaining" style={{width: progress_bar + '%'}}></div>
                                </div>
                            </div>
                        </div>
                        
                    }

                {renderPlayerTurns()}
                <div className="row">

                    {left_side}

                    {players.length == 1 &&
                    <div className="col-6">
                        <form onSubmit={this.invitePlayer}>
                            <div>
                                <h3 className="title--main text-center">Get your friend over here!</h3>
                                <div className="invite-friend--container">
                                    <div className="input-group form-group">
                                        <label className="register--label">Player's Email</label>
                                        <input type="email" name="invited_player_email" value={invited_player_email} onChange={this.handleChange} className="form-control" placeholder="sample@email.com" /> 
                                    </div>
                                    <div className="text-center color-dark-blue">Or</div>
                                    <div className="input-group form-group">
                                        <label className="register--label">Player's Phone Number</label>
                                        <input type="phone" name="invited_phone_number" value={invited_phone_number} onChange={this.handleChange} className="form-control" placeholder="222-000-0000" />
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

                <Modal show={show_invite_notification} onHide={this.modalHandleClose} backdrop="static" >
                        <Modal.Body>
                            <span className="title--main--modal m-4">Invitation sent!</span>
                            <p className="modal-text mt-0 pt-0 mb-4">Wait for your pal to join the match.</p>
                                <a className="invite-sent--button" onClick={this.modalHandleClose}> Got It!</a>
                        </Modal.Body> 
                </Modal>
            
                <Modal show={portrait}  backdrop="static" keyboard={false}>
                        <Modal.Body>
                            <img className="rotate-phone" src="/images/rotate-phone.svg"></img>
                            <span className="title--main--modal m-4">Don't miss the fun, and flip that phone!</span>
                            <p className="modal-text mt-0 pt-0 mb-4">The experience works better on landscape mode.</p>
                        </Modal.Body> 
                </Modal>

                <Modal show={modal_show} onHide={this.modalHandleClose}  backdrop="static" keyboard={false}>
                    <Modal.Body> 
                        <FontAwesomeIcon size="3x" className="color-dark-blue"  icon="stopwatch" />
                        <span className="title--main--modal mt-3">Game Over!</span>
                        <p className="modal-text pb-0">The match just ended and the winner is <h3><strong>{winner_name}</strong>!</h3></p>
                        <p className="modal-text pt-0">Wanna play again?</p>
                        <div className="d-flex w-100">
                            <div className="col-6">
                                <Link to="/">Nah, go back</Link>
                            </div>
                            <div className="col-6 modal-button--confirmation">
                                <Link to="/match/new">Bring it!</Link>
                            </div>
                        </div>
                    </Modal.Body>
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
