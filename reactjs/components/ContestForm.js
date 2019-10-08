import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import config from "../configs/keys";


class ContestForm extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {
            isPrivate: false
        };


        this.closeError = this.closeError.bind(this);
        this.saveContest = this.saveContest.bind(this);
    }

    componentDidMount() {
        // language=JQuery-CSS
        $('#startsAt').datetimepicker({
            inline: true,
            ownerDocument: document,
            contentWindow: window,
            onChangeDateTime: function () {
                console.log(this.getValue());
            },
            format: 'Y/m/d H:i'
        });

        $('#finishesAt').datetimepicker({
            inline: true,
            ownerDocument: document,
            contentWindow: window,
            onChangeDateTime: function () {
                console.log(this.getValue());
            },
            format:'Y/m/d H:i'
        });
    }



    closeError(e) {
        e.target.parentElement.setAttribute('style', 'display: none;');
    }

    async saveContest() {
        // $('#startsAt').datetimepicker('toggle');
        // $('#finishesAt').datetimepicker('toggle');

        console.log($('#startsAt').datetimepicker('getValue'));
        console.log($('#finishesAt').datetimepicker('getValue'));

        // const request = {
        //     method: 'POST',
        //     mode: 'cors',
        //     credentials: "include"
        // };
        //
        // try {
        //     let response = await fetch(config.API_URL + '/api/contests/create', request);
        //
        //     if (response.status === 401) {
        //         document.getElementsByClassName('error-content')[0].innerHTML = 'Unauthorized.';
        //         document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
        //     } else if (response.status === 302) {
        //
        //     } else {
        //         document.getElementsByClassName('error-content')[0].innerHTML = 'Unexpected error.';
        //         document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
        //     }
        // } catch (e) {
        //     document.getElementsByClassName('error-content')[0].innerHTML += e.message;
        //     document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
        // }
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
                    <label htmlFor="key">key:</label>
                    <input id="key"
                           type="text"
                           placeholder="key"
                           className="form-control"
                           onChange={async (e) => {
                               await this.setState({key: e.target.value});
                           }}
                    />
                </div>

                <div className={"form-group"}>
                    starts at - finishes at
                </div>

                <label htmlFor="finishesAt"  className={"form-group"}>
                    <input name="startsAt" type="text" id="startsAt"/>
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