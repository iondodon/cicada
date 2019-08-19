import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import Notification from "./Notification";


class NotificationsList extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;
    }

    render(){
        return (
            <div>
                <Notification/>
                { /*language=SCSS*/ }
                <style jsx>{`                    
                    
                `}</style>
            </div>
        );
    }
}

export default withNamespaces()(NotificationsList);