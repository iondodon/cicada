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
                                Last puzzles <div className="pull-right">»</div>
                            </a>
                            <a className="menu-item active">
                                Find puzzle <div className="pull-right">»</div>
                            </a>
                            <a className="menu-item">
                                Create new puzzle <div className="pull-right">»</div>
                            </a>
                            <a className="menu-item">
                                Players <div className="pull-right">»</div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withNamespaces()(LeftMenu);