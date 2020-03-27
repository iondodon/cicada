import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import config from "../configs/keys";

class ContestActionBar extends React.Component {

    constructor(props, {t}) {
        super(props, {t});
        this.t = t;

        this.state = {
            enrolled: false,
            showTeamsMemberOf: false,
            error: false,
            errorMessage: null
        };

        const urlParams = new URLSearchParams(window.location.search);
        this.contestId = urlParams.get('contestId');

        this.puzzleId = this.props.puzzleId;

        this.enrollSinglePlayer = this.enrollSinglePlayer.bind(this);
        this.showTeamsMemberOf = this.showTeamsMemberOf.bind(this);
        this.enrollTeam = this.enrollTeam.bind(this);
        this.singlePlayerLeaveContest = this.singlePlayerLeaveContest.bind(this);
        this.leaveTeam = this.leaveTeam.bind(this);
        this.getEnrolled = this.getEnrolled.bind(this);
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
                await this.setState({error: false});
            } else {
                await this.setState({error: true});
                await this.setState({errorMessage: responseJson['message']});
            }
        } catch(e) {
            await this.setState({error: true});
            await this.setState({errorMessage: e});
        }
    }

    async getEnrolled() {
        const request = {
            method: 'GET',
            mode: 'cors',
            credentials: 'include'
        };

        try {
            let response = await fetch(config.API_URL + '/api/contests/get-enrolled/' + this.contestId, request);
            let responseJson = await response.json();
            if(response.status === 200){
                await this.setState({enrolled: responseJson['enrolled']});
                if(responseJson['enrolled']) {
                    await this.setState({singlePlayer: responseJson['singlePlayer']});
                    if(responseJson['singlePlayer']) {
                        await this.setState({singlePlayerId: responseJson['singlePlayerId']});
                    }

                    await this.setState({teamPlayer: responseJson['teamPlayer']});
                    if(responseJson['teamPlayer']) {
                        await this.setState({teamName: responseJson['teamName']});
                        await this.setState({teamId: responseJson['teamId']});
                    }
                }

                console.log(this.state);
            } else {
                await this.setState({error: true});
                await this.setState({errorMessage: responseJson['message']});
            }
        } catch(e) {
            await this.setState({error: true});
            await this.setState({errorMessage: e});
        }
    }


    async componentDidMount() {
        await this.getEnrolled();
    }

    async enrollSinglePlayer() {
        const request = {
            method: 'POST',
            mode: 'cors',
            credentials: 'include'
        };

        try {
            let response = await fetch(config.API_URL + '/api/contest/enroll-single-player/' + this.contestId, request);
            let responseJson = await response.json();
            if(response.status === 200){
                await this.setState({sessions: responseJson});
                if(this.state['sessions']) {
                    await this.setState({enrolled: true});
                }
                await this.setState({error: false});
            } else {
                await this.setState({error: true});
                await this.setState({errorMessage: responseJson['message']});
            }
        } catch(e) {
            await this.setState({error: true});
            await this.setState({errorMessage: e});
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
            let response = await fetch(config.API_URL + '/api/contest/enroll-team/' + this.contestId + '/' + teamId, request);
            let responseJson = await response.json();

            if(response.status === 200){
                await this.setState({sessions: responseJson});
                await this.setState({showTeamsMemberOf: false});
                if(this.state['sessions']) {
                    await this.setState({enrolled: true});
                }
                await this.setState({error: false});
                await this.getEnrolled();
            } else {
                await this.setState({error: true});
                await this.setState({errorMessage: responseJson['message']});
            }
        } catch(e) {
            await this.setState({error: true});
            await this.setState({errorMessage: e});
        }
    }

    async leaveTeam() {
        const request = {
            method: 'POST',
            mode: 'cors',
            credentials: 'include'
        };

        try {
            let response = await fetch(config.API_URL + '/api/teams/leave-team/' + this.state['teamId'], request);
            let responseJson = await response.json();

            if(response.status === 200){
                await this.setState({sessions: null});
                await this.setState({showTeamsMemberOf: false});
                if(this.state['sessions']) {
                    await this.setState({enrolled: false});
                }
                await this.setState({error: false});
                await this.getEnrolled();
            } else {
                await this.setState({error: true});
                await this.setState({errorMessage: responseJson['message']});
            }
        } catch(e) {
            await this.setState({error: true});
            await this.setState({errorMessage: e});
        }
    }

    async singlePlayerLeaveContest() {
        const request = {
            method: 'POST',
            mode: 'cors',
            credentials: 'include'
        };

        try {
            let response = await fetch(config.API_URL + '/api/single-player-leave-contest/' + this.contestId, request);
            let responseJson = await response.json();

            if(response.status === 200){
                await this.setState({sessions: null});
                await this.setState({showTeamsMemberOf: false});
                if(this.state['sessions']) {
                    await this.setState({enrolled: false});
                }
                await this.setState({error: false});

                await this.setState({enrolled: false});
                await this.setState({singlePlayer: false});
                this.getEnrolled();
            } else {
                await this.setState({error: true});
                await this.setState({errorMessage: responseJson['message']});
            }
        } catch(e) {
            await this.setState({error: true});
            await this.setState({errorMessage: e});
        }
    }

    render() {

        return(
            <div className="alert alert-warning">

                {(()=>{
                    if(this.state['enrolled']){
                        return(
                            <div>
                                You are registered for this contest. Go to puzzle page to see the sessions.
                            </div>
                        );
                    } else {
                        return(
                            <div className={"action"}>
                                <button className="btn btn-warning btn-ghost"
                                        onClick={this.enrollSinglePlayer}>Solve solo</button>
                                <button className="btn btn-warning btn-ghost"
                                        onClick={this.showTeamsMemberOf}>Solve with a team</button>
                            </div>
                        );
                    }
                })()}

                {(()=>{
                    if(this.state['showTeamsMemberOf']) {
                        return (
                            <div className={"show-teams"}>
                                <a onClick={()=>this.setState({showTeamsMemberOf: false})}>(cancel)</a>
                                Choose a team:
                                {
                                    this.state['teamsMemberOf'].map((team) => {
                                        return (
                                            <a key={team['id']}
                                               value={team['id']}
                                               className={'team-link'}
                                               onClick={this.enrollTeam}> {team['name']} </a>
                                        );
                                    })
                                }
                            </div>
                        );
                    }
                })()}

                {(()=>{
                    if(this.state['error']) {
                        return(
                            <div>
                                {this.state['errorMessage']}
                            </div>
                        );
                    }
                })()}

                { /*language=SCSS*/ }
                <style jsx>{`                    
                    .alert {
                        display: flex;
                        flex-direction: column;
                    }
                    
                    .info {
                      margin-top: 1rem;
                    }
                    
                    .to-right {
                      float: right;
                    }
                    
                    .space-left {
                      margin-left: 1rem;
                    } 
                    
                    .member-link, .team-link {
                      margin-right: 1rem;
                    }
                    
                    .action {
                      display: flex;
                      flex-direction: row;
                      justify-content: space-between;
                    }
                    
                    .show-teams {
                      margin-top: 1rem;
                    }
                `}</style>
            </div>
        );
    }
}

export default withNamespaces()(ContestActionBar);