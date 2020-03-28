import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import config from "../configs/keys";
import StageShow from "./StageShow";

class PuzzleSession extends React.Component {

    constructor(props, {t}) {
        super(props, {t});
        this.t = t;

        this.state = {
            enrolled: false,
            showTeamsMemberOf: false,
            error: false,
            errorMessage: null,
            sessions: null,
            session: null
        };

        const urlParams = new URLSearchParams(window.location.search);
        this.puzzleId = urlParams.get('puzzleId');

        this.enrollSinglePlayer = this.enrollSinglePlayer.bind(this);
        this.showTeamsMemberOf = this.showTeamsMemberOf.bind(this);
        this.enrollTeam = this.enrollTeam.bind(this);
        this.singlePlayerLeavePuzzle = this.singlePlayerLeavePuzzle.bind(this);
        this.leaveTeam = this.leaveTeam.bind(this);
        this.selectSession = this.selectSession.bind(this);
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

    async getSessions() {
        const request = {
            method: 'GET',
            mode: 'cors',
            credentials: 'include'
        };

        try {
            let response = await fetch(config.API_URL + '/api/puzzle/get-sessions/' + this.puzzleId, request);
            let responseJson = await response.json();

            if(response.status === 200){
                await this.setState({sessions: responseJson});
                await this.setState({session: responseJson[0]});
                if(this.state['sessions']) {
                    await this.setState({enrolled: true});
                }
                await this.setState({error: false});
            } else {
                // await this.setState({error: true});
                // await this.setState({errorMessage: responseJson['message']});
            }

        } catch(e) {
            await this.setState({error: true});
            await this.setState({errorMessage: e});
        }
    }


    async componentDidMount() {
        await this.getSessions();
    }

    async enrollSinglePlayer() {
        const request = {
            method: 'POST',
            mode: 'cors',
            credentials: 'include'
        };

        try {
            let response = await fetch(config.API_URL + '/api/puzzle/enroll-single-player/' + this.puzzleId, request);
            let responseJson = await response.json();
            if(response.status === 200){
                await this.setState({session: responseJson});
                await this.setState({enrolled: true});
                await this.setState({error: false});
                await this.getSessions();
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
            let response = await fetch(config.API_URL + '/api/puzzle/enroll-team/' + this.puzzleId + '/' + teamId, request);
            let responseJson = await response.json();

            if(response.status === 200){
                await this.setState({session: responseJson});
                await this.setState({showTeamsMemberOf: false});
                await this.setState({enrolled: true});
                await this.setState({error: false});
                await this.getSessions();
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
            let response = await fetch(config.API_URL + '/api/teams/leave-team/' + this.state['session']['teamPlayer']['id'], request);
            let responseJson = await response.json();

            if(response.status === 200){
                await this.setState({session: null});
                await this.setState({showTeamsMemberOf: false});
                await this.setState({enrolled: false});
                await this.setState({error: false});
                await this.getSessions();
            } else {
                await this.setState({error: true});
                await this.setState({errorMessage: responseJson['message']});
            }
        } catch(e) {
            await this.setState({error: true});
            await this.setState({errorMessage: e});
        }
    }

    async singlePlayerLeavePuzzle() {
        const request = {
            method: 'POST',
            mode: 'cors',
            credentials: 'include'
        };

        try {
            let response = await fetch(config.API_URL + '/api/single-player-leave-puzzle/' + this.puzzleId, request);
            let responseJson = await response.json();

            if(response.status === 200){
                await this.setState({session: null});
                await this.setState({showTeamsMemberOf: false});
                await this.setState({enrolled: false});
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

    async selectSession(sessionIndex) {
        await this.setState({session: this.state['sessions'][sessionIndex]});
    }

    render() {

        return(
            <div className="alert alert-warning">

                {(()=>{
                    if(this.state['enrolled'] && this.state['sessions']){
                        return(
                            <div>
                                <div>
                                    ## select session:
                                    {
                                        this.state.sessions.map((sess, index) => {
                                            if(sess['singlePlayer']) {
                                                return(
                                                    <a className={"team_anchor"}
                                                       key={sess['id']}
                                                       value={index}
                                                       onClick={async () => await this.selectSession(index)}>
                                                        Solo
                                                        {(()=>{
                                                           if(sess['contest']) {
                                                               return(<span> contest:{sess['contest']['name']}</span>);
                                                           }
                                                        })()}
                                                    </a>
                                                );
                                            } else if(sess['teamPlayer']) {
                                                return(
                                                    <a className={"team_anchor"} key={sess['id']} value={index} onClick={async () => await this.selectSession(index)}>
                                                        team:{sess['teamPlayer']['name']}
                                                        {(()=>{
                                                            if(sess['contest']) {
                                                                return(<span> contest:{sess['contest']['name']}</span>);
                                                            }
                                                        })()}
                                                    </a>
                                                );
                                            }
                                        })
                                    }
                                </div>

                                <br/>

                                {(()=>{
                                    if(this.state['session']){
                                        return(
                                            <div>
                                                <h2>progress: {this.state['session']['completeness']}
                                                    /
                                                    {(()=>{
                                                        if(this.state['session']['puzzle'] && this.state['session']['puzzle']['stagesCount']) {
                                                            return(this.state['session']['puzzle']['stagesCount']);
                                                        } else {
                                                            return null;
                                                        }
                                                    })()}

                                                </h2>
                                                {(()=>{
                                                    if(this.state['session']['teamPlayer']){
                                                        return(
                                                            <div>
                                                                <h2>team: {this.state['session']['teamPlayer']['name']} </h2>
                                                                ## members:
                                                                {
                                                                    this.state['session']['teamPlayer']['members'].map((member) => {
                                                                        return (
                                                                            <a key={member['user']['id']}
                                                                               className={"member-link"}
                                                                            > {member['user']['fullName']} </a>
                                                                        );
                                                                    })
                                                                }
                                                            </div>
                                                        );
                                                    }
                                                })()}


                                                {(()=>{
                                                    if(this.state['session'] && this.state['session']['puzzle'] && this.state['session']['puzzle']['stages']) {
                                                        return(
                                                            <div className={"stages-cards"}>
                                                                <br/>
                                                                <h2>stages:</h2>
                                                                {
                                                                    this.state['session']['puzzle']['stages'].map((stage) => {
                                                                        if(stage['level'] <= this.state['session']['completeness']) {
                                                                            return (
                                                                                <StageShow
                                                                                    completeness={this.state['session']['completeness']}
                                                                                    key={stage['id']}
                                                                                    stageId={stage['id']}
                                                                                    sessionId={this.state['session']['id']}
                                                                                    level={stage['level']}
                                                                                    description={stage['description']}
                                                                                    code={stage['code']}
                                                                                />
                                                                            );
                                                                        }
                                                                    })
                                                                }
                                                            </div>
                                                        );
                                                    }
                                                })()}

                                                {(()=>{
                                                    if(!this.state['session']['teamPlayer'] && !this.state['showTeamsMemberOf']) {
                                                        return(
                                                            <div className={"to-right space-left"}>
                                                                <br/>
                                                                <a onClick={this.showTeamsMemberOf}>Solve in a team</a>
                                                            </div>
                                                        );
                                                    } else {
                                                        return(
                                                            <div className={"to-right space-left"}>
                                                                <br/>
                                                                <a onClick={this.enrollSinglePlayer}>Solve solo</a>
                                                            </div>
                                                        );
                                                    }
                                                })()}

                                                {(()=>{
                                                    if(this.state['session']['teamPlayer']) {
                                                        return(
                                                            <div className={"to-right"}>
                                                                <br/>
                                                                <a onClick={async () => {
                                                                    if(confirm("Are you sure?")) {
                                                                        await this.leaveTeam();
                                                                    }
                                                                }} >Leave team {this.state['session']['teamPlayer']['name']}</a>
                                                            </div>
                                                        );
                                                    } else if(this.state['session']['singlePlayer']) {
                                                        return(
                                                            <div className={"to-right"}>
                                                                <br/>
                                                                <a onClick={async () => {
                                                                    if(confirm("Are you sure?")) {
                                                                        await this.singlePlayerLeavePuzzle();
                                                                    }
                                                                }} >Remove session</a>
                                                            </div>
                                                        );
                                                    }
                                                })()}
                                            </div>
                                        );
                                    }
                                })()}

                            </div>
                        );
                    } else {
                        return(
                            <div className={"action"}>
                                <button className="btn btn-warning btn-ghost"
                                        onClick={this.enrollSinglePlayer}>Solve solo</button>
                                <button className="btn  btn-warning btn-ghost"
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
                    
                    .team_anchor {
                      margin-right: 1rem;
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
                    
                    .show-teams {
                      margin-top: 1rem;
                    }
                    
                    .action {
                      display: flex;
                      flex-direction: row;
                      justify-content: space-between;
                    }
                `}</style>
            </div>
        );
    }
}

export default withNamespaces()(PuzzleSession);