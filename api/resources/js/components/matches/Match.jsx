import React from 'react';
import { matchesService } from '../../services/matches.service'
import * as MatchActions from '../../actions/matches';
import { connect } from 'react-redux';
import Pusher from 'pusher-js';
import { useSwipeable, Swipeable } from 'react-swipeable';
import PlayerTurn from './PlayerTurn';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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
            display_word: false,
            oponent_playing: false,
            player_id: this.user.user_data.id,
            slide_class:'word',
            match_turns_limit: 3,
            current_turn: 0,
            modal_show: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.invitePlayer = this.invitePlayer.bind(this);
        this.modalHandleClose = this.modalHandleClose.bind(this);

    }


    async getMatch(match_id) {
        try {
            let response = await matchesService.getMatch(match_id);
            this.props.getMatch(response.data);
            this.setState({ match_info: response.data.match_info, players: response.data.players });

        }
        catch {
            this.setState({ loading: false });
        }
    }

    async getNewWord(eventData = null, user_id = null) {

        let new_word = await matchesService.getRandomWord();
        this.setState({ current_word: new_word });
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({[name]: value });
    }

    async invitePlayer(e) {
        e.preventDefault();
        const { invited_player_email } = this.state;
        let invite_confirmation = await matchesService.invitePlayer(invited_player_email, this.props.match.params.match_id);
    }
    
    componentDidMount() {
        this.getMatch(this.props.match.params.match_id);

        const pusher = new Pusher('a9f6c879a24fcaac7c20', {
            cluster: 'us2',
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

                if(data.match_status.player_id == this.user.user_data.id) {
                    this.setState({ display_word: true, oponent_playing: false });
                } else {
                    this.setState({ display_word: false, oponent_playing: true });
                }
                //check if current is the match owner so we can update the turns
                if (data.match_status.player_id == this.state.match_info.users_id ) {
                    this.setState({ current_turn: this.state.current_turn + 1 });      
                }
            } else {
                if (data.match_status.player_id == this.user.user_data.id) {
                    this.setState({ display_word: false });
                } else {
                    this.setState({ oponent_playing: false });
                    matchesService.updatePlayerTurn(this.user.user_data.id);
                }
                //check if turn ended and guest player was the last one to play
                if(this.state.current_turn == this.state.match_turns_limit && data.match_status.player_id != this.state.match_info.users_id) {
                    this.modalHandleShow();
                 }
                 //
                     
            }

        });

        this.getNewWord();
    }

    slideLeft(eventData=null, player_id=null){
        this.setState({slide_class:'word word-visible-left'});
        setTimeout(()=> {
            this.getNewWord();
            this.setState({slide_class:'word'});
        },1000);

    }
    
    addPointToPlayer(eventData, player_id) {
        this.setState({slide_class:'word word-visible-right'});
        matchesService.addScorePoint(player_id, this.props.match.params.match_id);
        setTimeout(()=> {   
            this.getNewWord();
            this.setState({slide_class:'word'});
        },1000);
    }

    modalHandleShow() {
        this.setState({modal_show: true});
        //assign the winner if the match has ended for the match woner
        if(this.state.match_info.users_id == this.state.player_id) {
            matchesService.addMatchWinner(this.props.match.params.match_id);
        }
    }

    modalHandleClose() {
        this.setState({modal_show: false});
    }
    

    render() {
        const { modal_show, match_info, players, current_word, display_word, oponent_playing, player_id, slide_class } = this.state;
 
        return (
            <div>
                <div className="col-12 mt-4">    
                    {display_word &&
                        <Swipeable onSwipedLeft={(eventData) => this.addPointToPlayer(eventData, player_id)} onSwipedRight={(eventData) => this.slideLeft(eventData, player_id)}>
                            <div className="word-container">
                                <h1 className={slide_class}>{current_word}</h1>
                            </div>
                        </Swipeable>
                    }
                    {oponent_playing &&
                        <div>Your opponent it's currently playing</div>
                    }
                </div>
                <div>
                    {players.length > 0 &&
                        <PlayerTurn players={players} player_id={player_id} />
                    }
                </div>
                <div className="row">

                    {display_word === false &&
                        players.map((value, index) => {
                            return <div key={value.id} className="col-md-6 col-sm-12">
                                        <div className="score-container">
                                            <div className="current-score">
                                                {value.score}
                                            </div>
                                            <div className="player-title">
                                                {value.name}
                                            </div>
                                        </div>
                                    </div>
                        })
                    }

                    {players.length == 1 &&
                    <div className="col-md-6 col-sm-12">
                        <form onSubmit={this.invitePlayer}>
                            <div className="card-body">
                                <h3 className="h3-title">Invite a friend to start!</h3>
                                
                                <div className="input-group form-group">
                                    <input type="email" name="invited_player_email" onChange={this.handleChange} className="form-control text-center" placeholder="Player Email" />
                                </div>
                                <div className="button-container text-center">
                                    <button className="btn btn-new-match" type="submit">Send Invite</button>
                                </div>   
                            </div>
                        </form>   
                    </div>                  
                    }
                </div>
                <Modal show={modal_show} onHide={this.modalHandleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Match</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Your match just ended! We hope to see you again!</Modal.Body>
                    <Modal.Footer>
                        <Link to="/">Back</Link>
                        <Link to="/match/new">Start a new match</Link>
                    </Modal.Footer>
                </Modal>
            </div>
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
