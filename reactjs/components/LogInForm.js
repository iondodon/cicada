import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';


class LogInForm extends React.Component {

    constructor({t}){
        super({t});
        this.t = t;

        this.state = {
            username: '',
            password: ''
        };

        this.getToken = this.getToken.bind(this);
        this._handleKeyDown = this._handleKeyDown.bind(this);
    }

    async getToken(){
        document.getElementsByClassName('loading')[0].setAttribute('style', 'display: initial;');
        try {
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append(
                'Authorization',
                'Basic ' + Buffer.from(this.state.username + ":" + this.state.password).toString('base64')
            );

            let response = await fetch('http://localhost:9000/api/token', {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, cors, *same-origin
                cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'include', // include, *same-origin, omit
                headers: headers,
                redirect: 'manual', // manual, *follow, error
                referrer: 'no-referrer', // no-referrer, *client
                // body: JSON.stringify(data), // body data type must match "Content-Type" header
            });

            if(response.status === 404){
                console.log(response.statusText);
                document.getElementsByClassName('loading')[0].setAttribute('style', 'display: none;');
            } else if(response.status === 200) {
                console.log("Logged in");
            }
        }catch (e) {
            console.log(e.message);
        }
    }

    _handleKeyDown(e){
        if(e.key === 'Enter'){
            this.getToken().then(() => console.log("done"));
        }
    }

    render(){
        return (
            <div className="card">
                <header className="card-header">Login</header>
                <div className="card-content inner">
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
                    <div className="btn-group">
                        <button type={"submit"} className="btn btn-default" onClick={this.getToken}>
                            <span className="loading" style={{display: 'none'}}/>
                            Login
                        </button>
                        <button className="btn btn-primary">Register</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withNamespaces()(LogInForm);