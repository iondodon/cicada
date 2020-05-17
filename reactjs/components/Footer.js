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

                cicadapuzzle.com © 2020

                { /*language=SCSS*/ }
                <style jsx>{`
                  .footer {
                    align-self: flex-end;
                    width: 100%;
                    text-align: center;
                    padding: 2rem;
                    margin-top: 4px;
                    margin-bottom: 4px;
                    border: 1px solid #434343;
                    border-radius: 3px;
                    
                    background: #f6eec7;
                  }
                  
                  
                  hr {
                     text-align: center;
                  }                `}
                </style>
            </div>
        );
    }
}

export default withNamespaces()(Footer);