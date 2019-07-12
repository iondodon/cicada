import React from 'react';
import dynamic from 'next/dynamic'

import '../i18n';
import { withNamespaces } from 'react-i18next';
import Stage from "./Stage";

const CKEditor = dynamic(() => import('../components/CKEditor'), {
    ssr: false
});

class CreatePuzzleForm extends React.Component {

    constructor({t}){
        super({t});
        this.t = t;

        this.state = {
            name: '',
            difficulty: 1,
            private: false,
            stagesCount: 1
        };

        this.difficulty = 1;
        this.stages = [Stage];

        this.toggleStage = this.toggleStage.bind(this);
        this.difficultyUp = this.difficultyUp.bind(this);
        this.difficultyDown = this.difficultyDown.bind(this);
        this.updateDifficulty = this.updateDifficulty.bind(this);
        this.getScene = this.getScene.bind(this);
        this.addNewScene = this.addNewScene.bind(this);
    }

    componentDidMount() {
        // language=JQuery-CSS
        $('.js-example-basic-multiple').select2();
        //TODO: $ undefined - sometimes
    }

    difficultyUp(e) {
        if(parseInt(this.difficulty) + 1 <= 5){
            this.difficulty = parseInt(this.difficulty) + 1;
            e.target.parentElement.querySelector('.quantity').innerHTML = ''+this.difficulty;
            this.updateDifficulty();
        }
    }

    difficultyDown(e) {
        if(parseInt(this.difficulty) - 1 > 0){
            this.difficulty = parseInt(this.difficulty) - 1;
            e.target.parentElement.querySelector('.quantity').innerHTML = ''+this.difficulty;
            this.updateDifficulty();
        }
    }

    updateDifficulty(){
        this.setState({difficulty: this.difficulty});
    }

    static getInitialProps({ req, query }) {
        return {}
    }

    toggleStage(e){
        let cardContent = e.target.parentElement.parentElement.querySelector('.card-content');

        if(cardContent.style.display !== 'none'){
            cardContent.setAttribute('style', 'display: none;');
            e.target.innerHTML = '+';
        } else {
            cardContent.setAttribute('style', 'display: block;');
            e.target.innerHTML = '-';
        }
    }

    getScene(){
        return(
            <div className="card stage">
                <header className="card-header">
                    <div className="pull-left stage-word">Stage 1</div>
                    <div className="pull-right open-stage" onClick={this.toggleStage}>-</div>
                    <p/>
                </header>
                <div className="card-content">
                    <CKEditor
                        data="<p>New stage description...</p>"
                        onInit={ editor => {
                            // You can store the "editor" and use when it is needed.

                        } }
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();

                        } }
                        onBlur={ editor => {

                        } }
                        onFocus={ editor => {

                        } }
                    />
                </div>
            </div>
        );
    }

    addNewScene(e){
        e.target.appendChild(this.getScene());
    }

    render(){
        return (
            <form className="form" id={"create-puzzle-from"}>
                <fieldset className="form-group">
                    <label >Name:</label>
                    <input type="text" placeholder="puzzle name..." className="form-control"/>
                </fieldset>
                <fieldset className="form-group">
                    <label htmlFor="email">EMAIL:</label>
                    <input id="email" type="email" placeholder="" className="form-control"/>
                </fieldset>

                <div className="form-tags-group">
                    <label htmlFor="tags" className="label-tags">Tags:</label>
                    <select className="js-example-basic-multiple" name="states[]" multiple="multiple">
                        <option value="AL">Alabama</option>
                        <option value="WY">Wyoming</option>
                        <option value="AL">Alabama</option>
                        <option value="WY">Wyoming</option>
                    </select>
                </div>

                <fieldset>
                    <label htmlFor="private">Private <input type="checkbox"/></label>
                    <label htmlFor="difficulty">Difficulty
                        <div className="number-input">
                            <div onClick={this.difficultyDown} className="btn btn-success btn-ghost minus">-</div>
                            <div className="quantity btn btn-success btn-ghost" onChange={this.updateDifficulty}> 1 </div>
                            <div onClick={this.difficultyUp} className="btn btn-success btn-ghost minus plus">+</div>
                        </div>
                    </label>
                </fieldset>

                <div className={"puzzle-description"}>
                    <CKEditor
                        data="<p>Puzzle description...</p>"
                        onInit={ editor => {
                            // You can store the "editor" and use when it is needed.

                        } }
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();

                        } }
                        onBlur={ editor => {

                        } }
                        onFocus={ editor => {

                        } }
                    />
                    {/*TODO: CKEditor overlaps page content */}
                </div>


                <div className={"stages-cards"}>
                    { this.stages }
                    <div className={"btn btn-primary btn-ghost btn-block btn-add-scene"} onClick={this.addNewScene}>Add scene</div>
                </div>

                <button className={"btn btn-success btn-block btn-save-puzzle"}>Save puzzle</button>


                { /*language=SCSS*/ }
                <style jsx>{`
                  .form {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    margin: auto;
                    width: 100%;
                  }

                  fieldset {
                    width: 50%;
                  }

                  .form-tags-group {
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                    width: 46%;
                    margin-right: 4%;
                  }

                  label {
                    width: 20%;
                  }

                  .js-example-basic-multiple {
                    flex-grow: 100;
                  }

                  .label-tags {
                    padding-left: 0;
                    width: auto;
                    height: auto;
                    margin: auto;
                  }

                  .puzzle-description, .stage {
                    margin-top: 10px;
                    width: 100%;
                  }

                  .stage-word {
                    margin-left: 1rem;
                  }

                  .open-stage {
                    margin-right: 1rem;
                    padding-left: 4px;
                    padding-right: 4px;
                    color: #4caf50;
                    border: 1px solid #4caf50;
                    cursor: pointer;
                  }

                  input[type=number]::-webkit-inner-spin-button,
                  input[type=number]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                  }

                  .number-input {
                    border: 1px solid #ddd;
                    display: inline-flex;
                  }

                  .minus, .plus {
                    padding: .3rem .7rem;
                    font-size: 1rem;
                  }

                  .number-input > input {
                    text-align: center;
                  }

                  .quantity {
                    padding: 2px 6px;
                  }
                  
                  .btn-add-scene{
                      margin-top: 1rem;
                  }

                  .btn-save-puzzle{
                      margin-top: 2rem;
                  }

                  .stages-cards {
                      width: 100%;
                  }

                  #create-puzzle-from {
                    // display: flex;
                    // flex-direction: row;
                    // flex-grow: unset;
                    // margin: auto;
                  }
                `}</style>
            </form>
        );
    }
}

export default withNamespaces()(CreatePuzzleForm);