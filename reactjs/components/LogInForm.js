import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';

class LogInForm extends React.Component {

    constructor({t}){
        super({t});
        this.t = t;
    }

    render(){

        return (
            <div>asda</div>
        );
    }
}

export default withNamespaces()(LogInForm);