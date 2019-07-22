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
                <div className="menu top-menu">
                    <Link href={"/"}>
                        <a className="menu-item">Home</a>
                    </Link>{' '}

                    |
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

                <img src={'../static/cicada.png'} className={"logo"}  alt="true" />

                { /*language=SCSS*/ }
                <style jsx>{`
                      .top-menu {
                        display: flex;
                        flex-direction: row;
                      }
                      
                      .alert {
                        display: flex;
                        flex-direction: row;
                        margin-top: 1rem;
                        overflow: hidden;
                      }
                      
                      .logo {
                        height: 10rem;
                      }
                    `}
                </style>
            </div>
        );
    }
}

export default withNamespaces()(TopMenu);