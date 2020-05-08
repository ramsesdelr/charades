import React from 'react';
import { connect } from 'react-redux';
import { matchesService } from '../../services/matches.service'

class PlayerTurn extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            current_player: 0,
            players: this.props.players,
            next_player_id: this.props.player_id,
            match_started: false,
            time:0,
        };
        
    }

    componentDidMount() {
        const pusher = new Pusher('a9f6c879a24fcaac7c20', {
            cluster: 'us2',
            forceTLS: true
        });

        const channel = pusher.subscribe('scoring-channel');
        channel.bind('current-player', data => {
            if(data && data.current_player) {
                let player_index = this.getplayerIndex(data.current_player);
                this.setState({ current_player: player_index });
            } 
        });

    }

    /**
     * Retrieve the player's index in the current match
     * @param {int} player_id 
     * @return {int} 
     */
    getplayerIndex(player_id) {
       let current_player_index = 0;
       this.props.players.map((player, index) => {
            
            if (player.id == player_id) {
                current_player_index = index;
            }
        });
        return current_player_index;
    }

    startMatch(next_player_id) {
        this.setState({match_started: true });
        let timer = setInterval(() => {
            this.setState({
                time: this.state.time + 1
              });
            if(this.state.time == 5) {
                clearInterval(timer);
                this.setState({match_started: false, time:0 });
            }
        }, 1000);
    }
 
    render() {

        const { current_player, next_player_id } = this.state;

        return (
            <div>
                {this.props.players.length > 0 &&
                    <div>
                        <div>It's {this.props.players[current_player].name} turn</div>
                    </div>
                }
                {next_player_id != current_player &&
                    <button onClick={this.startMatch.bind(this, next_player_id)}>Start</button>
                }
            </div>
        );
    }

}   

export default PlayerTurn;
