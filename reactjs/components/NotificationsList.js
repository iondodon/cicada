import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import config from "../configs/keys";
import Notification from "./Notification";


class NotificationsList extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {
            notifications: [],
            loading: true
        };

        this.getNotifications = this.getNotifications.bind(this);
        this.closeError = this.closeError.bind(this);
        this.removeNotification = this.removeNotification.bind(this);
    }

    componentDidMount() {
        this.getNotifications().then();
    }

    async removeNotification(notificationId) {
        const findNotification = (id, array) => {
            for(let i = 0; i < array.length; i++) {
                if(array[i]['id'] === id) {
                    return i;
                }
            }
        };

        let notifications = this.state.notifications;
        let index = findNotification(notificationId, notifications);
        notifications.splice(index,1);
        await this.setState({notifications: notifications});
    }

    async getNotifications() {
        const request = {
            method: 'GET',
            mode: 'cors',
            credentials: 'include'
        };

        try {
            let response = await fetch(config.API_URL + '/api/notifications', request);

            if (response.status === 401) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unauthorized.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 500) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Server error.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 200) {
                let notificationsArrayJson = await response.json();
                await this.setState({notifications: notificationsArrayJson});
                await this.setState({loading: false});
            } else {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unknown error.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            }
        } catch (e) {
            document.getElementsByClassName('error-content')[0].innerHTML += e.message;
            document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
        }
    }

    closeError(e) {
        e.target.parentElement.setAttribute('style', 'display: none;');
    }

    render(){
        if(this.state.loading){
            return(
                <div className={"notifications-list"}>
                    <div className="alert alert-error" style={{ display: 'none' }} >
                        <div className={"error-content"} >Error message</div>
                        {'\u00A0'} <a onClick={this.closeError}>x</a>
                    </div>
                    <h2>loading...</h2>

                    { /*language=SCSS*/ }
                    <style jsx>{`
                      .alert {
                            display: flex;
                            flex-direction: row;
                            text-align: center;
                            margin-top: 2rem;
                            margin-bottom: 0;
                            justify-content: center;
                      }
                      
                      .notifications-list {
                        display: flex;
                        flex-direction: column;
                        width: 100%;
                      }
                      
                      h2 {
                        margin-top: 1rem;
                      }
                    `}
                    </style>
                </div>
            );
        }

        if(this.state.notifications.length === 0) {
            return(<h2> empty </h2>);
        }

        return (
            <div className={"notifications-list"}>

                <div className="alert alert-error" style={{ display: 'none' }} >
                    <div className={"error-content"} >Error message</div>
                    {'\u00A0'} <a onClick={this.closeError}>x</a>
                </div>

                {
                    this.state.notifications.map((notification) => {
                        return(
                            <Notification
                                notification={notification}
                                key={notification.id}
                                removeNotification={this.removeNotification}
                            />
                        );
                    })
                }

                { /*language=SCSS*/ }
                <style jsx>{`                    
                  .notifications-list {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                  }
                `}</style>
            </div>
        );
    }
}

export default withNamespaces()(NotificationsList);