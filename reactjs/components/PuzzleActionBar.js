import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import config from "../configs/keys";

class PuzzleActionBar extends React.Component {

    constructor(props, {t}) {
        super(props, {t});
        this.t = t;

        this.state = {
            enrolled: false,
            showTeamsMemberOf: false
        };

        const urlParams = new URLSearchParams(window.location.search);
        this.puzzleId = urlParams.get('puzzleId');

        this.enrollSinglePlayer = this.enrollSinglePlayer.bind(this);
        this.showTeamsMemberOf = this.showTeamsMemberOf.bind(this);
        this.enrollTeam = this.enrollTeam.bind(this);
    }

    async componentDidMount() {
        const request = {
            method: 'GET',
            mode: 'cors',
            credentials: 'include'
        };

        try {
            let response = await fetch(config.API_URL + '/api/get-session/' + this.puzzleId, request);
            if(response.status === 200){
                let responseJson = await response.json();
                await this.setState({session: responseJson});
                await this.setState({enrolled: true});
            }
        } catch(e) {
            console.log(e);
        }
    }

    async enrollSinglePlayer() {
        const request = {
            method: 'POST',
            mode: 'cors',
            credentials: 'include'
        };

        try {
            let response = await fetch(config.API_URL + '/api/enroll-single-player/' + this.puzzleId, request);
            console.log(response);

            if(response.status === 200){
                await this.componentDidMount();
                await this.setState({enrolled: true});
            }
        } catch(e) {
            console.log(e);
        }
    }

    async enrollTeam(event) {
        const request = {
            method: 'POST',
            mode: 'cors',
            credentials: 'include'
        };

        let teamId = event.target.getAttribute('value');
        try {
            let response = await fetch(config.API_URL + '/api/enroll-team/' + this.puzzleId + '/' + teamId, request);
            let responseJson = await response.json();

            if(response.status === 200){
                await this.setState({session: responseJson});
                await this.setState({showTeamsMemberOf: false});
                await this.setState({enrolled: true});
            }
        } catch(e) {
            console.log(e);
        }
    }

    async showTeamsMemberOf() {
        const request = {
            method: 'GET',
            mode: 'cors',
            credentials: 'include'
        };

        try {
            let response = await fetch(config.API_URL + '/api/teams/member_of', request);
            let responseJson = await response.json();

            if(response.status === 200){
                await this.setState({teamsMemberOf: responseJson});
                await this.setState({showTeamsMemberOf: true});
            }
        } catch(e) {
            console.log(e);
        }
    }

    render() {

        return(
            <div className="alert alert-warning">

                {
                    (()=>{
                        if(this.state['enrolled'] && this.state['session']){
                            return(
                                <div>
                                   <h2>progress: {this.state['session']['completeness']} </h2>
                                    {(()=>{
                                        if(this.state['session']['teamPlayer']){
                                            return(
                                                <h2>team: {this.state['session']['teamPlayer']['name']} </h2>
                                            );
                                        }
                                    })()}
                                </div>
                            );
                        } else if(this.state['showTeamsMemberOf']) {
                            return(
                                <div>
                                    Choose a team:
                                    {
                                        this.state['teamsMemberOf'].map((team)=>{
                                            return(
                                                <a key={team['id']} className={"team-link"} value={team['id']}
                                                    onClick={this.enrollTeam}> { team['name'] } </a>
                                            );
                                        })
                                    }
                                </div>
                            );
                        } else {
                            return(
                                <div className={"action"}>
                                    <button className="btn btn-warning"
                                            onClick={this.enrollSinglePlayer}>Solve solo</button>
                                    <button className="btn btn-warning"
                                            onClick={this.showTeamsMemberOf}>Solve with a team</button>
                                </div>
                            );
                        }
                    })()
                }

                { /*language=SCSS*/ }
                <style jsx>{`                    
                    .alert {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                    }
                    
                    .action {
                      display: flex;
                      flex-direction: row;
                      justify-content: center;
                    }
                `}</style>
            </div>
        );
    }
}

export default withNamespaces()(PuzzleActionBar);