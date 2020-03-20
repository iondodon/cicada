import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import LeftMenu from "./LeftMenu";
import TopPlayers from "./TopPlayers";

class LeftPanel extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;
    }

    render(){
        return (
            <div className={'left-panel'} id={"left-panel"}>
                <LeftMenu/>
                {this.props.children}

                { /*language=SCSS*/ }
                <style jsx>{`
                  .left-panel {
                        display: flex;
                        flex-direction: column;
                   }
                `}
                </style>
            </div>
        );
    }
}

export default withNamespaces()(LeftPanel);