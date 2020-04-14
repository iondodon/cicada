import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';


class LogInInfo extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;
    }

    render(){
        return (
            <div className={"info"} id={"login-info"}>
                <br/>



                { /*language=SCSS*/ }
                <style jsx>{`
                  .info {
                        display: flex;
                        text-align: center;
                        flex-direction: column;
                    }
                `}
                </style>
            </div>
        );
    }
}

export default withNamespaces()(LogInInfo);