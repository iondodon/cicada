import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';

class Dashboard extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;
    }

    render(){
        return (
            <div className="dashboard" id={"dashboard"}>
                {this.props.children}

                { /*language=SCSS*/ }
                <style jsx>{`
                    .dashboard {
                        display: flex;
                        flex-direction: row;
                    }
                `}
                </style>
            </div>
        );
    }
}

export default withNamespaces()(Dashboard);