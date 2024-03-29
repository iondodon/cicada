import React from "react";

import '../i18n';
import { withNamespaces } from 'react-i18next';
import config from "../configs/keys";
import Cookies from 'js-cookie';
import Link from 'next/link'

class ContestShow extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {
            loading: true,
        };

        this.deleteTeam = this.deleteTeam.bind(this);
        this.fetchSetState = this.fetchSetState.bind(this);
        this.prepareState = this.prepareState.bind(this);
        this.removeTeamSession = this.removeTeamSession.bind(this);
        this.closeError = this.closeError.bind(this);
    }

    async componentDidMount() {
        await this.fetchSetState();
    }

    async fetchSetState() {
        const urlParams = new URLSearchParams(window.location.search);
        this.teamId = urlParams.get('teamId');

        const request = {
            method: 'GET',
            mode: 'cors',
            credentials: "include"
        };

        try {
            let response = await fetch(config.API_URL + '/api/teams/' + this.teamId, request);

            if (response.status === 401) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unauthorized.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 204) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Such team doesn\'t exist.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 200) {
                await this.prepareState(await response.json());
            } else {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unknown error. Check the fields and try again.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            }
        } catch (e) {
            document.getElementsByClassName('error-content')[0].innerHTML += e.message;
            document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
        }
    }

    async prepareState(responseJson) {
        await this.setState({teamId: responseJson['id']});
        await this.setState({teamName: responseJson['name']});
        await this.setState({userId: responseJson['creator']['id']});
        await this.setState({members: responseJson['members']});
        await this.setState({puzzlesSolvedCount: responseJson['puzzlesSolvedCount']});
        await this.setState({winedContestsCount: responseJson['winedContestsCount']});
        await this.setState({puzzleSessions: responseJson['puzzleSessions']});
        await this.setState({creator: responseJson['creator']});
        await this.setState({puzzlesEnrolledAt: responseJson['puzzlesEnrolledAt']});
        await this.setState({contestsEnrolledAt: responseJson['contestsEnrolledAt']});

        await this.setState({loading: false});
    }

    async deleteTeam() {
        const urlParams = new URLSearchParams(window.location.search);
        this.teamId = urlParams.get('teamId');

        const request = {
            method: 'DELETE',
            mode: 'cors',
            credentials: "include"
        };

        try {
            let response = await fetch(config.API_URL + '/api/teams/destroy/' + this.teamId, request);

            if (response.status === 401) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unauthorized.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 204) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Such team doesn\'t exist.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 200) {
                document.location = '/';
            } else {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unknown error. Check the fields and try again.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            }
        } catch (e) {
            document.getElementsByClassName('error-content')[0].innerHTML += e.message;
            document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
        }
    }

    async removeTeamSession(sessionId) {
        const request = {
            method: 'DELETE',
            mode: 'cors',
            credentials: "include"
        };

        try {
            let response = await fetch(config.API_URL + '/api/remove-team-session/' + sessionId, request);

            if (response.status === 401) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unauthorized.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 400) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Something was not found.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 200) {
                await this.fetchSetState();
            } else {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unknown error. Check the fields and try again.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            }
        } catch (e) {
            document.getElementsByClassName('error-content')[0].innerHTML += e.message;
            document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
        }
    }

    closeError(e) {
        e.target.parentElement.setAttribute('style', 'display: none;');
    }

    render(){
        if(this.state.loading) {
            return(
                <div className={"puzzle-data"}>
                    <div className="alert alert-error" style={{ display: 'none' }} >
                        <div className={"error-content"} >Error message</div>
                        {'\u00A0'} <a onClick={this.closeError}>x</a>
                    </div>
                    <h2>loading...</h2>

                    { /*language=SCSS*/ }
                    <style jsx>{`
                      .puzzle-data {
                        display: flex;
                        flex-direction: column;
                      }
    
                      .alert {
                            display: flex;
                            flex-direction: row;
                            text-align: center;
                            margin-top: 2rem;
                            margin-bottom: 0;
                            justify-content: center;
                      }
                    `}</style>
                </div>
            );
        }


        return (
            <div className={"contest-data"} >
                <div className="alert alert-error" style={{ display: 'none' }} >
                    <div className={"error-content"} >Error message</div>
                    {'\u00A0'} <a onClick={this.closeError}>x</a>
                </div>

                <h2>name: {this.state['teamName']} </h2>

                <h2>
                    members:
                    {(()=>{
                        if(this.state['members']) {
                            return(this.state['members'].length);
                        } else {
                            return(0);
                        }
                    })()}
                </h2>
                <div className={'links'}>
                    {
                        this.state['members'].map((member) => {
                            return(
                                <a key={member['user']['fullName']} className={'link'}>{member['user']['fullName']}</a>
                            )
                        })
                    }
                </div>

                <h2>puzzles solved: {this.state['puzzlesSolvedCount']} </h2>
                <h2>wined contests: {this.state['winedContestsCount']} </h2>

                <h2>
                    puzzle sessions:
                    {(()=>{
                        if(this.state['puzzleSessions']) {
                            return(this.state['puzzleSessions'].length);
                        } else {
                            return(0);
                        }
                    })()}
                </h2>
                <div className={'links'}>
                    {
                        this.state['puzzleSessions'].map((session) => {
                            return(
                                <span key={session['id']} >
                                    (
                                    <Link href={{pathname: '/puzzle/show', query: {puzzleId: session['puzzle']['id']} }}>
                                        <a className={'link'}>
                                            {session['puzzle']['name']}
                                            {(()=>{
                                                if(session['contest']) {
                                                    return(
                                                        <span> contest:{session['contest']['name']} </span>
                                                    );
                                                }
                                            })()}
                                        </a>
                                    </Link>
                                        {(() => {
                                            if(this.state['creator']['user']['id'] == Cookies.get('userId',  { domain: config.DOMAIN })) {
                                                return(
                                                    <a onClick={async () => {
                                                        if(confirm("Are you sure?")) {
                                                            await this.removeTeamSession(session['id'])
                                                        }
                                                    }}> remove</a>
                                                );
                                            }
                                        })()}
                                    )
                                </span>
                            )
                        })
                    }
                </div>

                <h2>creator:
                    <Link href={{pathname: '/account/show', query: {fullName: this.state['creator']['user']['fullName'] }}}>
                        <a>{this.state['creator']['user']['fullName']}</a>
                    </Link>
                </h2>

                {(()=>{
                    if(this.state['userId'] == Cookies.get('userId',  { domain: config.DOMAIN })) {
                        return(
                            <div className="alert alert-info">
                                <button className="btn btn-primary btn-ghost update-btn"
                                        onClick={()=>{
                                            document.location = '/team/update?teamId=' + this.state['teamId'];
                                        }}
                                >Update</button>
                                <button className="btn btn-error btn-ghost delete-btn"
                                        onClick={async ()=>{
                                            if(confirm("Are you sure?")) {
                                                await this.deleteTeam();
                                            }
                                        }}
                                >Delete</button>
                            </div>
                        );
                    }
                })()}

                { /*language=SCSS*/ }
                <style jsx>{`
                  .contest-data {
                    display: flex;
                    flex-direction: column;
                  }
                  
                  .links {
                    margin-bottom: 2rem;
                  }
                  
                  .link {
                    margin-right: 0.5rem;
                  }
                  
                  .alert {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-around;
                        margin-top: 2rem;
                        margin-bottom: 0;
                  }
                  
                  .update-btn {
                       width: 70%;
                       margin-right: 1px;
                  }
                  
                  .delete-btn {
                    width: 30%;
                    margin-left: 1px;
                  }
                `}</style>
            </div>
        );
    }
}

export default withNamespaces()(ContestShow);