import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import LeftPanel from "./LeftPanel";

class Dashboard extends React.Component {

    constructor({t}){
        super({t});
        this.t = t;
    }

    render(){
        return (
            <div className="dashboard">
                <LeftPanel>
                    <div className="card">
                        <header className="card-header">specific to page</header>
                        <div className="card-content">
                            <div className="inner">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita, quas
                                ex vero enim in doloribus officiis ullam vel nam esse sapiente velit incidunt. Eaque quod
                                et, aut maiores excepturi sint.
                            </div>
                        </div>
                    </div>
                </LeftPanel>
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