import React from "react";

import '../i18n';
import { withNamespaces } from 'react-i18next';
import config from "../configs/keys";
import { timeConverter } from '../utlis/utlis';
import ContestActionBar from "./ContestActionBar";
import Link from 'next/link';
import {getCookie} from "../utlis/utlis";
import PuzzleSession from "./PuzzleSession";

class ContestShow extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {
            loading: true,
        };

        this.fetchSetState = this.fetchSetState.bind(this);
        this.prepareState = this.prepareState.bind(this);
        this.closeError = this.closeError.bind(this);
        this.deleteContest = this.deleteContest.bind(this);
    }

    async componentDidMount() {
        await this.fetchSetState();
    }

    async fetchSetState() {
        const urlParams = new URLSearchParams(window.location.search);
        this.contestId = urlParams.get('contestId');

        const request = {
            method: 'GET',
            mode: 'cors',
            credentials: "include"
        };

        try {
            let response = await fetch(config.API_URL + '/api/contests/' + this.contestId, request);

            if (response.status === 401) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unauthorized.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 204) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Such puzzle doesn\'t exist.';
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
        await this.setState({contestId: responseJson['id']});
        await this.setState({contestName: responseJson['name']});
        await this.setState({puzzleName: responseJson['puzzle']['name']});
        await this.setState({puzzleId: responseJson['puzzle']['id']});
        await this.setState({startsAt: timeConverter(parseInt(responseJson['startsAt']['timestamp']))});
        await this.setState({finishesAt: timeConverter(parseInt(responseJson['finishesAt']['timestamp']))});
        await this.setState({createdAt: timeConverter(parseInt(responseJson['createdAt']['timestamp']))});
        await this.setState({createdBy: responseJson['createdBy']['user']['fullName']});
        await this.setState({userId: responseJson['createdBy']['id']});
        await this.setState({enrolledPlayers: responseJson['enrolledPlayers']});
        await this.setState({enrolledTeams: responseJson['enrolledTeams']});
        await this.setState({singlePlayerWinner: responseJson['singlePlayerWinner']});
        await this.setState({teamWinner: responseJson['teamWinner']});

        await this.setState({loading: false});
        console.log(this.state);
    }

    closeError(e) {
        e.target.parentElement.setAttribute('style', 'display: none;');
    }

    async deleteContest() {
        const urlParams = new URLSearchParams(window.location.search);
        this.contestId = urlParams.get('contestId');

        const request = {
            method: 'DELETE',
            mode: 'cors',
            credentials: "include"
        };

        try {
            let response = await fetch(config.API_URL + '/api/contests/destroy/' + this.contestId, request);

            if (response.status === 401) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unauthorized.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 204) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Such contest doesn\'t exist.';
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

                <h2>name: {this.state['contestName']} </h2>

                <Link href={{pathname: '/puzzle/show', query: {puzzleId: this.state['puzzleId']} }}>
                    <h2>puzzle: <a> {this.state['puzzleName']} </a> </h2>
                </Link>{' '}

                <h2>starts at: {this.state['startsAt']} </h2>
                <h2>finishes at: {this.state['finishesAt']} </h2>
                <h2>created: {this.state['createdAt']} </h2>
                <h2>created by: {this.state['createdBy']} </h2>

                <h2>enrolled players:</h2>
                <div className={'links'}>
                    {
                        this.state['enrolledPlayers'].map((player) => {
                            return(
                                <a key={player['user']['fullName']} className={'link'}>{player['user']['fullName']}</a>
                            )
                        })
                    }
                </div>

                <h2>enrolled teams:</h2>
                <div className={'links'}>
                    {
                        this.state['enrolledTeams'].map((team) => {
                            return(
                                <Link  key={team['id']} href={{pathname: '/team/show', query: {teamId: team['id']} }}>
                                    <a className={'link'}>{team['name']}</a>
                                </Link>
                            )
                        })
                    }
                </div>

                {(()=>{
                    if(this.state['singlePlayerWinner'] && this.state['singlePlayerWinner']['user']) {
                        return(
                            <h2>
                                single player winner: <a>{this.state['singlePlayerWinner']['user']['fullName']}</a>
                            </h2>
                        );
                    }
                })()}

                {(()=>{
                    if(this.state['teamWinner'] && this.state['teamWinner']['name']) {
                        return(
                            <h2>
                                team winner:{' '}
                                <Link  key={this.state['teamWinner']['id']} href={{pathname: '/team/show', query: {teamId: this.state['teamWinner']['id']} }}>
                                    <a>{this.state['teamWinner']['name']} </a>
                                </Link>
                            </h2>
                        );
                    }
                })()}

                {(()=>{
                    if(getCookie('userId').length > 0) {
                        if(this.state['puzzleId']) {
                            return(<ContestActionBar puzzleId={this.state['puzzleId']} />);
                        }
                    }
                })()}

                {(()=>{
                    if(this.state['userId'] == getCookie('userId')) {
                        return(
                            <div className="alert alert-info">
                                <div className="btn-group">
                                    <button className="btn btn-primary btn-ghost update-btn"
                                            onClick={()=>{
                                                document.location = '/contest/update?contestId=' + this.state['contestId'];
                                            }}
                                    >Update</button>
                                    <button className="btn btn-error btn-ghost"
                                            onClick={async ()=>{
                                                if(confirm("Are you sure?")) {
                                                    await this.deleteContest();
                                                }
                                            }}
                                    >Delete</button>
                                </div>
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
                  
                  .update-btn {
                    margin-right: 1rem;
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
                        text-align: center;
                        margin-top: 2rem;
                        margin-bottom: 0;
                        justify-content: center;
                  }
                `}</style>
            </div>
        );
    }
}

export default withNamespaces()(ContestShow);