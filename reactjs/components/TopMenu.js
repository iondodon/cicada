import React from 'react';
import '../i18n';
import { withNamespaces } from 'react-i18next';
import Link from 'next/link';
import Router from "next/router";
import config from "../configs/keys";
import Cookie from 'js-cookie';

class TopMenu extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
    }

    async logout() {
        const request = {
            method: 'POST',
            mode: 'cors',
            credentials: "include"
        };

        let response = await fetch(config.API_URL + '/api/logout', request);

        if (response.status === 200) {
            Router.push("/see-you-soon");
        }
    }

    render(){
        return (
            <div className="alert alert-success menu-box">

                <div className="menu left-menu">
                    <Link href={"/"}>
                        <a className="menu-item">Home</a>
                    </Link>{' '}
                    |
                    <Link href={"/top20"}>
                        <a className="menu-item">Top</a>
                    </Link>{' '}
                    |
                    <Link href={"/about"}>
                        <a className="menu-item">About</a>
                    </Link>{' '}
                </div>

                <img src={'../static/cicada.png'} className={"logo"} id={"logo"}  alt="true" />

                <div className="menu right-menu">
                    {(()=>{
                        if(Cookie.get('userId',  { domain: config.DOMAIN })) {
                            return(
                                <div className={"topbar-right-action"}>
                                    <Link href={"/notifications"}>
                                        <a className="menu-item">Notifications</a>
                                    </Link>{' '}
                                    |
                                    <Link href={"/account"}>
                                        <a className="menu-item">
                                            {Cookie.get('username', {domain: config.DOMAIN})}
                                        </a>
                                    </Link>{' '}
                                    |
                                    <a onClick={this.logout} className="menu-item">Logout</a>
                                </div>
                            );
                        } else {
                            return(
                                <div className={"topbar-right-action"}>
                                    <Link href={"/login"}>
                                        <a className="menu-item">Login</a>
                                    </Link>{' '}
                                    |
                                    <Link href={"/signup"}>
                                        <a className="menu-item">SignUp</a>
                                    </Link>{' '}
                                </div>
                            );
                        }
                    })()}
                </div>

                { /*language=SCSS*/ }
                <style jsx>{`
                  .topbar-right-action {
                    display: flex;
                    flex-direction: row;
                  }

                  .right-menu {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                    width: 30%;
                  }

                  .left-menu {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    width: 30%;
                  }

                  .alert {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    margin-top: -1px;
                    margin-left: 1rem;
                    margin-right: 1rem;
                    margin-bottom: 1rem;
                  }

                  .menu-box {
                    border: none;
                    
                    background-color: #cccccc;
                    --webkit-box-shadow: 10px 10px 59px 80px #cccccc;
                    -moz-box-shadow: 10px 10px 59px 80px #cccccc;
                    box-shadow: 10px 10px 59px 80px #cccccc;
                  }

                  .logo {
                    height: 2rem;
                  }
                `}
                </style>
            </div>
        );
    }
}

export default withNamespaces()(TopMenu);