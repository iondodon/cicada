import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import config from "../configs/keys";
import Pagination from "./Pagination";


class TeamsMemberOf extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {
            teams: [],
            currentTeams: [],
            loading: false,
            currentPage: 1,
            teamsPerPage: 20
        };

        this.closeError = this.closeError.bind(this);
        this.paginate = this.paginate.bind(this);
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
    }

    componentDidMount() {
        const fetchTeams = async () => {
            this.setState({loading: true});

            const request = {
                method: 'GET',
                mode: 'cors',
                credentials: "include"
            };

            try {
                let response = await fetch(config.API_URL + '/api/teams', request);

                if (response.status === 401) {
                    document.getElementsByClassName('error-content')[0].innerHTML = 'Unauthorized.';
                    document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
                } else if (response.status === 200) {
                    let responseJson = await response.json();
                    this.setState({teams: responseJson});

                    const indexOfLastTeam = this.state.currentPage * this.state.teamsPerPage;
                    const indexOfFirstTeam = indexOfLastTeam - this.state.teamsPerPage;
                    this.setState({ currentTeams: this.state.teams.slice(indexOfFirstTeam, indexOfLastTeam) });

                    this.setState({loading: false});
                } else {
                    document.getElementsByClassName('error-content')[0].innerHTML = 'Unknown error.';
                    document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
                }
            } catch (e) {
                document.getElementsByClassName('error-content')[0].innerHTML += e.message;
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            }
        };


        fetchTeams().then();
    }

    async paginate(pageNumber) {
        await this.setState({currentPage: pageNumber});

        const indexOfLastTeam = pageNumber * this.state.teamsPerPage;
        const indexOfFirstTeam = indexOfLastTeam - this.state.teamsPerPage;
        await this.setState({ currentTeams: this.state.teams.slice(indexOfFirstTeam, indexOfLastTeam) });
    }

    async prev() {
        await this.setState({currentPage: this.state.currentPage - 1});

        const indexOfLastTeam = this.state.currentPage * this.state.teamsPerPage;
        const indexOfFirstTeam = indexOfLastTeam - this.state.teamsPerPage;
        await this.setState({ currentTeams: this.state.teams.slice(indexOfFirstTeam, indexOfLastTeam) });
    }

    async next() {
        await this.setState({currentPage: this.state.currentPage + 1});

        const indexOfLastTeam = this.state.currentPage * this.state.teamsPerPage;
        const indexOfFirstTeam = indexOfLastTeam - this.state.teamsPerPage;
        await this.setState({ currentTeams: this.state.teams.slice(indexOfFirstTeam, indexOfLastTeam) });
    }


    closeError(e) {
        e.target.parentElement.setAttribute('style', 'display: none;');
    }

    render(){
        if(this.state.loading){
            return(
                <div className={"list-teams_member_of"}>
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
                      
                      .list-teams_member_of {
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

        return (
            <div className={"list-teams_member_of"}>
                <table>
                    <thead>
                    <tr>
                        <th>name</th>
                        <th>nr members</th>
                    </tr>
                    </thead>
                    <tbody>

                    {
                        this.state.currentTeams.map((team) => {
                            return (
                                <tr key={team['id']} >
                                    <td>{ team['name'] }</td>
                                    <td>{ team['members'].length }</td>
                                </tr>
                            );
                        })
                    }

                    </tbody>
                </table>

                <Pagination
                    currentPage={this.state.currentPage}
                    paginate={this.paginate}
                    totalItems={this.state.teams.length}
                    itemsPerPage={this.state.teamsPerPage}
                    prev={this.prev}
                    next={this.next}
                />

                { /*language=SCSS*/ }
                <style jsx>{`                    
                  .list-teams_member_of {
                    display: flex;
                    flex-direction: column;
                  }
                `}
                </style>
            </div>
        );

    }
}

export default withNamespaces()(TeamsMemberOf);