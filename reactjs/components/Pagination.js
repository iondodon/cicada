import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';

class Pagination extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.calculatePageNumbers();

        this.paginate = this.paginate.bind(this);
        this.calculatePageNumbers = this.calculatePageNumbers.bind(this);
    }

    calculatePageNumbers() {
        this.currentPage = this.props.currentPage;
        this.totalItems = this.props.totalItems;
        this.itemsPerPage = this.props.itemsPerPage;

        let pages = Math.ceil(this.totalItems / this.itemsPerPage);
        let pageNumbers = [];
        for(let i = this.currentPage - 5; i <= this.currentPage + 5 ; i++) {
            if(i >= 1 && i <= pages) {
                pageNumbers.push(i);
            }
        }
        this.pageNumbers = pageNumbers;
        console.log(this.pageNumbers);
    }

    componentDidMount() {
        this.calculatePageNumbers();
    }

    componentWillUpdate(prevProps, prevState, snapshot) {
        this.calculatePageNumbers();
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
                    this.pageNumbers.map(number => {
                            let classname = "menu-item ";
                            if(number === this.props.currentPage) {
                                classname += "active";
                            }

                            return(
                                <a className={classname} key={number} onClick={this.paginate}>
                                    {number}
                                </a>
                            )
                        }
                    )
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