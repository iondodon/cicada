import React from "react";

import '../i18n';
import { withNamespaces } from 'react-i18next';
import config from "../configs/keys";
import Link from 'next/link';

class AccountShow extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {
            loading: true
        };

        this.fetchSetState = this.fetchSetState.bind(this);
        this.prepareState = this.prepareState.bind(this);
        this.closeError = this.closeError.bind(this);
    }

    async componentDidMount() {
        await this.fetchSetState();
    }

    async fetchSetState() {
        const urlParams = new URLSearchParams(window.location.search);
        this.fullName = urlParams.get('fullName');

        const request = {
            method: 'GET',
            mode: 'cors',
            credentials: "include"
        };

        try {
            let response = await fetch(config.API_URL + '/api/account/show/' + this.fullName, request);

            if (response.status === 401) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unauthorized.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 200) {
                let responseJson = await response.json();
                await this.prepareState(responseJson);
                await this.setState({ loading: false });
            } else {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unknown error.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            }
        } catch (e) {
            document.getElementsByClassName('error-content')[0].innerHTML += e.message;
            document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
        }
    }

    async prepareState(responseJson) {
        await this.setState({ account: responseJson });
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
            <div className={"account-info"} >
                <div className="alert alert-error" style={{ display: 'none' }} >
                    <div className={"error-content"} >Error message</div>
                    {'\u00A0'} <a onClick={this.closeError}>x</a>
                </div>

                <h2>username: {this.state['account']['user']['username']}</h2>
                <h2>email: {this.state['account']['user']['email']}</h2>
                <h2>full name: {this.state['account']['user']['fullName']}</h2>

                <div className={"status"}>
                    <h2>wined contests: { this.state['account']['winedContestsCount'] } </h2>
                    <h2>puzzles solved: { this.state['account']['puzzlesSolvedCount'] } </h2>
                    <h2>created contests: { this.state['account']['createdContests'].length } </h2>
                    <div className={"list"}>
                        {
                            this.state['account']['createdContests'].map((contest) => {
                                return(
                                    <Link key={contest['id']} href={{ pathname: '/contest/show', query: {contestId: contest['id']} }}>
                                        <a>{ contest['name'] }</a>
                                    </Link>
                                )
                            })
                        }
                    </div>
                    <h2>created puzzles: { this.state['account']['createdPuzzles'].length } </h2>
                    <div className={"list"}>
                        {
                            this.state['account']['createdPuzzles'].map((puzzle) => {
                                return(
                                    <Link key={puzzle['id']} href={{ pathname: '/puzzle/show', query: {puzzleId: puzzle['id']} }}>
                                        <a>{ puzzle['name'] }</a>
                                    </Link>
                                )
                            })
                        }
                    </div>
                    <h2>created teams: { this.state['account']['createdTeams'].length } </h2>
                    <div className={"list"}>
                        {
                            this.state['account']['createdTeams'].map((team) => {
                                return(
                                    <a>{ team['name'] }</a>
                                )
                            })
                        }
                    </div>
                    <h2>puzzle sessions: { this.state['account']['puzzleSessions'].length } </h2>
                    <div className={"list"}>
                        {
                            this.state['account']['puzzleSessions'].map((session) => {
                                return(
                                    <Link key={session['id']} href={{ pathname: '/puzzle/show', query: {puzzleId: session['puzzle']['id']} }}>
                                        <a>
                                            { session['puzzle']['name'] }
                                            {(()=>{
                                                if(session['contest']) {
                                                    return(
                                                        <span> {"contest: " + session['contest']['name']} </span>
                                                    );
                                                }
                                            })()}
                                        </a>
                                    </Link>
                                )
                            })
                        }
                    </div>
                    <h2>teams member of: { this.state['account']['teamsMemberOf'].length } </h2>
                    <div className={"list"}>
                        {
                            this.state['account']['teamsMemberOf'].map((team) => {
                                return(
                                    <a>{ team['name'] }</a>
                                )
                            })
                        }
                    </div>
                </div>

                { /*language=SCSS*/ }
                <style jsx>{`                    
                    form {
                      width: 100%;
                    }
                    
                    .list {
                      margin-bottom: 2rem;
                    }
                    
                    button {
                      float: right;
                    }
                    
                    .status {
                      margin-top: 2rem;
                    }
                    
                    .account-info {
                      display: flex;
                      flex-direction: column;
                    }
                    
                    a {
                      margin-right: 0.5rem;
                    }
                    
                    .action {
                      display: flex;
                      float: right;
                    }
                    
                    .cancel {
                        margin-right: 2rem;
                    }
                    
                    #change-username-btn,
                    #change-email-btn,
                    #change-fullName-btn,
                    #change-password-btn {
                      min-width: 148px;
                    }
                `}</style>
            </div>
        );
    }
}

export default withNamespaces()(AccountShow);