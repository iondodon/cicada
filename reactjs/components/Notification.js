import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';


class Notification extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = this.props.notification;

        this.showMessage = this.showMessage.bind(this);
        this.removeNotification = this.removeNotification.bind(this);
    }

    componentDidMount() {
        console.log(this.state);
    }

    showMessage() {
        switch (this.state.type) {
            case 1:
                return(<div>{ this.state['sourceAccount']['user']['fullName'] } wants to add you in his/her team. See team requests.</div>);
            default:
                return(<div>Unknown notification type...</div>);
        }
    }

    removeNotification(e) {
        e.target.parentElement.setAttribute('style', 'display: none;');
    }

    render(){
        return (
            <div className="alert alert-warning">

                { this.showMessage() }

                <a onClick={this.removeNotification}>x</a>

                { /*language=SCSS*/ }
                <style jsx>{`                    
                    .alert {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                  }
                `}</style>
            </div>
        );
    }
}

export default withNamespaces()(Notification);