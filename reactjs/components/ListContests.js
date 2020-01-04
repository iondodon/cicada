import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import Pagination from "./Pagination";
import config from "../configs/keys";
import Link from "next/link";

class ListContests extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {
            contests: [],
            currentContests: [],
            loading: false,
            currentPage: 1,
            contestsPerPage: 20
        };

        this.closeError = this.closeError.bind(this);
        this.paginate = this.paginate.bind(this);
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
    }

    componentDidMount() {
        const fetchContests = async () => {
            this.setState({loading: true});

            const request = {
                method: 'GET',
                mode: 'cors',
                credentials: "include"
            };

            try {
                let response;
                if(this.props.type === "all") {
                    response = await fetch(config.API_URL + '/api/contests', request);
                } else if(this.props.type === "my") {
                    response = await fetch(config.API_URL + '/api/my_contests', request);
                }

                if (response.status === 401) {
                    document.getElementsByClassName('error-content')[0].innerHTML = 'Unauthorized.';
                    document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
                } else if (response.status === 200) {
                    let responseJson = await response.json();
                    this.setState({contests: responseJson});

                    const indexOfLastContest = this.state.currentPage * this.state.contestsPerPage;
                    const indexOfFirstContest = indexOfLastContest - this.state.contestsPerPage;
                    this.setState({ currentContests: this.state.contests.slice(indexOfFirstContest, indexOfLastContest) });

                    this.setState({loading: false});
                } else {
                    document.getElementsByClassName('error-content')[0].innerHTML = 'Unknown error. Check the fields and try again.';
                    document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
                }
            } catch (e) {
                document.getElementsByClassName('error-content')[0].innerHTML += e.message;
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            }
        };


        fetchContests().then();
    }

    closeError(e) {
        e.target.parentElement.setAttribute('style', 'display: none;');
    }

    async paginate(pageNumber) {
        await this.setState({currentPage: pageNumber});

        const indexOfLastContest = pageNumber * this.state.contestsPerPage;
        const indexOfFirstContest = indexOfLastContest - this.state.contestsPerPage;
        await this.setState({ currentContests: this.state.contests.slice(indexOfFirstContest, indexOfLastContest) });
    }

    async prev() {
        await this.setState({currentPage: this.state.currentPage - 1});

        const indexOfLastContest = this.state.currentPage * this.state.contestsPerPage;
        const indexOfFirstContest = indexOfLastContest - this.state.contestsPerPage;
        await this.setState({ currentContests: this.state.contests.slice(indexOfFirstContest, indexOfLastContest) });
    }

    async next() {
        await this.setState({currentPage: this.state.currentPage + 1});

        const indexOfLastContest = this.state.currentPage * this.state.contestsPerPage;
        const indexOfFirstContest = indexOfLastContest - this.state.contestsPerPage;
        await this.setState({ currentContests: this.state.contests.slice(indexOfFirstContest, indexOfLastContest) });
    }

    render(){
        if(this.state.loading){
            return(
                <div className={"list-contests-container"}>
                    <div className="alert alert-error" style={{ display: 'none' }} >
                        <div className={"error-content"} >Error message</div>
                        {'\u00A0'} <a onClick={this.closeError}>x</a>
                    </div>
                    <h2>loading...</h2>

                    { /*language=SCSS*/ }
                    <style jsx>{`
                      .alert {
                            display: flex;
                            flex-direction: row;
                            text-align: center;
                            margin-top: 2rem;
                            margin-bottom: 0;
                            justify-content: center;
                      }
                      
                      .list-contests-container {
                        display: flex;
                        flex-direction: column;
                      }
                      
                      h2 {
                        margin-top: 1rem;
                      }
                    `}
                    </style>
                </div>
            );
        }

        if(this.state.contests.length === 0) {
            return(<h2> empty </h2>);
        }

        const showCreatedByHead = () => {
            if(this.props.type === "all") {
                return (
                    <th>created by</th>
                );
            }
        };

        const showCreatedBy = (contest) => {
            if(this.props.type === "all") {
                return(
                    <td>{ contest['createdBy']['user']['fullName'] }</td>
                );
            }
        };

        return (
            <div className={"list-contests-container"}>
                <table>
                    <thead>
                    <tr>
                        <th>id</th>
                        <th>name</th>
                        <th>puzzle</th>
                        {
                            showCreatedByHead()
                        }
                    </tr>
                    </thead>
                    <tbody>

                    {
                        this.state.currentContests.map((contest) => {
                            return (
                                <tr key={contest['id']} >
                                    <td>{ contest['id'] }</td>
                                    <td>
                                        <Link href={{ pathname: '/contest/show', query: { contestId: contest['id'] } }}>
                                            <a className="menu-item">{ contest['name'] }</a>
                                        </Link>{' '}
                                    </td>
                                    <td>{ contest['puzzle']['name'] }</td>
                                    { showCreatedBy(contest) }
                                </tr>
                            );
                        })
                    }

                    </tbody>
                </table>

                <Pagination
                    currentPage={this.state.currentPage}
                    paginate={this.paginate}
                    totalItems={this.state.contests.length}
                    itemsPerPage={this.state.contestsPerPage}
                    prev={this.prev}
                    next={this.next}
                />

                { /*language=SCSS*/ }
                <style jsx>{`
                  .list-contests-container {
                    display: flex;
                    flex-direction: column;
                  }
                `}
                </style>
            </div>
        );
    }
}

export default withNamespaces()(ListContests);