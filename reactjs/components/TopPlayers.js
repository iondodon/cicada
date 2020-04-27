import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import config from "../configs/keys";
import Link from 'next/link'

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
                <header className="card-header">Solo players</header>
                <div className="card-content">
                    <div className="inner">
                        <ul>
                            {
                                this.state['topPlayers'].map((player) => {
                                    return(
                                        <li key={player['account']['id']}>
                                            -
                                            <Link href={{pathname: '/account/show', query: {fullName: player['account']['user']['fullName'] }}}>
                                                 <a>{player['account']['user']['fullName']}</a>
                                            </Link> : {player['solved']}
                                        </li>);
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

export default withNamespaces()(TopPlayers);