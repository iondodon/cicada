import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import config from "../configs/keys";
import ShowPuzzleStatus from "./ShowPuzzleStatus";

class PuzzleActionBar extends React.Component {

    constructor(props, {t}) {
        super(props, {t});
        this.t = t;

        this.state = {
            enrolled: false
        };

        this.enrollSinglePlayer = this.enrollSinglePlayer.bind(this);
    }

    async componentDidMount() {
        const urlParams = new URLSearchParams(window.location.search);
        this.puzzleId = urlParams.get('puzzleId');

        const request = {
            method: 'GET',
            mode: 'cors',
            'credentials': 'include'
        };

        try {
            const response = await fetch(config.API_URL + '/api/get-session/' + this.puzzleId, request);
            console.log(await response.json());
        } catch(e) {
            console.log(e);
        }
    }

    async enrollSinglePlayer() {
        const urlParams = new URLSearchParams(window.location.search);
        this.puzzleId = urlParams.get('puzzleId');

        const request = {
            method: 'POST',
            mode: 'cors',
            'credentials': 'include'
        };

        try {
            let response = await fetch(config.API_URL + '/api/enroll-single-player/' + this.puzzleId, request);
            console.log(response);

            if(response.status === 200){
                await this.setState({enrolled: true});
            }
        } catch(e) {
            console.log(e);
        }
    }


    render() {

        return(
            <div className="alert alert-warning">

                {
                    (()=>{
                        if(this.state['enrolled']){
                            return(<ShowPuzzleStatus/>);
                        } else {
                            return(
                                <div className={"action"}>
                                    <button className="btn btn-warning" onClick={this.enrollSinglePlayer}>Solve solo</button>
                                    <button className="btn btn-warning">Solve with a team</button>
                                </div>
                            );
                        }
                    })()
                }

                { /*language=SCSS*/ }
                <style jsx>{`                    
                    .alert {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                    }
                    
                    .action {
                      display: flex;
                      flex-direction: row;
                      justify-content: center;
                    }
                `}</style>
            </div>
        );
    }
}

export default withNamespaces()(PuzzleActionBar);