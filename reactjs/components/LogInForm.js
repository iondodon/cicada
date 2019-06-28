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
            <div className="card">
                <header className="card-header">title</header>
                <div className={"inner"}>
                    <div className="card-content">
                        <div className="form-group form-success">
                            <label htmlFor="username">username:</label>
                            <input type="text" placeholder="" className="form-control"/>
                        </div>
                        <div className="form-group form-warning">
                            <label htmlFor="password">password:</label>
                            <input type="password" placeholder="" className="form-control"/>
                        </div>
                        <button type={"submit"} className="btn btn-default">
                            {/*<span className="loading"/>*/}
                            Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withNamespaces()(LogInForm);