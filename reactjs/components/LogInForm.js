import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';

import Head from 'next/head';

class LogInForm extends React.Component {

    constructor({t}){
        super({t});
        this.t = t;
    }

    render(){
        return (
            <div className="d-flex justify-content-end">
                <Head>
                    <title>Login</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>
                <div className="card" style={{width: 18 + 'rem'}}>
                        <div className="card-body">
                            <h5 className="card-title">Card title</h5>
                            <p className="card-text">Some quick example text to build on the card title and make up the bulk
                                of the card's content.
                            </p>

                            <form>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Email address</label>
                                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
                                        <small id="emailHelp" className="form-text text-muted">
                                            We'll never share your email with anyone else
                                        </small>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputPassword1">Password</label>
                                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"/>
                                </div>
                                <div className="form-group form-check">
                                    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                                        <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                                </div>
                                <button type="submit" className="btn btn-primary btn-sm">Submit</button>
                            </form>
                        </div>
                </div>
            </div>
        );
    }
}

export default withNamespaces()(LogInForm);