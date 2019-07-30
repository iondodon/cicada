import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';

class Pagination extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;
    }

    render(){
        return (
            <div className="menu">
                <a className="menu-item">
                    <div className="pull-left">««</div> Previous
                </a>
                |
                <a className="menu-item active">
                    1
                </a>
                |
                <a className="menu-item">
                    Next <div className="pull-right">»»</div>
                </a>

                { /*language=SCSS*/ }
                <style jsx>{`
                  .menu {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                    padding-right: 1rem;
                  }
                `}
                </style>
            </div>
        );
    }
}

export default withNamespaces()(Pagination);