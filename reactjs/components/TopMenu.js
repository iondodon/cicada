import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';


class TopMenu extends React.Component {

    constructor({t}){
        super({t});
        this.t = t;
    }

    render(){
        return (
            <div className="menu top-menu">
                <a className="menu-item active">Login</a>
                |
                <a className="menu-item">Register</a>
                |
                <a className="menu-item">About</a>
            </div>
        );
    }
}

export default withNamespaces()(TopMenu);