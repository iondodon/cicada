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
            <div className="footer hack">
                <hr/>
                Footer content here

                { /*language=SCSS*/ }
                <style jsx>{`
                  .footer {
                    // align-self: flex-end;
                    width: 100%;
                    text-align: center;
                    
                    background-color: #cccccc;
                    --webkit-box-shadow: 10px 10px 59px 80px #cccccc;
                    -moz-box-shadow: 10px 10px 59px 80px #cccccc;
                    box-shadow: 10px 10px 59px 80px #cccccc;
                  }
                `}
                </style>
            </div>
        );
    }
}

export default withNamespaces()(Footer);