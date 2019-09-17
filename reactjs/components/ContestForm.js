import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';


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

                <div className={"form-group"}>
                    <label htmlFor="contest-name">contest name:</label>
                    <input id="contest-name"
                           type="text"
                           placeholder="contest name..."
                           className="form-control"
                    />
                </div>

                <div className={"form-group"}>
                    <label htmlFor="puzzle-name">puzzle name:</label>
                    <input id="puzzle-name"
                           type="text"
                           placeholder="puzzle name..."
                           className="form-control"
                    />
                </div>

                <div className={"form-group"}>
                    <label htmlFor="key">key:</label>
                    <input id="key"
                           type="text"
                           placeholder="key"
                           className="form-control"
                    />
                </div>

                <label htmlFor="private" className={"is-private btn btn-success btn-ghost minus"}>Private
                    <input
                        type="checkbox"
                        className={"is-private-ck-box"}
                        checked={this.state.isPrivate}
                        onChange = {this.setIsPrivate}
                    />
                </label>

                <div className={"form-group"}>
                    <input type="datetime-local" name="finishesAt"/>
                </div>

                { /*language=SCSS*/ }
                <style jsx>{`
                  .contest-form {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                  }
                  
                  .form-group {
                    display: flex;
                    flex-direction: row;
                    margin: auto;
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