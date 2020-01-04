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
            changingPassword: false,
            newPassword: '',
            confirmNewPassword: '',
            oldPassword: '############'
        };

        this.fetchSetState = this.fetchSetState.bind(this);
        this.prepareState = this.prepareState.bind(this);
        this.closeError = this.closeError.bind(this);
        this.changeUsername = this.changeUsername.bind(this);
        this.updateUsernameState = this.updateUsernameState.bind(this);
        this.updateEmailState = this.updateEmailState.bind(this);
        this.changeEmail = this.changeEmail.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.updateFullNameState = this.updateFullNameState.bind(this);
        this.changeFullName = this.changeFullName.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.showTypeNewPassword = this.showTypeNewPassword.bind(this);
        this.cancelChangeUsername = this.cancelChangeUsername.bind(this);
        this.cancelChangeEmail = this.cancelChangeEmail.bind(this);
        this.cancelChangeFullName = this.cancelChangeFullName.bind(this);
        this.cancelChangePassword = this.cancelChangePassword.bind(this);
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
        e.persist();
        document.getElementById('cancel-change-username').setAttribute('style', 'display: inline');
        let username_input = document.getElementById('username');

        if(username_input.readOnly === true) {
            e.target.innerText = 'Save';
            username_input.readOnly = false;
            await this.setState({usernameTemp: this.state['account']['user']['username']});
        } else {
            const request = {
                method: 'PUT',
                mode: 'cors',
                credentials: "include"
            };

            let new_username = document.getElementById("username").value;

            if (new_username && new_username.length > 5) {
                try {
                    let response = await fetch(config.API_URL + '/api/users/username/' + new_username, request);

                    if (response.status === 401) {
                        document.getElementsByClassName('error-content')[0].innerHTML = 'Unauthorized.';
                        document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
                    } else if (response.status === 200) {
                        username_input.readOnly = "true";
                        document.getElementById('cancel-change-username').setAttribute('style', 'display: none');
                        //TODO: logout
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

    async changeEmail(e) {
        e.persist();
        document.getElementById('cancel-change-email').setAttribute('style', 'display: inline');
        let email_input = document.getElementById('email');

        if(email_input.readOnly === true) {
            e.target.innerText = 'Save';
            email_input.readOnly = false;
            await this.setState({emailTemp: this.state['account']['user']['email']});
        } else {
            if(!this.validateEmail(this.state['account']['user']['email'])) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Invalid email format.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
                return;
            }

            const request = {
                method: 'PUT',
                mode: 'cors',
                credentials: "include"
            };

            let new_email = document.getElementById("email").value;

            if (new_email && new_email.length > 5) {
                try {
                    let response = await fetch(config.API_URL + '/api/users/email/' + new_email, request);

                    if (response.status === 401) {
                        document.getElementsByClassName('error-content')[0].innerHTML = 'Unauthorized.';
                        document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
                    } else if (response.status === 200) {
                        document.getElementById('cancel-change-email').setAttribute('style', 'display: none');
                        email_input.readOnly = "true";
                        e.target.innerText = 'Change email';
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

    async changeFullName(e) {
        e.persist();
        document.getElementById('cancel-change-fullName').setAttribute('style', 'display: inline');
        let fullName_input = document.getElementById('full-name');

        if(fullName_input.readOnly === true) {
            e.target.innerText = 'Save';
            fullName_input.readOnly = false;
            await this.setState({fullNameTemp: this.state['account']['user']['fullName']});
        } else {
            const request = {
                method: 'PUT',
                mode: 'cors',
                credentials: "include"
            };

            let new_fullName = document.getElementById("full-name").value;

            try {
                let response = await fetch(config.API_URL + '/api/users/full_name/' + new_fullName, request);

                if (response.status === 401) {
                    document.getElementsByClassName('error-content')[0].innerHTML = 'Unauthorized.';
                    document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
                } else if (response.status === 200) {
                    fullName_input.readOnly = "true";
                    e.target.innerText = 'Change full name';
                } else {
                    document.getElementsByClassName('error-content')[0].innerHTML = 'Unknown error. Check the fields and try again.';
                    document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
                }
            } catch (e) {
                document.getElementsByClassName('error-content')[0].innerHTML += e.message;
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            }

        }
    }

    async changePassword(e) {
        e.persist();
        document.getElementById('cancel-change-password').setAttribute('style', 'display: inline');
        let oldPasswordInput = document.getElementById('password');

        if(oldPasswordInput.readOnly === true) {
            e.target.innerText = 'Save';
            await this.setState({changingPassword: true});
            await this.setState({oldPassword: ''});
            oldPasswordInput.placeholder = 'old password';
            oldPasswordInput.readOnly = false;
        } else {
            let message = '';
            let good = true;

            if(!this.state['oldPassword'] || this.state['oldPassword'].length < 6) {
                message += 'Old password is too short. Or even not written. ';
                good = false;
            }

            if(!this.state['newPassword'] || this.state['newPassword'].length < 6) {
                message += 'The new password should be at least 6 chard long. ';
                good = false;
            }

            if(this.state['confirmNewPassword'] !== this.state['newPassword']) {
                message += 'Password don\'t match. ';
                good = false;
            }

            if(!good) {
                document.getElementsByClassName('error-content')[0].innerHTML = message;
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else {

                const formData = new URLSearchParams();
                formData.append('old_password', this.state['oldPassword']);
                formData.append('new_password', this.state['newPassword']);

                let headers = new Headers();
                headers.append('Content-Type', 'application/x-www-form-urlencoded');

                const request = {
                    method: 'POST',
                    mode: 'cors',
                    headers: headers,
                    credentials: 'include',
                    body: formData.toString()
                };

                try {
                    let response = await fetch(config.API_URL + '/api/changePassword', request);

                    if(response.status === 401){
                        document.getElementsByClassName('error-content')[0].innerHTML = 'Unauthorised. ';
                        document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
                    } else if(response.status === 400){
                        document.getElementsByClassName('error-content')[0].innerHTML = 'Invalid data. ';
                        document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
                    }  else if(response.status === 403){
                        document.getElementsByClassName('error-content')[0].innerHTML = 'Access denied. ';
                        document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
                    } else if(response.status === 200) {
                        e.target.innerText = 'Change password';
                        oldPasswordInput.readOnly = true;
                        await this.setState({changingPassword: false});
                        await this.setState({oldPassword: '#############'});
                        await this.setState({newPassword: ''});
                        await this.setState({confirmNewPassword: ''});
                        //TODO: logout
                        Router.push('/');
                    }
                } catch (e) {
                    console.log(e.message);
                }
            }
        }
    }

    showTypeNewPassword() {
        if(this.state['changingPassword']) {
            return(
                <div>
                    <fieldset className="form-group">
                        <label htmlFor="password">new password:</label>
                        <input id="new-password"
                               type="password"
                               placeholder="new password"
                               className="form-control"
                               onChange={async () => {
                                   let newPasswordInput = document.getElementById('new-password');
                                   await this.setState({newPassword: newPasswordInput.value})
                               }}
                        />
                    </fieldset>

                    <fieldset className="form-group">
                        <label htmlFor="password">confirm:</label>
                        <input id="confirm-password"
                               type="password"
                               placeholder="retype the new password"
                               className="form-control"
                               onChange={async () => {
                                   let confirmNewPasswordInput = document.getElementById('confirm-password');
                                   await this.setState({confirmNewPassword: confirmNewPasswordInput.value})
                               }}
                        />
                    </fieldset>
                </div>
            )
        }
    }

    async updateUsernameState(e) {
        let account = this.state['account'];
        account['user']['username'] = e.target.value;
        await this.setState({ account: account });
    }

    async updateEmailState(e) {
        let account = this.state['account'];
        account['user']['email'] = e.target.value;
        await this.setState({ account: account });
    }

    async updateFullNameState(e) {
        let account = this.state['account'];
        account['user']['fullName'] = e.target.value;
        await this.setState({ account: account });
    }

    validateEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    async cancelChangeUsername(e) {
        e.persist();
        document.getElementById('change-username-btn').innerText = 'Change username';
        document.getElementById('username').readOnly = true;
        await this.setState({changingUsername: false});

        let account = this.state['account'];
        account['user']['username'] = this.state['usernameTemp'];
        await this.setState({ account: account });

        e.target.setAttribute('style', 'display: none');
    }

    async cancelChangeEmail(e) {
        e.persist();
        document.getElementById('change-email-btn').innerText = 'Change email';
        document.getElementById('email').readOnly = true;

        let account = this.state['account'];
        account['user']['email'] = this.state['emailTemp'];
        await this.setState({ account: account });

        await this.setState({changingEmail: false});
        e.target.setAttribute('style', 'display: none');
    }

    async cancelChangeFullName(e) {
        e.persist();
        document.getElementById('change-fullName-btn').innerText = 'Change full name';
        document.getElementById('full-name').readOnly = true;

        let account = this.state['account'];
        account['user']['fullName'] = this.state['fullNameTemp'];
        await this.setState({ account: account });

        await this.setState({changingFullName: false});
        e.target.setAttribute('style', 'display: none');
    }

    async cancelChangePassword(e) {
        e.persist();
        document.getElementById('change-password-btn').innerText = 'Change password';
        document.getElementById('password').readOnly = true;
        await this.setState({'oldPassword': "############"});
        await this.setState({changingPassword: false});
        e.target.setAttribute('style', 'display: none');
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
                        <div className={"action"}>
                            <button
                                type={"button"}
                                id={"cancel-change-username"}
                                className="btn btn-info cancel"
                                onClick={this.cancelChangeUsername}
                                style={{display: "none"}}
                            >Cancel</button>
                            <button id={"change-username-btn"} type={"button"} className="btn btn-warning" onClick={this.changeUsername}>Change username</button>
                        </div>
                    </fieldset>
                    <fieldset className="form-group">
                        <label htmlFor="email">email:</label>
                        <input id="email"
                               type="email"
                               placeholder=""
                               className="form-control"
                               value={this.state['account']['user']['email']}
                               readOnly={true}
                               onChange={this.updateEmailState}
                        />
                        <div className={"action"}>
                            <button
                                type={"button"}
                                id={"cancel-change-email"}
                                className="btn btn-info cancel"
                                onClick={this.cancelChangeEmail}
                                style={{display: "none"}}
                            >Cancel</button>
                            <button id={"change-email-btn"} type={"button"} className="btn btn-warning" onClick={this.changeEmail}>Change email</button>
                        </div>
                    </fieldset>
                    <fieldset className="form-group">
                        <label>full name:</label>
                        <input id="full-name"
                               type="text"
                               placeholder="your full name"
                               className="form-control"
                               value={this.state['account']['user']['fullName']}
                               readOnly={true}
                               onChange={this.updateFullNameState}
                        />
                        <div className={"action"}>
                            <button
                                type={"button"}
                                id={"cancel-change-fullName"}
                                className="btn btn-info cancel"
                                onClick={this.cancelChangeFullName}
                                style={{display: "none"}}
                            >Cancel</button>
                            <button id={"change-fullName-btn"} type={"button"} className="btn btn-warning" onClick={this.changeFullName}>Change full name</button>
                        </div>
                    </fieldset>
                    <fieldset className="form-group">
                        <label htmlFor="password">password:</label>
                        <input id="password"
                               type="password"
                               value={this.state['oldPassword']}
                               placeholder=""
                               className="form-control"
                               readOnly={true}
                               onChange={async () => {
                                   let oldPassword = document.getElementById('password');
                                   await this.setState({oldPassword: oldPassword.value})
                               }}
                        />
                        <div className={"action"}>
                            <button
                                type={"button"}
                                id={"cancel-change-password"}
                                className="btn btn-info cancel"
                                onClick={this.cancelChangePassword}
                                style={{display: "none"}}
                            >Cancel</button>
                            <button id={"change-password-btn"} type={"button"} className="btn btn-warning" onClick={this.changePassword}>Change password</button>
                        </div>
                    </fieldset>
                    { this.showTypeNewPassword() }
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
                                return(<a>{ contest['name'] }</a>)
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

export default withNamespaces()(MyAccount);