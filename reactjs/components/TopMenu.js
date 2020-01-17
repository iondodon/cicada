import React from 'react';
import '../i18n';
import { withNamespaces } from 'react-i18next';
import Link from 'next/link';
import Router from "next/router";
import config from "../configs/keys";
import {deleteAllCookies, getCookie} from '../utlis/utlis';

class TopMenu extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.logout = this.logout.bind(this);
    }


    async logout() {
        const request = {
            method: 'POST',
            mode: 'cors',
            credentials: "include"
        };

        let response = await fetch(config.API_URL + '/api/logout', request);

        if (response.status === 200) {
            Router.push('/');
            deleteAllCookies();
        }
    }

    render(){
        return (
            <div className="alert alert-success">

                <div className="menu left-menu">
                    <Link href={"/"}>
                        <a className="menu-item">Home</a>
                    </Link>{' '}
                    |
                    <Link href={"/about"}>
                        <a className="menu-item">About</a>
                    </Link>{' '}
                </div>

                <img src={'../static/cicada.png'} className={"logo"}  alt="true" />

                <div className="menu right-menu">
                    <Link href={"/login"}>
                        <a className="menu-item">Login</a>
                    </Link>{' '}
                    |
                    <Link href={"/signup"}>
                        <a className="menu-item">SignUp</a>
                    </Link>{' '}
                    |
                    <Link href={"/notifications"}>
                        <a className="menu-item">Notifications</a>
                    </Link>{' '}
                    {/*{(()=>{*/}
                    {/*    if(getCookie('userId').length > 0) {*/}
                    {/*        return(*/}
                    {/*            <div>*/}
                    {/*                |*/}
                    {/*                <a onClick={this.logout} className="menu-item">Logout</a>*/}
                    {/*            </div>*/}
                    {/*        );*/}
                    {/*    }*/}
                    {/*})()}*/}
                </div>

                { /*language=SCSS*/ }
                <style jsx>{`
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