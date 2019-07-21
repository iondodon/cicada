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

                { /*language=SCSS*/ }
                <style jsx>{`
                  .top-menu {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    margin-bottom: 1rem;
                  }
                `}
                </style>
            </div>
        );
    }
}

export default withNamespaces()(TopMenu);