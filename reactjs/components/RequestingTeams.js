import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import config from "../configs/keys";


class RequestingTeams extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {
            requestingTeams: [],
            loading: true
        };

        this.getRequestingTeams = this.getRequestingTeams.bind(this);
        this.closeError = this.closeError.bind(this);
        this.removeRequestingTeam = this.removeRequestingTeam.bind(this);
    }

    componentDidMount() {
        this.getRequestingTeams().then();
    }

    async removeRequestingTeam(teamId) {
        const findRequestingTeam = (id, array) => {
            for(let i = 0; i < array.length; i++) {
                if(array[i]['id'] === id) {
                    return i;
                }
            }
        };

        let requestingTeams = this.state.requestingTeams;
        let index = findRequestingTeam(teamId, requestingTeams);
        requestingTeams.splice(index,1);
        await this.setState({notifications: requestingTeams});
    }

    async getRequestingTeams() {
        const request = {
            method: 'GET',
            mode: 'cors',
            credentials: 'include'
        };

        try {
            let response = await fetch(config.API_URL + '/api/account/requesting_teams', request);

            if (response.status === 401) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unauthorized.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 500) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Server error.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 200) {
                let requestingTeamsJson = await response.json();
                await this.setState({requestingTeams: requestingTeamsJson});
                await this.setState({loading: false});
            } else {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unknown error.';
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
        if(this.state.loading){
            return(
                <div className={"requesting-teams"}>
                    <div className="alert alert-error" style={{ display: 'none' }} >
                        <div className={"error-content"} >Error message</div>
                        {'\u00A0'} <a onClick={this.closeError}>x</a>
                    </div>
                    <h2>loading...</h2>

                    { /*language=SCSS*/ }
                    <style jsx>{`
                      .alert {
                            display: flex;
                            flex-direction: row;
                            text-align: center;
                            margin-top: 2rem;
                            margin-bottom: 0;
                            justify-content: center;
                      }
                      
                      .requesting-teams {
                        display: flex;
                        flex-direction: column;
                        width: 100%;
                      }
                      
                      h2 {
                        margin-top: 1rem;
                      }
                    `}
                    </style>
                </div>
            );
        }

        if(this.state.requestingTeams.length === 0) {
            return(<h2> empty </h2>);
        }

        return (
            <div className={"requesting-teams"}>

                <div className="alert alert-error" style={{ display: 'none' }} >
                    <div className={"error-content"} >Error message</div>
                    {'\u00A0'} <a onClick={this.closeError}>x</a>
                </div>

                {
                    this.state.requestingTeams.map((team) => {
                        return(
                            <div className="alert alert-warning">
                                <div className={"message"}>
                                    Someone invited you in the team { team['name'] }?
                                </div>
                                <div className={"action"}>
                                    <button className="btn btn-primary">Accept</button>
                                    <button className="btn btn-error">Decline</button>
                                </div>
                            </div>
                        );
                    })
                }

                { /*language=SCSS*/ }
                <style jsx>{`
                  .alert {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                  }
                  
                  .message {
                    display: flex;
                    place-items: center;
                  }
                  
                  .requesting-teams {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                  }
                `}</style>
            </div>
        );
    }
}

export default withNamespaces()(RequestingTeams);