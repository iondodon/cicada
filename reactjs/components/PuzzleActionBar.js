import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import config from "../configs/keys";

class PuzzleActionBar extends React.Component {

    constructor(props, {t}) {
        super(props, {t});
        this.t = t;

        this.state = {

        }
    }

    async componentDidMount() {
        const request = {
            method: 'GET',
            mode: 'cors',
            'credentials': 'include'
        };

        try {
            const response = await fetch(config.API_URL + '/api/get-session/' + '1', request);
            console.log(await response.json());
        } catch(e) {
            console.log(e);
        }
    }


    render() {

        return(
            <div className="alert alert-warning">

                <button className="btn btn-warning">Solve solo</button>
                <button className="btn btn-warning">Solve in team</button>

                { /*language=SCSS*/ }
                <style jsx>{`                    
                    .alert {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                  }
                `}</style>
            </div>
        );
    }
}

export default withNamespaces()(PuzzleActionBar);