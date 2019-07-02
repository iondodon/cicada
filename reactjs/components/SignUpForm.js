import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';


class SignUpForm extends React.Component {

    constructor({t}){
        super({t});
        this.t = t;

        this.state = {
            username: '',
            password: ''
        };

        this._handleKeyDown = this._handleKeyDown.bind(this);
    }

    _handleKeyDown(e){
        if(e.key === 'Enter'){

        }
    }

    render(){
        return (
            <div className="card">
                <header className="card-header">SignUp</header>
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
                    <div className="alert alert-warning" style={{display: 'none'}}>Fill all fields.</div>
                    <div className="alert alert-error" style={{display: 'none'}}>Bad credentials.</div>
                    <div className="btn-group">
                        <button className="btn btn-primary">SignUp</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withNamespaces()(SignUpForm);