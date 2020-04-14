import React from 'react';
import Router from 'next/router';

import '../i18n';
import {withNamespaces} from 'react-i18next';
import config from "../configs/keys";
import { timestampToDateTime } from "../utlis/utlis";


class ContestForm extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {
            contestName: '',
            puzzleName: '',
            code: '',
            isPrivate: false
        };

        this.closeError = this.closeError.bind(this);
        this.saveContest = this.saveContest.bind(this);
        this.validForm = this.validForm.bind(this);
        this.updateContest = this.updateContest.bind(this);
        this.populateContestForm = this.populateContestForm.bind(this);
    }

    async componentDidMount() {
        let component = this;

        $('#startsAt').datetimepicker({
            inline: true,
            step: 1,
            minDate: new Date(),
            minTime: new Date(),
            onChangeDateTime: async function () {
                await component.setState({startsAt: this.getValue().toISOString()});
                await component.setState({timeSet_startsAt: true});
            }
        });

        $('#finishesAt').datetimepicker({
            inline: true,
            step: 1,
            minDate: new Date(),
            minTime: new Date(),
            onChangeDateTime: async function () {
                await component.setState({finishesAt: this.getValue().toISOString()});
                await component.setState({timeSet_finishesAt: true});
            }
        });

        if(this.props.isFor === 'update'){
            this.populateContestForm().then();
        }
    }

    async updateContest() {
        if(!this.validForm()){
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        this.contestId = urlParams.get('contestId');

        const request = {
            method: 'PUT',
            mode: 'cors',
            credentials: "include",
            body: JSON.stringify(this.state)
        };

        try {
            let response = await fetch(config.API_URL + '/api/contests/' + this.contestId, request);

            if (response.status === 401) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unauthorized.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 500) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Internal server error.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if(response.status === 204) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'No such contest found.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if(response.status === 200) {
                Router.push('/');
            } else {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unexpected error.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            }
        } catch (e) {
            document.getElementsByClassName('error-content')[0].innerHTML += e.message;
            document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
        }
    }



    async populateContestForm() {
        const urlParams = new URLSearchParams(window.location.search);
        this.contestId = urlParams.get('contestId');

        const request = {
            method: 'GET',
            mode: 'cors',
            credentials: "include"
        };

        try {
            let response = await fetch(config.API_URL + '/api/contests/get/' + this.contestId, request);

            if (response.status === 401) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unauthorized.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 500) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Internal server error.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if(response.status === 204) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'No such contest found.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if(response.status === 200) {
                let contestData = await response.json();

                await this.setState({contestName: contestData['name']});
                await this.setState({code: contestData['code']});

                let startsAt = timestampToDateTime(contestData['startsAt']['timestamp']);
                let finishesAt = timestampToDateTime(contestData['finishesAt']['timestamp']);

                await this.setState({startsAt: startsAt.toISOString()});
                await this.setState({finishesAt: finishesAt.toISOString()});

                $('#startsAt').datetimepicker('setOptions', {value: startsAt});
                $('#finishesAt').datetimepicker('setOptions', {value: finishesAt});

                await this.setState({timeSet_startsAt: false});
                await this.setState({timeSet_finishesAt: false});

                await this.setState({isPrivate: contestData['private']});
            } else {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unexpected error.';
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

        if(this.props.isFor !== 'update') {
            if (!this.state.puzzleName || this.state.puzzleName === '') {
                message += 'Specify a puzzle name. </br>';
                goodForm = false;
            } else if (this.state.puzzleName.length < 3) {
                message += 'Too short puzzle name. At least 3 characters.</br>';
                goodForm = false;
            }
        }

        if(!this.state.code){
            this.setState({code: ''});
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

        if(this.state.startsAt && this.state.finishesAt && new Date(this.state.startsAt).getTime() > new Date(this.state.finishesAt).getTime()){
            message += 'Start time bigger than the finish time.</br>';
            goodForm = false;
        }

        if(this.props.isFor === 'update') {
            if (!this.state['timeSet_startsAt']) {
                message += 'Set the start time.</br>';
                goodForm = false;
            }
            if (!this.state['timeSet_finishesAt']) {
                message += 'Set the finish time.</br>';
                goodForm = false;
            }
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
                           value={this.state.contestName}
                           onChange={async (e) => {
                               await this.setState({contestName: e.target.value});
                           }}
                    />
                </div>

                {
                    (()=>{
                        if(this.props.isFor !=='update'){
                            return(
                                <div className={"form-group"}>
                                    <label htmlFor="puzzle-name">puzzle name:</label>
                                    <input id="puzzle-name"
                                           type="text"
                                           placeholder="puzzle name..."
                                           className="form-control"
                                           value={this.state.puzzleName}
                                           onChange={async (e) => {
                                               await this.setState({puzzleName: e.target.value});
                                           }}
                                    />
                                </div>
                            );
                        }
                    })()
                }

                <div className={"form-group"}>
                    <label htmlFor="code">code:</label>
                    <input id="code"
                           type="text"
                           placeholder="code"
                           className="form-control"
                           value={this.state.code}
                           onChange={async (e) => {
                               await this.setState({code: e.target.value});
                           }}
                    />
                </div>

                <div className={"date-time-pickers"}>
                    <div className={"picker"}>
                        starts at
                        <input name="startsAt" type="text" id="startsAt"/>
                    </div>
                    <div className={"picker"}>
                        finishes at
                        <input name="finishesAt" type="text" id="finishesAt"/>
                    </div>
                </div>

                {/*<label htmlFor="private" className={"is-private btn btn-success btn-ghost minus"}>Private*/}
                {/*    <input*/}
                {/*        type="checkbox"*/}
                {/*        className={"is-private-ck-box"}*/}
                {/*        checked={this.state.isPrivate}*/}
                {/*        onChange = {async (e) => {*/}
                {/*            await this.setState({isPrivate: e.target.checked});*/}
                {/*        }}*/}
                {/*    />*/}
                {/*</label>*/}

                {
                    (() => {
                        if(this.props.isFor === 'update'){
                            return(
                                <button
                                    className="btn btn-success btn-create"
                                    onClick={this.updateContest}
                                >Save</button>
                            );
                        } else {
                            return(
                                <button
                                    className="btn btn-success btn-create"
                                    onClick={this.saveContest}
                                >Save</button>
                            );
                        }
                    })()
                }


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
                    margin-top: 3rem;
                    display: flex;
                    justify-content: space-around;
                    flex-direction: row;
                    //margin: 3rem auto auto;
                    //text-align: center;
                  }

                  .form-group {
                    display: flex;
                    flex-direction: row;
                    margin: 3rem auto auto;
                  }
                  
                  .picker {
                    text-align: center;
                  }
                  
                  .btn {
                    width: 100%;
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