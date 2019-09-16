import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import config from "../configs/keys";
import Router from "next/dist/client/router";


class ContestForm extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {

        };


        this.closeError = this.closeError.bind(this);
    }

    componentDidMount() {

    }



    closeError(e) {
        e.target.parentElement.setAttribute('style', 'display: none;');
    }

    render(){
        return (
            <div className={"contest-form"}>

                create contest

                { /*language=SCSS*/ }
                <style jsx>{`
                  .contest-form {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                  }
                  
                  .alert {
                        display: flex;
                        flex-direction: row;
                        text-align: center;
                        margin-top: 1rem;
                        margin-bottom: 2rem;
                        justify-content: center;
                  }
                `}
                </style>
            </div>
        );
    }
}

export default withNamespaces()(ContestForm);