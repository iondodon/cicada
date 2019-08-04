import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';

class Pagination extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {
            currentPage: props.currentPage,
            totalItems: props.totalItems,
            itemsPerPage: props.itemsPerPage,
            pageNumbers: []
        };

        this.paginate = this.paginate.bind(this);
    }

    componentDidMount() {
        let pageNumbers = [];
        for(let i = 1; i <= Math.ceil(this.state.totalItems / this.state.itemsPerPage); i++) {
            pageNumbers.push(i);
        }
        this.setState({pageNumbers: pageNumbers});
    }

    paginate(e) {
        const number = parseInt(e.target.innerText);
        this.props.paginate(number);
    }

    render(){
        return (
            <div className="menu">


                <a className="menu-item">
                    <div className="pull-left">««</div> Previous
                </a>
                |
                {
                    this.state.pageNumbers.map(number => (
                        <a className="menu-item active" key={number} onClick={this.paginate}>
                            {number}
                        </a>
                    ))
                }
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
                  
                  a {
                    margin-left: 0.5rem;
                    margin-right: 0.5rem;
                  }
                `}
                </style>
            </div>
        );
    }
}

export default withNamespaces()(Pagination);