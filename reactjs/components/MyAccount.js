import React from "react";

import '../i18n';
import { withNamespaces } from 'react-i18next';
import config from "../configs/keys";

class PuzzleShow extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {
            loading: true,
        };

        this.fetchSetState = this.fetchSetState.bind(this);
        this.prepareState = this.prepareState.bind(this);
        this.closeError = this.closeError.bind(this);
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
                console.log(responseJson);
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
                        />
                        <button className="btn btn-warning">Change username</button>
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
                        <button className="btn btn-warning">Change email</button>
                    </fieldset>
                    <fieldset className="form-group">
                        <label htmlFor="email">full name:</label>
                        <input id="email"
                               type="email"
                               placeholder=""
                               className="form-control"
                               value={this.state['account']['user']['fullName']}
                               readOnly={true}
                        />
                        <button className="btn btn-warning">Change full name</button>
                    </fieldset>
                    <fieldset className="form-group">
                        <label htmlFor="email">password:</label>
                        <input id="email"
                               type="email"
                               value={"##############"}
                               placeholder=""
                               className="form-control"
                               readOnly={true}
                        />
                        <button className="btn btn-warning">Change password</button>
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
                                return(<a>{ puzzle['name'] }</a>)
                            })
                        }
                    </div>
                    <h2>created teams: { this.state['account']['createdTeams'].length } </h2>
                    <div className={"list"}>
                        {
                            this.state['account']['createdTeams'].map((team) => {
                                return(<a>{ team['name'] }</a>)
                            })
                        }
                    </div>
                    <h2>puzzle sessions: { this.state['account']['puzzleSessions'].length } </h2>
                    <div className={"list"}>
                        {
                            this.state['account']['puzzleSessions'].map((session) => {
                                return(<a>{ session['puzzle']['name'] }</a>)
                            })
                        }
                    </div>
                    <h2>teams member of: { this.state['account']['teamsMemberOf'].length } </h2>
                    <div className={"list"}>
                        {
                            this.state['account']['teamsMemberOf'].map((team) => {
                                return(<a>{ team['name'] }</a>)
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

export default withNamespaces()(PuzzleShow);