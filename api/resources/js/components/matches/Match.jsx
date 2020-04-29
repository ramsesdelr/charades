import React from 'react';
import { matchesService } from '../../services/matches.service'
import * as MatchActions from '../../actions/matches';
import { connect } from 'react-redux';
import Pusher from 'pusher-js';
import { useSwipeable, Swipeable } from 'react-swipeable'
import PlayerTurn from './PlayerTurn';
class Match extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            match_info: {},
            players: [],
            current_word: '',
            current_player: null,
            invited_player_email: ''
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

    async getNewWord(eventData = null, user_id = null) {
        let new_word = await matchesService.getRandomWord();
        this.setState({ current_word: new_word });
        if(user_id) {
            matchesService.addScorePoint(user_id, this.props.match.params.match_id);
        }
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({[name]: value });
    }


    //TO-DO: Add endpoint to invite player and send the invite link.
    invitePlayer(e) {
        e.preventDefault();
        const { invited_player_email } = this.state;

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

        this.getNewWord();
    }




    


    render() {
        const { loading, match_info, players, current_word } = this.state;
        return (
            <div>
                <div className="match-box col-12 mt-4">
                    <div className="word-container">
                    <Swipeable onSwipedLeft={this.getNewWord.bind(this)} onSwipedRight={(eventData) => this.getNewWord(eventData,6)}>
                        <h1 className="word">{current_word}</h1>
                    </Swipeable>
                    </div>
                </div>
                <div>
                    {players &&
                        <PlayerTurn players={players} />
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
