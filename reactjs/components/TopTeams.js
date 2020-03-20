import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import config from "../configs/keys";

class TopTeams extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {
            topTeams: []
        };

        this.fetchTopTeams = this.fetchTopTeams.bind(this);
    }

    async fetchTopTeams() {
        const request = {
            method: 'GET',
            mode: 'cors',
            credentials: 'include'
        };

        try {
            let response = await fetch(config.API_URL + '/api/get-top-teams', request);

            if(response.status === 400){
                console.log("Client Error");
            } else if(response.status === 200) {
                await this.setState({topTeams: await response.json()});
                console.log(this.state);
            }
        } catch (e) {
            console.log(e.message);
        }
    }

    async componentDidMount() {
        await this.fetchTopTeams();
    }

    render(){
        return (
            <div className="card" id={"top-teams-card"}>
                <header className="card-header">Teams</header>
                <div className="card-content">
                    <div className="inner">
                        <ul>
                            {
                                this.state['topTeams'].map((team) => {
                                    return(<li key={team['id']}> - {team['team']['name']} : {team['solved']} </li>);
                                })
                            }
                        </ul>
                    </div>
                </div>

                { /*language=SCSS*/ }
                <style jsx>{`
                    .inner {
                        padding-left: 2rem;
                    }
                    
                    .card {
                      width: 100%;
                    }
                    
                    .card-content {
                      padding-top: 0;
                    }
                    
                    .card-header {
                        
                    }
                `}</style>
            </div>
        );
    }
}

export default withNamespaces()(TopTeams);