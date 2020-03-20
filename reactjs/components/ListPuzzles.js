import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import Pagination from "./Pagination";
import config from "../configs/keys";
import Link from "next/link";

class ListPuzzles extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {
            puzzles: [],
            currentPuzzles: [],
            loading: false,
            currentPage: 1,
            puzzlesPerPage: 20
        };

        this.closeError = this.closeError.bind(this);
        this.paginate = this.paginate.bind(this);
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
    }

    componentDidMount() {
        const fetchPuzzles = async () => {
            this.setState({loading: true});

            const request = {
                method: 'GET',
                mode: 'cors',
                credentials: "include"
            };

            try {
                let response;
                if(this.props.type === "all") {
                    response = await fetch(config.API_URL + '/api/puzzles', request);
                } else if(this.props.type === "my") {
                    response = await fetch(config.API_URL + '/api/my_puzzles', request);
                }

                if (response.status === 401) {
                    document.getElementsByClassName('error-content')[0].innerHTML = 'Unauthorized.';
                    document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
                } else if (response.status === 200) {
                    let responseJson = await response.json();
                    this.setState({puzzles: responseJson});

                    console.log(responseJson);

                    const indexOfLastPuzzle = this.state.currentPage * this.state.puzzlesPerPage;
                    const indexOfFirstPuzzle = indexOfLastPuzzle - this.state.puzzlesPerPage;
                    this.setState({ currentPuzzles: this.state.puzzles.slice(indexOfFirstPuzzle, indexOfLastPuzzle) });

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


        fetchPuzzles().then();
    }

    closeError(e) {
        e.target.parentElement.setAttribute('style', 'display: none;');
    }

    async paginate(pageNumber) {
        await this.setState({currentPage: pageNumber});

        const indexOfLastPuzzle = pageNumber * this.state.puzzlesPerPage;
        const indexOfFirstPuzzle = indexOfLastPuzzle - this.state.puzzlesPerPage;
        await this.setState({ currentPuzzles: this.state.puzzles.slice(indexOfFirstPuzzle, indexOfLastPuzzle) });
    }

    async prev() {
        await this.setState({currentPage: this.state.currentPage - 1});

        const indexOfLastPuzzle = this.state.currentPage * this.state.puzzlesPerPage;
        const indexOfFirstPuzzle = indexOfLastPuzzle - this.state.puzzlesPerPage;
        await this.setState({ currentPuzzles: this.state.puzzles.slice(indexOfFirstPuzzle, indexOfLastPuzzle) });
    }

    async next() {
        await this.setState({currentPage: this.state.currentPage + 1});

        const indexOfLastPuzzle = this.state.currentPage * this.state.puzzlesPerPage;
        const indexOfFirstPuzzle = indexOfLastPuzzle - this.state.puzzlesPerPage;
        await this.setState({ currentPuzzles: this.state.puzzles.slice(indexOfFirstPuzzle, indexOfLastPuzzle) });
    }

    render(){
        if(this.state.loading){
            return(
                <div className={"list-puzzles-container"}>
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
                      
                      .list-puzzles-container {
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

        if(this.state.puzzles.length === 0) {
            return(<h2> empty </h2>);
        }

        return (
            <div className={"list-puzzles-container"}>
                <table>
                    <thead>
                    <tr>
                        <th>name</th>
                        <th>difficulty</th>
                        <th>solved</th>
                        <th>stages</th>
                    </tr>
                    </thead>
                    <tbody>

                    {
                        this.state.currentPuzzles.map((puzzle) => {
                            return (
                                <tr key={puzzle['id']} >
                                    <td>
                                        <Link href={{ pathname: '/puzzle/show', query: { puzzleId: puzzle['id'] } }}>
                                            <a className="menu-item">{ puzzle['name'] }</a>
                                        </Link>{' '}
                                    </td>
                                    <td>{ puzzle['difficultyByCreator'] }/{ puzzle['difficultyByStatistics'] }</td>
                                    <td> {puzzle['solved']} </td>
                                    <td>{ puzzle['stagesCount'] }</td>
                                </tr>
                            );
                        })
                    }

                    </tbody>
                </table>

                <Pagination
                    currentPage={this.state.currentPage}
                    paginate={this.paginate}
                    totalItems={this.state.puzzles.length}
                    itemsPerPage={this.state.puzzlesPerPage}
                    prev={this.prev}
                    next={this.next}
                />

                { /*language=SCSS*/ }
                <style jsx>{`                    
                  .list-puzzles-container {
                    display: flex;
                    flex-direction: column;
                  }
                `}
                </style>
            </div>
        );
    }
}

export default withNamespaces()(ListPuzzles);