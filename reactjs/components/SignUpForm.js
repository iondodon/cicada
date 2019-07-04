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
            agree: false
        };

        this.sendData = this.sendData.bind(this);
        this.closeWarning = this.closeWarning.bind(this);
        this.validateFields = this.validateFields.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this._handleKeyDown = this._handleKeyDown.bind(this);
    }

    validateEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    _handleKeyDown(e){
        if(e.key === 'Enter'){
            this.sendData().then(() => console.log('done'));
        }
    }

    validateFields(){
        document.getElementsByClassName('fill-all')[0].setAttribute('style', 'display: none;');
        document.getElementsByClassName('short-username')[0].setAttribute('style', 'display: none;');
        document.getElementsByClassName('short-password')[0].setAttribute('style', 'display: none;');
        document.getElementsByClassName('invalid-email-format')[0].setAttribute('style', 'display: none;');
        document.getElementsByClassName('passwords-dont-match')[0].setAttribute('style', 'display: none;');
        document.getElementsByClassName('terms-of-use-agree')[0].setAttribute('style', 'display: none;');

        let validFields = true;

        if(!this.validateEmail(this.state.email)){
            document.getElementsByClassName('invalid-email-format')[0]
                .setAttribute('style', 'display: inline');
            validFields = false;
        }

        if(this.state.username.length < 6 || !this.state.username){
            console.log(this.state.username.length);
            document.getElementsByClassName('short-username')[0]
                .setAttribute('style', 'display: inline');
            validFields = false;
        }

        if(this.state.password.length < 6 || !this.state.password){
            document.getElementsByClassName('short-password')[0]
                .setAttribute('style', 'display: inline');
            validFields = false;
        }

        if(this.state.password !== this.state.passwordRetyped){
            document.getElementsByClassName('passwords-dont-match')[0]
                .setAttribute('style', 'display: inline');
            validFields = false;
        }

        if(!this.state.agree){
            document.getElementsByClassName('terms-of-use-agree')[0]
                .setAttribute('style', 'display: inline');
            validFields = false;
        }

        if(validFields){
            this.sendData().then(() => console.log('sent'));
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
            mode: 'no-cors',
            headers: headers,
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

    closeWarning(e){
        e.target.parentElement.setAttribute('style', 'display: none;');
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
                        <input type="checkbox" onChange={e => this.setState({agree: e.target.checked})} name="agree"/>
                    </div>
                    <div className="btn-group">
                        <button className="btn btn-primary" onClick={this.validateFields}>SignUp</button>
                    </div>
                    <div className="alert alert-warning fill-all" style={{display: 'none', 'margin-top': '3px'}}>
                        Fill all fields.
                        <a onClick={this.closeWarning}> x</a>
                    </div>
                    <div className="alert alert-warning invalid-email-format" style={{display: 'none', 'margin-top': '3px'}}>
                        Invalid email format.
                        <a onClick={this.closeWarning}> x</a>
                    </div>
                    <div className="alert alert-warning short-username" style={{display: 'none', 'margin-top': '3px'}}>
                        Short username
                        <a onClick={this.closeWarning}> x</a>
                    </div>
                    <div className="alert alert-warning short-password" style={{display: 'none', 'margin-top': '3px'}}>
                        Too short password
                        <a onClick={this.closeWarning}> x</a>
                    </div>
                    <div className="alert alert-warning passwords-dont-match" style={{display: 'none', 'margin-top': '3px'}}>
                        Passwords don't match
                        <a onClick={this.closeWarning}> x</a>
                    </div>
                    <div className="alert alert-warning terms-of-use-agree" style={{display: 'none', 'margin-top': '3px'}}>
                        Read - terms of use.
                        <a onClick={this.closeWarning}> x</a>
                    </div>
                </div>

                { /*language=SCSS*/ }
                <style jsx>{`
                  .card {
                        max-width: 40%;
                        min-width: 40%;
                        text-align: center;
                        margin: auto;
                    }
                    
                    .card-content {
                        display: flex;
                        flex-wrap: wrap;
                    
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
                    
                    /* Medium screens */
                    @media all and (max-width: 800px) {
                        .card {
                            order: 0;
                            margin-top: 5%;
                            min-width: 100%;
                        }
                    }
                `}
                </style>
            </div>
        );
    }
}

export default withNamespaces()(SignUpForm);