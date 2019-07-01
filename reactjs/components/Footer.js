import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';


class Footer extends React.Component {

    constructor({t}){
        super({t});
        this.t = t;

        this.state = {
            username: '',
            password: ''
        };

    }

    render(){
        return (
            <div className="footer">
                Footer content here
            </div>
        );
    }
}

export default withNamespaces()(Footer);