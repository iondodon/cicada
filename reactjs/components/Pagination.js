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
        this.showPrev = this.showPrev.bind(this);
        this.prev = this.prev.bind(this);
        this.showNext = this.showNext.bind(this);
        this.next = this.next.bind(this);
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
    }

    componentDidMount() {
        this.calculatePageNumbers();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.calculatePageNumbers();
    }

    paginate(e) {
        const number = parseInt(e.target.innerText);
        this.props.paginate(number);
    }

    showPrev() {
        if(this.props.currentPage !== 1){
            return(
                <a className="menu-item" onClick={this.prev}>
                    <div className="pull-left">««</div> Previous
                </a>
            )
        }
    }

    showNext() {
        let pages = Math.ceil(this.totalItems / this.itemsPerPage);
        if(this.props.currentPage !== pages){
            return(
                <a className="menu-item" onClick={this.next}>
                    Next <div className="pull-right">»»</div>
                </a>
            )
        }
    }

    prev() {
        this.props.prev();
    }

    next() {
        this.props.next();
    }

    render(){
        return (
            <div className="menu">

                {this.showPrev()}
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
                {this.showNext()}


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