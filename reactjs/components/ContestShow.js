import React from "react";

import '../i18n';
import { withNamespaces } from 'react-i18next';
import config from "../configs/keys";
import { timeConverter } from '../utlis/utlis';

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
        await this.setState({contestName: responseJson['name']});
        await this.setState({puzzleName: responseJson['puzzle']['name']});
        await this.setState({startsAt: timeConverter(parseInt(responseJson['startsAt']['timestamp']))});
        await this.setState({finishesAt: timeConverter(parseInt(responseJson['finishesAt']['timestamp']))});

        await this.setState({createdAt: timeConverter(parseInt(responseJson['createdAt']['timestamp']))});
        await this.setState({createdBy: responseJson['createdBy']['user']['fullName']});
        await this.setState({enrolledPlayers: responseJson['enrolledPlayers']});
        await this.setState({enrolledTeams: responseJson['enrolledTeams']});

        await this.setState({loading: false});
        console.log(this.state);
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

                <h2>name: {this.state['contestName']} </h2>
                <h2>puzzle: {this.state['puzzleName']} </h2>
                <h2>starts at: {this.state['startsAt']} </h2>
                <h2>finishes at: {this.state['finishesAt']} </h2>
                <h2>created: {this.state['createdAt']} </h2>
                <h2>created by: {this.state['createdBy']} </h2>

                <h2>enrolled players:</h2>
                <div className={'tags'}>
                    {
                        this.state['enrolledPlayers'].map((player) => {
                            return(
                                <a key={player['user']['fullName']} className={'tag-link'}>{player['user']['fullName']}</a>
                            )
                        })
                    }
                </div>

                <h2>enrolled teams:</h2>
                <div className={'tags'}>
                    {
                        this.state['enrolledTeams'].map((team) => {
                            return(
                                <a key={team['name']} className={'tag-link'}>{team['name']}</a>
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