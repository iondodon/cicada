import React from "react";

import '../i18n';
import { withNamespaces } from 'react-i18next';
import config from "../configs/keys";

class ContestShow extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {
            loading: true,
        };
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
        await this.setState({teamName: responseJson['name']});
        await this.setState({members: responseJson['members']});
        await this.setState({puzzlesSolvedCount: responseJson['puzzlesSolvedCount']});
        await this.setState({winedContestsCount: responseJson['winedContestsCount']});
        await this.setState({puzzleSessions: responseJson['puzzleSessions']});
        await this.setState({creator: responseJson['creator']});
        await this.setState({puzzlesEnrolledAt: responseJson['puzzlesEnrolledAt']});
        await this.setState({contestsEnrolledAt: responseJson['contestsEnrolledAt']});

        await this.setState({loading: false});
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

                <h2>members:</h2>
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
                <h2>wined contests: {this.state['winedContestsCount']}</h2>

                <h2>puzzle sessions: </h2>
                <div className={'links'}>
                    {
                        this.state['puzzleSessions'].map((session) => {
                            return(
                                <a key={session['puzzle']['name']} className={'link'}>{session['puzzle']['name']}</a>
                            )
                        })
                    }
                </div>

                <h2>creator: {this.state['creator']['user']['fullName']}</h2>

                <h2>contests enrolled at: </h2>
                <div className={'links'}>
                    {
                        this.state['contestsEnrolledAt'].map((contest) => {
                            return(
                                <a key={contest['name']} className={'link'}>{contest['name']}</a>
                            )
                        })
                    }
                </div>

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