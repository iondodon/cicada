import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import LeftMenu from "./LeftMenu";
import TopPlayers from "./TopPlayers";

class LeftPanel extends React.Component {

    constructor({t}){
        super({t});
        this.t = t;
    }

    render(){
        return (
            <div className={'left-panel'}>
                <LeftMenu/>
                {this.props.children}
                <TopPlayers/>
            </div>
        );
    }
}

export default withNamespaces()(LeftPanel);