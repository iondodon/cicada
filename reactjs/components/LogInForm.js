import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';

import config from '../configs/keys';
import Router from 'next/router';

class LogInForm extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {
            username: '',
            password: ''
        };

        this.getToken = this.getToken.bind(this);
        this._handleKeyDown = this._handleKeyDown.bind(this);
    }

    async getToken(){
        document.getElementsByClassName('alert-warning')[0]
            .setAttribute('style', 'display: none');
        document.getElementsByClassName('alert-error')[0]
            .setAttribute('style', 'display: none');

        document.getElementById("username").disabled = true;
        document.getElementById("password").disabled = true;

        if(this.state.username === '' || this.state.password === ''){
            document.getElementsByClassName('alert-warning')[0]
                .setAttribute('style', 'display: inline');
        } else
            try {
                const headers = new Headers();
                headers.append('Content-Type', 'application/json');
                headers.append(
                    'Authorization',
                    'Basic ' + Buffer.from(this.state.username + ":" + this.state.password).toString('base64')
                );

                let response = await fetch(config.API_URL + '/api/token', {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    mode: 'cors', // no-cors, cors, *same-origin
                    cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: 'include', // include, *same-origin, omit
                    headers: headers,
                    redirect: 'manual', // manual, *follow, error
                    referrer: 'no-referrer', // no-referrer, *client
                    // body: JSON.stringify(data), // body data type must match "Content-Type" header
                });

                if(response.status === 404 || response.status === 401){
                    document.getElementsByClassName('alert-error')[0]
                        .setAttribute('style', 'display: inline');

                    document.getElementById("username").disabled = false;
                    document.getElementById("password").disabled = false;
                 } else if(response.status === 200) {
                    Router.push('/');
                }
            }catch (e) {
                console.log(e.message);
            }
    }

    _handleKeyDown(e){
        if(e.key === 'Enter'){
            this.getToken().then(() => console.log("sent"));
        }
    }

    render(){
        return (
            <div className="card" id={"login-form"}>
                <header className="card-header">Login</header>
                <div className="card-content inner">
                    <fieldset className="form-group form-success">
                        <label htmlFor="username">username:</label>
                        <input id={"username"} type="text" placeholder="" className="form-control"
                               onChange={e => this.setState({ username: e.target.value })}
                               onKeyDown={this._handleKeyDown}
                               value={this.state.username}
                        />
                    </fieldset>
                    <fieldset className="form-group form-warning">
                        <label htmlFor="password">password:</label>
                        <input id={"password"} type="password" placeholder="" className="form-control"
                               onChange={e => this.setState({ password: e.target.value })}
                               onKeyDown={this._handleKeyDown}
                               value={this.state.password}
                        />
                    </fieldset>
                    <div className="alert alert-warning" style={{display: 'none'}}>Fill all fields.</div>
                    <div className="alert alert-error" style={{display: 'none'}}>Bad credentials.</div>
                    <div className="btn-group">
                        <button type={"submit"} className="btn btn-default" onClick={this.getToken}>
                            Login
                        </button>
                    </div>
                </div>

                { /*language=SCSS*/ }
                <style jsx>{`
                  .card {
                        max-width: 35%;
                        min-width: 35%;
                        text-align: center;
                        margin: 5rem auto auto;
                    }
                    
                    .card-content {
                        display: flex;
                        flex-wrap: wrap;
                    
                    }
                    
                    .btn {
                      border-radius: 4px;
                    }
                    
                    .btn-group {
                        display: flex;
                        width: 100%;
                        justify-content: center;
                        margin-top: 10px;
                    }
                    
                    fieldset {
                        min-width: 100%;
                        justify-content: center;
                    }
                    
                    label {
                        max-width: 25%;
                    }
                    
                    input {
                        max-width: 74%;
                    }
                    
                    .alert {
                        margin: auto;
                    }
                `}
                </style>
            </div>
        );
    }
}

export default withNamespaces()(LogInForm);