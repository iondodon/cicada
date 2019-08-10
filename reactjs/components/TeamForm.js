import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';


class TeamForm extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {
            members: ["iondodon"]
        };

        this.searchUser = this.searchUser.bind(this);
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

    searchUser() {

        return null;
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
                                            <button className="btn btn-error btn-ghost btn-block">remove</button>
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
                                        id="username"
                                        type="text"
                                        placeholder="username..."
                                        className={"form-control username-input"}
                                    />
                                    <div className="help-block">...</div>
                                </fieldset>
                            </td>
                            <td>
                                <button className="btn btn-success btn-ghost btn-block">add</button>
                            </td>
                        </tr>

                    </tbody>
                </table>

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
                `}
                </style>
            </div>
        );
    }
}

export default withNamespaces()(TeamForm);