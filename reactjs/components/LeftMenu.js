import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';

class LeftMenu extends React.Component {

    constructor({t}){
        super({t});
        this.t = t;
    }

    render(){

        return (
            <div className="card">
                <header className="card-header">left menu</header>
                <div className="card-content">
                    <div className="inner">
                        <div className="menu">
                            <a className="menu-item">
                                My puzzles <div className="pull-right">»</div>
                            </a>
                            <a className="menu-item active">
                                Find puzzle <div className="pull-right">»</div>
                            </a>
                            <a className="menu-item">
                                Created teams <div className="pull-right">»</div>
                            </a>
                            <a className="menu-item">
                                Teams member of<div className="pull-right">»</div>
                            </a>
                            <a className="menu-item">
                                Created contests <div className="pull-right">»</div>
                            </a>
                            <a className="menu-item">
                                Contest enrolled at <div className="pull-right">»</div>
                            </a>
                            <hr/>
                            <a className="menu-item">
                                Create puzzle<div className="pull-right">»</div>
                            </a>
                            <a className="menu-item">
                                Create contest<div className="pull-right">»</div>
                            </a>
                            <a className="menu-item">
                                Create team<div className="pull-right">»</div>
                            </a>
                            <hr/>
                            <a className="menu-item">
                                My account<div className="pull-right">»</div>
                            </a>
                        </div>
                    </div>
                </div>

                { /*language=SCSS*/ }
                <style jsx>{`
                  .menu {
                        font-size: 13px;
                    }
                    
                    hr {
                        padding: 0;
                        margin: 0;
                    }
                `}
                </style>
            </div>
        );
    }
}

export default withNamespaces()(LeftMenu);