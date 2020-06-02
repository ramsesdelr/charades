import React from 'react';
import { matchesService } from '../../services/matches.service'
import * as MatchActions from '../../actions/matches';
import { connect } from 'react-redux';
import Pusher from 'pusher-js';
import { useSwipeable, Swipeable } from 'react-swipeable';
import PlayerTurn from './PlayerTurn';
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
        };

        this.handleChange = this.handleChange.bind(this);
        this.invitePlayer = this.invitePlayer.bind(this);

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

    removeWord(eventKey = null, direction) {
        console.log(eventKey);
        console.log(direction);
        let new_words_list = this.state.current_words;
        new_words_list.splice(eventKey-1,1);
        // this.setState({current_words:new_words_list});
        this.getNewWord();
    }

    async getNewWord(eventData = null, user_id = null) {
        if(user_id) {
            matchesService.addScorePoint(user_id, this.props.match.params.match_id);
        } else {
            let new_word = await matchesService.getRandomWord();
            this.setState({ current_word: new_word });
        }
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
            } else {
                if (data.match_status.player_id == this.user.user_data.id) {
                    this.setState({ display_word: false });
                } else {
                    this.setState({ oponent_playing: false });
                    matchesService.updatePlayerTurn(this.user.user_data.id);
                }
            }
        });

        this.getNewWord();
    }

    slideLeft(eventData=null, player_id=null){
        // this.setState({slide_class:'word word-hidden'});
        this.setState({slide_class:'word word-visible-left'});
        setTimeout(()=> {
            this.getNewWord();
            this.setState({slide_class:'word'});
        },1000);

    }
    
    slideRight() {
        this.setState({slide_class:'word word-visible-right'});
        setTimeout(()=> {
            this.getNewWord();
            this.setState({slide_class:'word'});
        },1000);
    }

    render() {
        const { loading, match_info, players, current_word, display_word, oponent_playing, player_id, slide_class } = this.state;

        return (
            <div>
                <div className="col-12 mt-4">
                    
                        {display_word &&
                            // <Swipeable onSwipedLeft={this.getNewWord.bind(this)} onSwipedRight={(eventData) => this.getNewWord(eventData, player_id)}>
                            <Swipeable onSwipedRight={(eventData) => this.slideLeft(eventData, player_id)} onSwipedLeft={(eventData) => this.slideRight(eventData, player_id)}>
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
                    {players.map((value, index) => {
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
                    })}

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
