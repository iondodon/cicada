import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';


class LogInInfo extends React.Component {

    constructor({t}){
        super({t});
        this.t = t;
    }

    render(){
        return (
            <div className={"info"}>
                <img className="bg" src={"/static/pages/login/cicada.png"} alt={"cicada"} style={{width: '50%;'}}/>
                asdasdasdasd
            </div>
        );
    }
}

export default withNamespaces()(LogInInfo);