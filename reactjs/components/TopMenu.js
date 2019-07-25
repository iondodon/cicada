import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';

import Link from 'next/link';

class TopMenu extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;
    }

    render(){
        return (
            <div className="alert alert-success">

                <div className="menu left-menu">
                    <Link href={"/"}>
                        <a className="menu-item">Home</a>
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
                    <a className="menu-item">About</a>
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
                        justify-content: space-evenly;
                        margin-top: 1rem;
                        margin-left: 1rem;
                        margin-right: 1rem;
                        overflow: hidden;
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