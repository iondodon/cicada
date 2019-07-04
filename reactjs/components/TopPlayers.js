import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';

class TopPlayers extends React.Component {

    constructor({t}){
        super({t});
        this.t = t;
    }

    render(){
        return (
            <div className="card">
                <header className="card-header">top players</header>
                <div className="card-content">
                    <div className="inner">
                        <ul>
                            <li>Ion Dodon</li>
                            <li>Marin Guidea</li>
                            <li>Asadasd SAdsad</li>
                            <li>Asadasd SAdsad</li>
                            <li>Asadasd SAdsad</li>
                            <li>Asadasd SAdsad</li>
                        </ul>
                    </div>
                </div>

                { /*language=SCSS*/ }
                <style jsx>{`
                    .inner {
                        padding-left: 2rem;
                    }
                    
                    .card-content {
                        padding-top: 0;
                    }
                    
                    .card-header {
                        
                    }
                `}</style>
            </div>
        );
    }
}

export default withNamespaces()(TopPlayers);