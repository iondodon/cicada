import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';

class PuzzleActionBarMessage extends React.Component {

    constructor(props, {t}) {
        super(props, {t});
        this.t = t;

        this.state = {

        }
    }

    componentDidMount() {

    }


    render() {

        return(
            <div className="alert alert-warning">

                message

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

export default withNamespaces()(PuzzleActionBarMessage);