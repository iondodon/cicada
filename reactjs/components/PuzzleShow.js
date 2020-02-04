import React from "react";

import '../i18n';
import { withNamespaces } from 'react-i18next';
import config from "../configs/keys";
import {timeConverter} from '../utlis/utlis';
import PuzzleSession from "./PuzzleSession";
import Cookies from 'js-cookie';

class PuzzleShow extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {
            loading: true,
        };

        this.fetchSetState = this.fetchSetState.bind(this);
        this.prepareState = this.prepareState.bind(this);
        this.closeError = this.closeError.bind(this);
        this.deletePuzzle = this.deletePuzzle.bind(this);
    }

    async componentDidMount() {
        await this.fetchSetState();
    }

    async fetchSetState() {
        const urlParams = new URLSearchParams(window.location.search);
        this.puzzleId = urlParams.get('puzzleId');

        const request = {
            method: 'GET',
            mode: 'cors',
            credentials: "include"
        };

        try {
            let response = await fetch(config.API_URL + '/api/puzzles/' + this.puzzleId, request);

            if (response.status === 401) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unauthorized.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 204) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Such puzzle doesn\'t exist.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 200) {
                let responseJson = await response.json();
                await this.prepareState(responseJson);
                await this.setState({ loading: false });
            } else {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unknown error. Check the fields and try again.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            }
        } catch (e) {
            document.getElementsByClassName('error-content')[0].innerHTML += e.message;
            document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
        }
    }

    async prepareState(responseJson) {
        await this.setState({puzzleId: responseJson['id']});
        await this.setState({ name: responseJson['name'] });
        await this.setState( { createdBy: responseJson['createdBy']['user']['fullName'] } );
        await this.setState({userId: responseJson['createdBy']['user']['id']});
        await this.setState( { createdAt: timeConverter(responseJson['createdAt']['timestamp']) } );
        if(responseJson['updatedAt']) {
            await this.setState( { updatedAt: timeConverter(responseJson['updatedAt']['timestamp']) } );
        }
        await this.setState( { difficultyByCreator: responseJson['difficultyByCreator'] } );
        await this.setState( { difficultyByStatistics: responseJson['difficultyByStatistics'] } );
        await this.setState( { tags: responseJson['tags'] } );
        await this.setState( { enrolledTeams: responseJson['enrolledTeams'] } );
        await this.setState( { description: responseJson['description'] } );
    }

    async deletePuzzle() {
        const urlParams = new URLSearchParams(window.location.search);
        this.puzzleId = urlParams.get('puzzleId');

        const request = {
            method: 'DELETE',
            mode: 'cors',
            credentials: "include"
        };

        try {
            let response = await fetch(config.API_URL + '/api/puzzles/destroy/' + this.puzzleId, request);

            if (response.status === 401) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unauthorized.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 204) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Such puzzle doesn\'t exist.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 200) {
                document.location = '/';
            } else {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unknown error. Check the fields and try again.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            }
        } catch (e) {
            document.getElementsByClassName('error-content')[0].innerHTML += e.message;
            document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
        }
    }

    closeError(e) {
        e.target.parentElement.setAttribute('style', 'display: none;');
    }

    render(){
        if(this.state.loading) {
            return(
                <div className={"puzzle-data"}>
                    <div className="alert alert-error" style={{ display: 'none' }} >
                        <div className={"error-content"} >Error message</div>
                        {'\u00A0'} <a onClick={this.closeError}>x</a>
                    </div>
                    <h2>loading...</h2>

                    { /*language=SCSS*/ }
                    <style jsx>{`
                      .puzzle-data {
                        display: flex;
                        flex-direction: column;
                      }
    
                      .alert {
                            display: flex;
                            flex-direction: row;
                            text-align: center;
                            margin-top: 2rem;
                            margin-bottom: 0;
                            justify-content: center;
                      }
                    `}</style>
                </div>
            );
        }

        const showUpdatedAt = () => {
            if(this.state['updatedAt']) {
                return(
                    <h2>updated at: { this.state['updatedAt'] }</h2>
                );
            }
        };

        return (
            <div className={"puzzle-data"} >
                <div className="alert alert-error" style={{ display: 'none' }} >
                    <div className={"error-content"} >Error message</div>
                    {'\u00A0'} <a onClick={this.closeError}>x</a>
                </div>

                <h2>name: { this.state['name'] } </h2>
                <h2>created by: { this.state['createdBy'] }</h2>
                <h2>created at: { this.state['createdAt'] } </h2>
                { showUpdatedAt() }
                <h2>difficulty by creator: { this.state['difficultyByCreator'] }</h2>
                <h2>difficulty by statistics: { this.state['difficultyByStatistics'] }</h2>
                <h2>tags: </h2>
                <div className={'tags'}>
                    {
                        this.state.tags.map((tag) => {
                            return(
                                <a key={tag['id']} className={'tag-link'}>{tag['tag']}</a>
                            )
                        })
                    }
                </div>

                <h2>description:</h2>
                <div className={"description"} dangerouslySetInnerHTML={{__html:this.state['description']}} />

                {(()=>{
                    if(Cookies.get('userId')) {
                        return(<PuzzleSession/>);
                    }
                })()}

                {(()=>{
                    if(this.state['userId'] == Cookies.get('userId')) {
                        return(
                            <div className="alert alert-info">
                                <div className="btn-group">
                                    <button className="btn btn-primary btn-ghost update-btn"
                                            onClick={()=>{
                                                document.location = '/puzzle/update?puzzleId=' + this.state['puzzleId'];
                                            }}
                                        >Update</button>
                                    <button className="btn btn-error btn-ghost"
                                            onClick={async ()=>{
                                                if(confirm("Are you sure?")) {
                                                    await this.deletePuzzle();
                                                }
                                            }}
                                        >Delete</button>
                                </div>
                            </div>
                        );
                    }
                })()}

                { /*language=SCSS*/ }
                <style jsx>{`
                  .puzzle-data {
                    display: flex;
                    flex-direction: column;
                  }
                  
                  .update-btn {
                    margin-right: 1rem;
                  }
                  
                  .enrolled-players, .enrolled-teams, .tags {
                    margin-bottom: 2rem;
                  }

                  .players-link, .team-link, .tag-link {
                    margin-right: 0.5rem;
                  }
                  
                  .description {
                    margin: 0;
                  }

                  .alert {
                        display: flex;
                        flex-direction: row;
                        text-align: center;
                        margin-top: 2rem;
                        margin-bottom: 0;
                        justify-content: center;
                  }
                `}</style>
            </div>
        );
    }
}

export default withNamespaces()(PuzzleShow);