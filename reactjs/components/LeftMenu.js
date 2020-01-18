import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';

import Link from 'next/link';
import config from "../configs/keys";

class LeftMenu extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;


        this.state = {
            loggedIn: false
        };

        this.getUsername = this.getUsername.bind(this);
    }

    componentDidMount() {
        this.getUsername().then();
    }

    async getUsername() {
        const request = {
            method: 'GET',
            mode: 'cors',
            credentials: "include"
        };

        let response = await fetch(config.API_URL + '/api/account/username', request);
        await this.setState({loggedIn: response.status === 200});
    }

    render(){
        return (
            <div className="card" id={"left-menu-card"}>
                {/*<header className="card-header">left menu</header>*/}
                <div className="card-content">
                    <div className="inner">
                        <div className="menu">
                            <Link href={"/puzzle/list"}>
                                <a className="menu-item">
                                    Explore puzzles<div className="pull-right">»</div>
                                </a>
                            </Link>{' '}
                            <Link href={"/contest/list"}>
                                <a className="menu-item">
                                    Explore contests<div className="pull-right">»</div>
                                </a>
                            </Link>{' '}

                            {(()=>{
                                if(this.state['loggedIn']) {
                                    return(
                                        <div>
                                            <br/>
                                            <Link href={"/account/my_puzzles"}>
                                                <a className="menu-item">
                                                    My puzzles <div className="pull-right">»</div>
                                                </a>
                                            </Link>{' '}
                                            <Link href={"/account/my_contests"}>
                                                <a className="menu-item">
                                                    My contests <div className="pull-right">»</div>
                                                </a>
                                            </Link>{' '}
                                            <Link href={"/account/my_teams"}>
                                                <a className="menu-item">
                                                    My teams <div className="pull-right">»</div>
                                                </a>
                                            </Link>{' '}
                                            {/*<a className="menu-item active">*/}
                                            {/*    Find puzzle <div className="pull-right">»</div>*/}
                                            {/*</a>*/}
                                            <Link href={"/account/teams_member_of"}>
                                                <a className="menu-item">
                                                    Teams member of<div className="pull-right">»</div>
                                                </a>
                                            </Link>{' '}
                                            {/*<a className="menu-item">*/}
                                            {/* enrolled at <div className="pull-right">»</div>*/}
                                            {/*</a>*/}
                                            <br/>
                                            <Link href={"/puzzle/create"}>
                                                <a className="menu-item">
                                                    Create puzzle<div className="pull-right">»</div>
                                                </a>
                                            </Link>{' '}
                                            <Link href={"/contest/create"}>
                                                <a className="menu-item">
                                                    Create contest<div className="pull-right">»</div>
                                                </a>
                                            </Link>{' '}
                                            <Link href={"/team/create"}>
                                                <a className="menu-item">
                                                    Create team<div className="pull-right">»</div>
                                                </a>
                                            </Link>{' '}
                                            <br/>
                                            <Link href={"/account"}>
                                                <a className="menu-item">
                                                    My account<div className="pull-right">»</div>
                                                </a>
                                            </Link>{' '}
                                            <Link href={"/account/requesting_teams"}>
                                                <a className="menu-item">
                                                    Requesting teams<div className="pull-right">»</div>
                                                </a>
                                            </Link>{' '}
                                        </div>
                                    );
                                }
                            })()}
                        </div>
                    </div>
                </div>

                { /*language=SCSS*/ }
                <style jsx>{`
                  .menu {
                        font-size: 13px;
                  }
                `}
                </style>
            </div>
        );
    }
}

export default withNamespaces()(LeftMenu);