import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import config from "../configs/keys";

class TopPlayers extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {
            topPlayers: []
        };

        this.fetchTopPlayers = this.fetchTopPlayers.bind(this);
    }

    async fetchTopPlayers() {
        const request = {
            method: 'GET',
            mode: 'cors',
            credentials: 'include'
        };

        try {
            let response = await fetch(config.API_URL + '/api/get-top-players', request);

            if(response.status === 400){
                console.log("Client Error");
            } else if(response.status === 200) {
                await this.setState({topPlayers: await response.json()})
                console.log(this.state);
            }
        } catch (e) {
            console.log(e.message);
        }
    }

    async componentDidMount() {
        await this.fetchTopPlayers();
    }

    render(){
        return (
            <div className="card" id={"top-players-card"}>
                <header className="card-header">top players</header>
                <div className="card-content">
                    <div className="inner">
                        <ul>
                            {
                                this.state['topPlayers'].map((player) => {
                                    return(<li key={player['account']['id']}> - {player['account']['user']['fullName']} : {player['solved']}</li>);
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

export default withNamespaces()(TopPlayers);