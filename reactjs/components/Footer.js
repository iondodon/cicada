import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';


class Footer extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {};
    }

    render(){
        return (
            <div className="footer">
                <hr/>
                Footer content here

                { /*language=SCSS*/ }
                <style jsx>{`
                  .footer {
                        align-self: flex-end;
                        margin-bottom: 2%;
                        width: 100%;
                        text-align: center;
                  }
                `}
                </style>
            </div>
        );
    }
}

export default withNamespaces()(Footer);