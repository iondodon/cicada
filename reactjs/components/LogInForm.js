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
        this.listCookies = this.listCookies.bind(this);
    }


    listCookies() {
        var theCookies = document.cookie.split(';');
        var aString = '';
        for (var i = 1 ; i <= theCookies.length; i++) {
            aString += i + ' ' + theCookies[i-1] + "\n";
        }
        return aString;
    }

    getToken(){
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Basic ' + Buffer.from(this.state.username + ":" + this.state.password).toString('base64'));
        fetch('http://localhost:9000/api/token',  {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, *same-origin, omit
            headers: headers,
            redirect: 'manual', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            // body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
            .catch(error => console.log(error));

        console.log(this.listCookies());
    }

    render(){
        return (
            <div className="d-flex justify-content-end">
                <div className="card" style={{width: 18 + 'rem'}}>
                        <div className="card-body">
                            <h5 className="card-title">Card title</h5>
                            <p className="card-text">Some quick example text to build on the card title and make up the bulk
                                of the card's content.
                            </p>

                            <form>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Email address</label>
                                    <input type="username" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"
                                           onChange={e => this.setState({ username: e.target.value })}
                                           value={this.state.username}
                                    />
                                        <small id="emailHelp" className="form-text text-muted">
                                            We'll never share your email with anyone else
                                        </small>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputPassword1">Password</label>
                                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"
                                           onChange={e => this.setState({ password: e.target.value })}
                                           value={this.state.password}
                                    />
                                </div>
                                <div className="form-group form-check">
                                    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                                        <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                                </div>
                            </form>
                            <button /** type="submit" **/ className="btn btn-primary btn-sm" onClick={this.getToken}>Submit</button>
                        </div>
                </div>
            </div>
        );
    }
}

export default withNamespaces()(LogInForm);