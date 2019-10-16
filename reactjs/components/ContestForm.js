import React from 'react';
import Router from 'next/router';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import config from "../configs/keys";
import Head from "next/head";


class ContestForm extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {
            isPrivate: false
        };


        this.closeError = this.closeError.bind(this);
        this.saveContest = this.saveContest.bind(this);
        this.validForm = this.validForm.bind(this);
    }

    componentDidMount() {
        let component = this;

        $('#startsAt').datetimepicker({
            inline: true,
            startDate: new Date(),
            step: 1,
            minDate: new Date(),
            minTime: new Date(),
            onChangeDateTime: async function () {
                await component.setState({'startsAt': this.getValue()});
            }
        });

        $('#finishesAt').datetimepicker({
            inline: true,
            startDate: new Date(),
            step: 1,
            minDate: new Date(),
            minTime: new Date(),
            onChangeDateTime: async function () {
                await component.setState({'finishesAt': this.getValue()});
            }
        });
    }



    closeError(e) {
        e.target.parentElement.setAttribute('style', 'display: none;');
    }

    validForm() {
        let message = '';
        let goodForm = true;


        if(!this.state.contestName){
            message += 'Specify a contest name. </br>';
            goodForm = false;
        } else
        if(this.state.contestName.length < 4){
            message += 'Contest name should be at least 4 characters long. </br>';
            goodForm = false;
        }

        if(!this.state.puzzleName){
            message += 'Specify a puzzle name. </br>';
            goodForm = false;
        } else
        if(this.state.puzzleName.length < 3){
            message += 'Too short puzzle name. At least 3 characters.</br>';
            goodForm = false;
        }

        if(!this.state.code){
            this.setState({code: null});
        } else
        if(this.state.code && this.state.code.length < 4){
            message += 'The code should be at least 4 characters long.</br>';
            goodForm = false;
        }

        if(!this.state.startsAt) {
            message += 'Specify the time when the contest will start.</br>';
            goodForm = false;
        }

        if(!this.state.finishesAt){
            message += 'Specify the time when the contest will end.</br>';
            goodForm = false;
        }

        if(!goodForm){
            document.getElementsByClassName('error-content')[0].innerHTML = message;
            document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
        }

        return goodForm;
    }

    async saveContest() {
        if(!this.validForm()){
            return;
        }

        if(this.state.code === ''){
            await this.setState({code: null});
        }

        const request = {
            method: 'POST',
            mode: 'cors',
            credentials: "include",
            body: JSON.stringify(this.state)
        };

        try {
            let response = await fetch(config.API_URL + '/api/contests/create', request);

            if (response.status === 401) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unauthorized.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 201) {
                Router.push('/');
            } else if (response.status === 500) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Internal server error.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 400) {
                await response.text().then((a) => {
                    document.getElementsByClassName('error-content')[0].innerHTML = a;
                });
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unexpected error.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            }
        } catch (e) {
            document.getElementsByClassName('error-content')[0].innerHTML += e.message;
            document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
        }
    }

    render(){
        return (
            <div className={"contest-form"}>

                <div className={"form-group"}>
                    <label htmlFor="contest-name">contest name:</label>
                    <input id="contest-name"
                           type="text"
                           placeholder="contest name..."
                           className="form-control"
                           onChange={async (e) => {
                               await this.setState({contestName: e.target.value});
                           }}
                    />
                </div>

                <div className={"form-group"}>
                    <label htmlFor="puzzle-name">puzzle name:</label>
                    <input id="puzzle-name"
                           type="text"
                           placeholder="puzzle name..."
                           className="form-control"
                           onChange={async (e) => {
                               await this.setState({puzzleName: e.target.value});
                           }}
                    />
                </div>

                <div className={"form-group"}>
                    <label htmlFor="code">code:</label>
                    <input id="code"
                           type="text"
                           placeholder="code"
                           className="form-control"
                           onChange={async (e) => {
                               await this.setState({code: e.target.value});
                           }}
                    />
                </div>

                <label htmlFor="finishesAt"  className={"date-time-pickers"}>
                    starts at
                    <input name="startsAt" type="text" id="startsAt"/>
                    finishes at
                    <input name="finishesAt" type="text" id="finishesAt"/>
                </label>

                <label htmlFor="private" className={"is-private btn btn-success btn-ghost minus"}>Private
                    <input
                        type="checkbox"
                        className={"is-private-ck-box"}
                        checked={this.state.isPrivate}
                        onChange = {async (e) => {
                            await this.setState({isPrivate: e.target.checked});
                        }}
                    />
                </label>

                <button
                    className="btn btn-success btn-create"
                    onClick={this.saveContest}
                >Save</button>

                <div className="alert alert-error" style={{ display: 'none' }} >
                    <div className={"error-content"} >Error message</div>
                    {'\u00A0'} <a onClick={this.closeError}>x</a>
                </div>

                { /*language=SCSS*/ }
                <style jsx>{`
                  .contest-form {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                  }
                  
                  .btn-create {
                    width: 50%;
                    margin: auto;
                  }
                  
                  .date-time-pickers{
                    display: flex;
                    flex-direction: column;
                    margin: 3rem auto auto;
                    text-align: center;
                  }

                  .form-group {
                    display: flex;
                    flex-direction: row;
                    margin: 3rem auto auto;
                  }
                  
                  .btn {
                    margin-top: 3rem;
                  }

                  .is-private {
                    margin-top: 2rem;
                    margin-left: auto;
                    margin-right: auto;
                    cursor: auto;
                  }

                  .is-private > input {
                    cursor: pointer;
                  }

                  .minus, .plus {
                    padding: .3rem .7rem;
                    font-size: 1rem;
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