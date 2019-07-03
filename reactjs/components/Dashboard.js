import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';

class Dashboard extends React.Component {

    constructor({t}){
        super({t});
        this.t = t;
    }

    render(){
        return (
            <div className="dashboard">
                dasdasdasdasdasdasdasd
                <hr/>
                {this.props.children}
            </div>
        );
    }
}

export default withNamespaces()(Dashboard);