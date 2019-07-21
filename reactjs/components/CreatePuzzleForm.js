import React from 'react';
import dynamic from 'next/dynamic';
import Router from 'next/router';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import Stage from "./Stage";

const CKEditor = dynamic(() => import('../components/CKEditor'), {
    ssr: false
});

class CreatePuzzleForm extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {
            name: '',
            description: 'Puzzle description...',
            difficulty: 1,
            isPrivate: false,
            stagesCount: 1,
            stages: [
                {stageNumber: 0, description: 'Description of stage 0...'}
            ],
           tags: []
        };

        this.difficulty = 1;
        this.CreatePuzzleForm = React.createRef();

        this.difficultyUp = this.difficultyUp.bind(this);
        this.difficultyDown = this.difficultyDown.bind(this);
        this.updateDifficulty = this.updateDifficulty.bind(this);
        this.addNewStage = this.addNewStage.bind(this);
        this.removeStage = this.removeStage.bind(this);
        this.findInAttr = this.findInAttr.bind(this);
        this.setIsPrivate = this.setIsPrivate.bind(this);
        this.submitPuzzle = this.submitPuzzle.bind(this);
        this.updateDescription = this.updateDescription.bind(this);
        this.setCode = this.setCode.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    componentDidMount() {
        // language=JQuery-CSS
        $('.tags-multiple-select').select2({
            placeholder: 'Select tags',
            width: '100%'
        });

        document.getElementsByClassName('is-private')[0].checked = this.state.isPrivate;

        $('.tags-multiple-select').on('change', () => {
            this.setState({ tags: $(".tags-multiple-select").val() });
        });
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

    addNewStage(){
        if(this.state.stagesCount + 1 > 30){
            alert("No more than 30 stages.");
            return;
        }

        this.setState({
            stages: [...this.state.stages, {
                stageNumber: this.state.stagesCount,
                description: 'Description of stage ' + this.state.stagesCount + '...'
            }]
        });

        this.setState({stagesCount: this.state.stagesCount + 1});
    }

    findInAttr(array, attr, value) {
        for(let i = 0; i < array.length; i += 1) {
            if(array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    }

    removeStage(child) {
        let r = confirm('Press OK to confirm.');

        if(r === true){
            let array = [...this.state.stages];
            let index = this.findInAttr(array, 'stageNumber', child.props.stageNumber);
            if (index !== -1) {
                array.splice(index, 1);
                this.setState({stages: array});
            }

            this.setState({ stagesCount: this.state.stagesCount - 1 });
        }
    }

    updateDescription(child, data) {
        let array = [...this.state.stages];
        array[child.props.stageNumber].description = data;
        this.setState({ stages: array });
    }

    setCode(child, code) {
        let array = [...this.state.stages];
        array[child.props.stageNumber].code = code;
        this.setState({ stages: array });
    }

    setIsPrivate(){
        this.state.isPrivate = document.getElementsByClassName('is-private-ck-box')[0].checked;
    }

    validateForm() {
        let valid = true;

        if(this.state.name === '') {
            console.log('should specify a name');
            valid = false;
        } else if(this.state.name.length < 3) {
            console.log('name should have at least 3 chars');
            valid = false;
        }

        if(this.state.tags.length < 1) {
            console.log('specify at least one tag');
            valid = false;
        }

        if(this.state.description.length < 300) {
            console.log('puzzle description and stage description should have at least 300 chars');
            valid = false;
        }

        this.state.stages.map((stage, index) => {
            if(stage.description.length < 200) {
                console.log('stage ' + index + ' description should have at least 200 chars');
                valid = false;
            }

            if(stage.code === undefined) {
                console.log('you should define a code for stage ' + index);
                valid = false;
            } else if(stage.code.length < 3) {
                console.log('stage code should have at least 3 chars. See stage ' + index);
                valid = false;
            }
        });

        if(valid === true) {
            this.submitPuzzle();
        }
    }

    submitPuzzle() {
        console.log(this.state);


        // Router.push(`/`);
    }

    render(){
        return (
            <form className="form" id={"create-puzzle-form"}>
                <fieldset className="form-group">
                    <label >Name:</label>
                    <input
                        type="text" placeholder="puzzle name..."
                        className="form-control"
                        onChange={(e) => this.setState({ name: e.target.value }) }
                    />
                </fieldset>


                <label htmlFor="private" className={"is-private btn btn-success btn-ghost minus"}>Private
                    <input type="checkbox" className={"is-private-ck-box"} onChange={this.setIsPrivate} />
                </label>

                <label htmlFor="difficulty" className={"difficulty"}>
                    <div className={"btn btn-success btn-ghost minus"}>Difficulty</div>
                    <div className="number-input">
                        <div onClick={this.difficultyDown} className="btn btn-success btn-ghost minus">-</div>
                        <div className="quantity btn btn-success btn-ghost" onChange={this.updateDifficulty}> 1 </div>
                        <div onClick={this.difficultyUp} className="btn btn-success btn-ghost minus plus">+</div>
                    </div>
                </label>


                <div className="form-tags-group" >
                    <select className="tags-multiple-select" name="states[]" multiple="multiple">
                        <option value="AL">Alabama</option>
                        <option value="WY">Wyoming</option>
                        <option value="AL">Alabama</option>
                        <option value="WY">Wyoming</option>
                    </select>
                </div>

                <div className={"puzzle-description"}>
                    <CKEditor
                        data={this.state.description}
                        onInit={ editor => {
                            // You can store the "editor" and use when it is needed.
                        } }

                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            this.setState({ description: data });
                        } }
                        onBlur={ editor => {

                        } }
                        onFocus={ editor => {

                        } }
                    />
                </div>


                <div className={"stages-cards"}>
                    <div>
                        {
                            this.state.stages.map((stage, index) => {
                                let isLast = false;

                                if(index === this.state.stagesCount - 1 && index !== 0){
                                    isLast = true;
                                }

                                return(
                                    <Stage
                                        key={stage.stageNumber}
                                        startContent={"Description of stage " + stage.stageNumber + "..."}
                                        stageNumber={stage.stageNumber}
                                        removeStage={this.removeStage}
                                        updateDescription={this.updateDescription}
                                        setCode={this.setCode}
                                        isLast={isLast}
                                    />
                                );
                            })
                        }
                    </div>
                    <div className={"btn btn-primary btn-ghost btn-block btn-add-scene"} onClick={this.addNewStage}>Add stage</div>
                </div>

                <button
                    type={"button"}
                    onClick={this.validateForm}
                    className={"btn btn-success btn-block btn-save-puzzle"}
                >Save puzzle</button>


                { /*language=SCSS*/ }
                <style jsx>{`
                  .form {
                       display: flex;
                       flex-direction: column;
                       width: 100%;
                  }
                  
                  fieldset {
                    margin: auto;
                  }

                  .puzzle-description {
                      max-width: 100%;
                      margin-top: 2rem;
                  }
                  
                  .form-tags-group {
                    margin-left: auto;
                    margin-right: auto;
                    margin-top: 2rem;
                    width: 100%;
                  }
                  
                  .tags-multiple-select {
                    width: 100%;
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
                    cursor: auto;
                  }

                  .btn-save-puzzle{
                    margin-top: 2rem;
                  }

                  .stages-cards {
                      margin-top: 20px;
                  }
                  
                  .btn-add-scene{
                      margin-top: 1rem;
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
                 
                  .difficulty {
                      margin-top: 1rem;
                      margin-left: auto;
                      margin-right: auto;
                  }
                  
                  .difficulty > div {
                      cursor: auto;
                  }
                `}</style>
            </form>
        );
    }
}

export default withNamespaces()(CreatePuzzleForm);