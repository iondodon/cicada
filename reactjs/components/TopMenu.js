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
                    |
                    <Link href={"/about"}>
                        <a className="menu-item">About</a>
                    </Link>{' '}
                    |
                    <Link href={{ pathname: '/puzzle/update', query: { puzzleId: 3 } }}>
                        <a className="menu-item">Update puzzle 3</a>
                    </Link>{' '}
                    |
                    <Link href={{ pathname: '/team/update', query: { teamId: 1 } }}>
                        <a className="menu-item">Update team 1</a>
                    </Link>{' '}
                    |
                    <Link href={{ pathname: '/puzzle/show', query: { puzzleId: 3 } }}>
                        <a className="menu-item">Show</a>
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