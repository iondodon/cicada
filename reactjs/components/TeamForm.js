import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';


class TeamForm extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

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
                <fieldset className="form-group">
                    <label htmlFor="username">team name:</label>
                    <input id="team-name" type="text" placeholder="type your team name..." className="form-control"/>
                </fieldset>

                <table>
                    <thead>
                    <tr>
                        <th>no.</th>
                        <th>username</th>
                        <th>action</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>1</td>
                        <td>iondodon</td>
                        <td>
                            <button className="btn btn-error btn-ghost btn-block">remove</button>
                        </td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>
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
                    
                  }
                  
                  .username-input {
                    width: 100%;
                  }
                  
                  td {
                    text-align: center;
                  }
                `}
                </style>
            </div>
        );
    }
}

export default withNamespaces()(TeamForm);