import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import config from "../configs/keys";


class TeamForm extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {
            newMemberUsername: "",
            members: ["iondodon"]
        };

        this.addNewMember = this.addNewMember.bind(this);
        this.closeError = this.closeError.bind(this);
        this.removeMember = this.removeMember.bind(this);
    }

    componentDidMount() {
        // language=JQuery-CSS
        $('.tags-multiple-select').select2({
            placeholder: 'Select users',
            width: '100%'
        });

        $('.tags-multiple-select').on('change', () => {
            let user = this.searchUser();
        });
    }

    async removeMember(e) {
        let username = e.target.parentNode.parentNode.childNodes[1].innerText;

        let r = confirm('Press OK to confirm.');

        // let array = [...this.state.members];
        // let index = this.findInAttr(array, username);
        // console.log(index);
        // if (index !== -1) {
        //     array.splice(index, 1);
        //     await this.setState({members: array});
        // }

        if(r === true){
            this.state.members.find(
                async (memberUsername, index, arr) => {
                    if(memberUsername === username) {
                        let array = [...this.state.members];
                        array.splice(index, 1);
                        await this.setState({members: array});
                    }
                }
            );
        }
    }

    async addNewMember() {
        if(this.state.newMemberUsername === "") {
            document.getElementsByClassName('error-content')[0].innerHTML = 'Specify a username';
            document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            return;
        }

        const request = {
            method: 'GET',
            mode: 'cors',
            credentials: "include"
        };

        try {
            let response = await fetch(config.API_URL + '/api/users/exists/' + this.state.newMemberUsername, request);

            if (response.status === 401) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unauthorized.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 204) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Such user doesn\'t exist.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 302) {
                const getUsernameFromState = () => {
                    return this.state.members.find((memberUsername) => {
                        return memberUsername === this.state.newMemberUsername;
                    })
                };

                if(!getUsernameFromState()) {
                    await this.setState( { members: [...this.state.members, this.state.newMemberUsername ] } );
                } else {
                    document.getElementsByClassName('error-content')[0].innerHTML = this.state.newMemberUsername + ' is already a member.';
                    document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
                }
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

    render(){
        return (
            <div className={"team-form"}>
                <h2>name:</h2>

                <fieldset className="form-group">
                    <input id="team-name" type="text" placeholder="type your team name..." className="form-control"/>
                </fieldset>

                <h2>members:</h2>

                <table>
                    <thead>
                    <tr>
                        <th>no.</th>
                        <th>username</th>
                        <th>action</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.members.map((member, index) => {
                                return(
                                    <tr key={member}>
                                        <td>{index + 1}</td>
                                        <td>{member}</td>
                                        <td>
                                            <button className="btn btn-error btn-ghost btn-block" onClick={this.removeMember}>remove</button>
                                        </td>
                                    </tr>
                                );
                            })
                        }

                        <tr>
                            <td>{this.state.members.length + 1}</td>
                            <td className={"td-content-center"}>
                                <fieldset className="form-group">
                                    <input
                                        type="text"
                                        placeholder="username..."
                                        className={"form-control username-input"}
                                        onChange={async (event) => {
                                            await this.setState( { newMemberUsername: event.target.value } );
                                        }}
                                    />
                                </fieldset>
                            </td>
                            <td>
                                <button className="btn btn-success btn-ghost btn-block" onClick={this.addNewMember}>add</button>
                            </td>
                        </tr>

                    </tbody>
                </table>


                <div className="alert alert-error" style={{ display: 'none' }} >
                    <div className={"error-content"} >Error message</div>
                    {'\u00A0'} <a onClick={this.closeError}>x</a>
                </div>

                <button className="btn btn-success btn-block">Save</button>

                { /*language=SCSS*/ }
                <style jsx>{`
                  .team-form {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                  }
                  
                  .username-input {
                    width: 100%;
                  }
                  
                  td {
                    vertical-align: middle;
                  }
                  
                  .form-group {
                    text-align: center;
                    margin-bottom: 2rem;
                  }
                  
                  input {
                    text-align: center;
                  }
                  
                  th {
                    border: none;
                  }
                  
                  td {
                    text-align: center;
                    border: none;
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

export default withNamespaces()(TeamForm);