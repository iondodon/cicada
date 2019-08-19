import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';


class Notification extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;
    }

    render(){
        return (
            <div>
                hmmm
                { /*language=SCSS*/ }
                <style jsx>{`                    
                    
                `}</style>
            </div>
        );
    }
}

export default withNamespaces()(Notification);