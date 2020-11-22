import React from 'react';
import { matchesService } from '../../services/matches.service'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faChartPie } from '@fortawesome/free-solid-svg-icons'
library.add(fab, faChartPie);
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
class LastMatch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            last_match: null,
        }
    }


     componentDidMount() {
        this.user = JSON.parse(localStorage.getItem('user'));
         matchesService.getLastMatchByUser(this.user.user_data.id).then(response => this.setState({ last_match: response }));
    }

    render() {
        const { last_match } = this.state;

        return (
            <section>
                {last_match &&
                    <div>
                        <div className="row mt-4">
                            <div className="col-6">
                                <p className="title--sub-dashboard mb-2">About last match</p>
                            </div>
                            <div className="col-6 text-right">
                                <Link to="/matches/recent">See all stats <FontAwesomeIcon icon="chart-pie" /></Link>
                            </div>
                        </div>
                        <div className="d-flex">
                            <div className="col-3 home--recent-match-block bg-green">
                                <div className="home--stats-number">{last_match.score.you}</div>
                                <div className="home--stats-description">Wins</div>
                            </div>
                            <div className="col-3 home--recent-match-block bg-blue">
                                <div className="home--stats-number">{last_match.score.opponent}</div>
                                <div className="home--stats-description">Losts</div>
                            </div>
                            <div className="col-3 home--recent-match-block bg-yellow">
                                <div className="home--stats-number">{last_match.score.you}</div>
                                <div className="home--stats-description">Score</div>
                            </div>
                            <div className="col-3 home--recent-match-block bg-dark-blue">
                                <div className="home--stats-number">{last_match.vs_player.split(" ")[0]}</div>
                                <div className="home--stats-description">Foe</div>
                            </div>
                        </div>
                    </div>
                }
            </section>

        );
    }
}


export default connect(undefined, undefined)(LastMatch);
