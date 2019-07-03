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
                    <div className="inner">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita,
                        quas ex vero enim in doloribus officiis ullam vel nam esse sapiente velit incidunt.
                        Eaque quod et, aut maiores excepturi sint.
                    </div>
                </div>
            </div>
        );
    }
}

export default withNamespaces()(LeftMenu);