import React from "react";
import Router from 'next/router';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import config from "../configs/keys";

class MyAccount extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {
            loading: true,
        };

        this.fetchSetState = this.fetchSetState.bind(this);
        this.prepareState = this.prepareState.bind(this);
        this.closeError = this.closeError.bind(this);
        this.changeUsername = this.changeUsername.bind(this);
        this.updateUsernameState = this.updateUsernameState.bind(this);
    }

    async componentDidMount() {
        await this.fetchSetState();
    }

    async fetchSetState() {
        const request = {
            method: 'GET',
            mode: 'cors',
            credentials: "include"
        };

        try {
            let response = await fetch(config.API_URL + '/api/account', request);

            if (response.status === 401) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unauthorized.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 200) {
                let responseJson = await response.json();
                await this.prepareState(responseJson);
                await this.setState({ loading: false });
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
        await this.setState({ account: responseJson });
    }

    closeError(e) {
        e.target.parentElement.setAttribute('style', 'display: none;');
    }

    async changeUsername(e) {
        let username_input = document.getElementById('username');

        if(username_input.readOnly === true) {
            e.target.innerText = 'Save';
            username_input.readOnly = false;
        } else {
            const request = {
                method: 'PUT',
                mode: 'cors',
                credentials: "include"
            };

            let new_username = document.getElementById("username").value;

            if (new_username && new_username.length > 5) {
                try {
                    let response = await fetch(config.API_URL + '/api/users/' + new_username, request);

                    if (response.status === 401) {
                        document.getElementsByClassName('error-content')[0].innerHTML = 'Unauthorized.';
                        document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
                    } else if (response.status === 200) {
                        username_input.readOnly = "true";
                        Router.push('/login');
                    } else {
                        document.getElementsByClassName('error-content')[0].innerHTML = 'Unknown error. Check the fields and try again.';
                        document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
                    }
                } catch (e) {
                    document.getElementsByClassName('error-content')[0].innerHTML += e.message;
                    document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
                }
            } else {
                document.getElementsByClassName('error-content')[0].innerHTML = "Username should be at least 6 chars long.";
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            }
        }
    }

    async updateUsernameState(e) {
        let account = this.state['account'];
        account['user']['username'] = e.target.value;
        await this.setState({ account: account });
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

                <form className="form">
                    <fieldset className="form-group">
                        <label htmlFor="username">username:</label>
                        <input id="username"
                               type="text"
                               placeholder="type your username..."
                               className="form-control"
                               value={this.state['account']['user']['username']}
                               readOnly={true}
                               onChange={this.updateUsernameState}
                        />
                        <button type={"button"} className="btn btn-warning" onClick={this.changeUsername}>Change username</button>
                    </fieldset>
                    <fieldset className="form-group">
                        <label htmlFor="email">email:</label>
                        <input id="email"
                               type="email"
                               placeholder=""
                               className="form-control"
                               value={this.state['account']['user']['email']}
                               readOnly={true}
                        />
                        <button type={"button"} className="btn btn-warning">Change email</button>
                    </fieldset>
                    <fieldset className="form-group">
                        <label htmlFor="email">full name:</label>
                        <input id="full-name"
                               type="email"
                               placeholder=""
                               className="form-control"
                               value={this.state['account']['user']['fullName']}
                               readOnly={true}
                        />
                        <button type={"button"} className="btn btn-warning">Change full name</button>
                    </fieldset>
                    <fieldset className="form-group">
                        <label htmlFor="password">password:</label>
                        <input id="password"
                               type="password"
                               value={"##############"}
                               placeholder=""
                               className="form-control"
                               readOnly={true}
                        />
                        <button type={"button"} className="btn btn-warning">Change password</button>
                    </fieldset>
                </form>

                <div className={"status"}>
                    <h2>wined contests: { this.state['account']['winedContestsCount'] } </h2>
                    <h2>puzzles solved: { this.state['account']['puzzlesSolvedCount'] } </h2>
                    <h2>contests enrolled at: { this.state['account']['contestsEnrolledAt'].length } </h2>
                    <div className={"list"}>
                        {
                            this.state['account']['contestsEnrolledAt'].map((contest) => {
                                return(<div>{ contest['name'] }</div>)
                            })
                        }
                    </div>
                    <h2>created contests: { this.state['account']['createdContests'].length } </h2>
                    <div className={"list"}>
                        {
                            this.state['account']['createdContests'].map((contest) => {
                                return(<div>{ contest['name'] }</div>)
                            })
                        }
                    </div>
                    <h2>created puzzles: { this.state['account']['createdPuzzles'].length } </h2>
                    <div className={"list"}>
                        {
                            this.state['account']['createdPuzzles'].map((puzzle) => {
                                return(<a key={puzzle['id']}>{ puzzle['name'] }</a>)
                            })
                        }
                    </div>
                    <h2>created teams: { this.state['account']['createdTeams'].length } </h2>
                    <div className={"list"}>
                        {
                            this.state['account']['createdTeams'].map((team) => {
                                return(<a key={team['id']}>{ team['name'] }</a>)
                            })
                        }
                    </div>
                    <h2>puzzle sessions: { this.state['account']['puzzleSessions'].length } </h2>
                    <div className={"list"}>
                        {
                            this.state['account']['puzzleSessions'].map((session) => {
                                return(<a key={session['id']}>{ session['puzzle']['name'] }</a>)
                            })
                        }
                    </div>
                    <h2>teams member of: { this.state['account']['teamsMemberOf'].length } </h2>
                    <div className={"list"}>
                        {
                            this.state['account']['teamsMemberOf'].map((team) => {
                                return(<a key={team['id']}>{ team['name'] }</a>)
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
                `}</style>
            </div>
        );
    }
}

export default withNamespaces()(MyAccount);