import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';

import Link from 'next/link';
import Cookies from 'js-cookie';
import config from "../configs/keys";

class LeftMenu extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {
            visible: true
        };

        this.toggleMenu = this.toggleMenu.bind(this);
    }

    componentDidMount() {

    }

    async toggleMenu() {
        this.setState({
            visible: !this.state['visible']
        });
    }

    render(){
        return (
            <div className="card" id={"left-menu-card"}>
                <header className="card-header" id={"toggle-menu"}
                        onClick={this.toggleMenu}>::toggle menu::</header>
                {(()=>{
                    if(this.state['visible']) {
                        return(
                            <div className="card-content" id={"menu-card-content"}>
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
                                            if(Cookies.get('userId',  { domain: config.DOMAIN })) {
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
                        );
                    }
                })()}
                { /*language=SCSS*/ }
                <style jsx>{`
                  #toggle-menu {
                    text-align: center;
                    display: none;
                    cursor: pointer;
                    background: #f7c873;
                  }
                  
                  .menu-item:hover {
                    background: #f7c873;
                    color: #434343;
                  }
                  
                  @media all and (max-width: 800px) { 
                    #toggle-menu {
                      cursor: pointer;
                      text-align: center;
                      display: block;
                    }
                  }
                `}
                </style>
            </div>
        );
    }
}

export default withNamespaces()(LeftMenu);