import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';


class SignUpForm extends React.Component {

    constructor({t}){
        super({t});
        this.t = t;

        this.state = {
            email: '',
            fullName: '',
            username: '',
            password: '',
            passwordRetyped: '',
            agree: ''
        };

        this.sendData = this.sendData.bind(this);
        this._handleKeyDown = this._handleKeyDown.bind(this);
    }

    _handleKeyDown(e){
        if(e.key === 'Enter'){
            this.sendData().then(() => console.log('done'));
        }
    }

    async sendData(){
        const formData = new URLSearchParams();
        formData.append('email', this.state.email);
        formData.append('fullName', this.state.fullName);
        formData.append('username', this.state.username);
        formData.append('password', this.state.password);

        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        const request = {
            method: 'POST',
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, *same-origin, omit
            headers: headers,
            redirect: 'manual', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: formData.toString()
        };

        try {
            let response = await fetch('http://localhost:9000/api/register', request);

            if(response.status === 403){
                console.log(response.statusText);
                document.getElementsByClassName('alert-error')[0]
                    .setAttribute('style', 'display: inline');
            } else if(response.status === 201) {
                console.log("Registered successfully");
            }
        } catch (e) {
            console.log(e.message);
        }
    }

    render(){
        return (
            <div className="card">
                <header className="card-header">SignUp</header>
                <div className="card-content inner">
                    <fieldset className="form-group form-success">
                        <label htmlFor="email">email:</label>
                        <input type="text" placeholder="" className="form-control"
                               onChange={e => this.setState({ email: e.target.value })}
                               onKeyDown={this._handleKeyDown}
                               value={this.state.email}
                        />
                    </fieldset>
                    <fieldset className="form-group form-success">
                        <label htmlFor="fullName">full name:</label>
                        <input type="text" placeholder="" className="form-control"
                               onChange={e => this.setState({ fullName: e.target.value })}
                               onKeyDown={this._handleKeyDown}
                               value={this.state.fullName}
                        />
                    </fieldset>
                    <fieldset className="form-group form-success">
                        <label htmlFor="username">username:</label>
                        <input type="text" placeholder="" className="form-control"
                               onChange={e => this.setState({ username: e.target.value })}
                               onKeyDown={this._handleKeyDown}
                               value={this.state.username}
                        />
                    </fieldset>
                    <fieldset className="form-group form-warning">
                        <label htmlFor="password">password:</label>
                        <input type="password" placeholder="" className="form-control"
                               onChange={e => this.setState({ password: e.target.value })}
                               onKeyDown={this._handleKeyDown}
                               value={this.state.password}
                        />
                    </fieldset>
                    <fieldset className="form-group form-warning">
                        <label htmlFor="passwordRetyped">confirm:</label>
                        <input type="password" placeholder="" className="form-control"
                               onChange={e => this.setState({ passwordRetyped: e.target.value })}
                               onKeyDown={this._handleKeyDown}
                               value={this.state.passwordRetyped}
                        />
                    </fieldset>
                    <div style={{'margin' : 'auto'}}>
                        <label htmlFor="passwordRetyped">agree:</label>
                        <input type="checkbox" name="vehicle1" value="Bike"/>
                    </div>
                    <div className="alert alert-warning" style={{display: 'none'}}>Fill all fields.</div>
                    <div className="alert alert-error" style={{display: 'none'}}>Bad credentials.</div>
                    <div className="btn-group">
                        <button className="btn btn-primary" onClick={this.sendData}>SignUp</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withNamespaces()(SignUpForm);