import React from 'react';
import dynamic from 'next/dynamic';
import Router from 'next/router';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import Stage from "./Stage";
import config from "../configs/keys";

const CKEditor = dynamic(() => import('../components/CKEditor'), {
    ssr: false
});

class PuzzleForm extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {
            name: '',
            description: 'Puzzle description...',
            difficultyByCreator: 1,
            isPrivate: false,
            stagesCount: 1,
            stages: [
                {level: 0, description: 'Description of stage 0...', code: ""}
            ],
            tags: [],
        };

        this.CreatePuzzleForm = React.createRef();

        this.difficultyUp = this.difficultyUp.bind(this);
        this.difficultyDown = this.difficultyDown.bind(this);
        this.addNewStage = this.addNewStage.bind(this);
        this.removeStage = this.removeStage.bind(this);
        this.findInAttr = this.findInAttr.bind(this);
        this.setIsPrivate = this.setIsPrivate.bind(this);
        this.submitPuzzle = this.submitPuzzle.bind(this);
        this.updateDescription = this.updateDescription.bind(this);
        this.setCode = this.setCode.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.closeError = this.closeError.bind(this);
        this.fetchSetState = this.fetchSetState.bind(this);
        this.populateForm = this.populateForm.bind(this);
        this.fetchUpdatePuzzle = this.fetchUpdatePuzzle.bind(this);
    }

    async componentDidMount() {
        // language=JQuery-CSS
        $('.tags-multiple-select').select2({
            placeholder: 'Select tags',
            width: '100%'
        });

        $('.tags-multiple-select').on('change', () => {
            this.setState({ tags: $(".tags-multiple-select").val() });
        });

        if(this.props.isFor === "update") {
            await this.fetchSetState();
        }
    }

    populateForm(responseJson) {
        this.setState( {name: responseJson['name'] });
        this.setState( {isPrivate: responseJson['private'] });
        this.setState({difficultyByCreator: responseJson['difficultyByCreator']});

        let tags = [];
        responseJson['tags'].forEach((value) => {
            tags.push(value.tag);
        });
        $('.tags-multiple-select').val(tags);
        $('.tags-multiple-select').trigger('change');
        this.setState({tags: tags});

        this.setState({description: responseJson['description']});

        let stages = [];
        responseJson['stages'].forEach((value) => {
            stages.push(value);
        });
        this.setState({stages: stages});
    }

    async fetchSetState() {
        const urlParams = new URLSearchParams(window.location.search);
        this.puzzleId = urlParams.get('puzzleId');

        const request = {
            method: 'GET',
            mode: 'cors',
            credentials: "include"
        };

        try {
            let response = await fetch(config.API_URL + '/api/puzzles/get-for-update/' + this.puzzleId, request);

            if (response.status === 401) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unauthorized.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 404) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Such puzzle doesn\'t exist.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 200) {
                let responseJson = await response.json();
                if(this.props.isFor === "update"){
                    this.populateForm(responseJson);
                }
            } else {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unknown error. Check the fields and try again.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            }
        } catch (e) {
            document.getElementsByClassName('error-content')[0].innerHTML += e.message;
            document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
        }
    }

    difficultyUp() {
        if(this.state.difficultyByCreator + 1 <= 5){
            this.setState(prevState => ({difficultyByCreator: prevState.difficultyByCreator+1}));
        }
    }

    difficultyDown() {
        if(parseInt(this.state.difficultyByCreator) - 1 > 0){
            this.setState(prevState => ({difficultyByCreator: prevState.difficultyByCreator-1}));
        }
    }

    addNewStage(){
        if(this.state.stagesCount + 1 > 30){
            alert("No more than 30 stages.");
            return;
        }

        this.setState({
            stages: [...this.state.stages, {
                level: this.state.stagesCount,
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
            let index = this.findInAttr(array, 'level', child.props.level);
            if (index !== -1) {
                array.splice(index, 1);
                this.setState({stages: array});
            }

            this.setState({ stagesCount: this.state.stagesCount - 1 });
        }
    }

    updateDescription(child, data) {
        let array = [...this.state.stages];
        array[child.props.level].description = data;
        this.setState({ stages: array });
    }

    setCode(child, code) {
        let array = [...this.state.stages];
        array[child.props.level].code = code;
        this.setState({ stages: array });
    }

    setIsPrivate(e){
        this.setState({ isPrivate: e.target.checked });
    }

    async validateForm() {
        let valid = true;
        let errorMsg = '';

        if(this.state.name === '') {
            errorMsg += 'You should specify a name' + '<br/>';
            valid = false;
        } else if(this.state.name.length < 3) {
            errorMsg += 'The name should have at least 3 chars' + '<br/>';
            valid = false;
        }

        if(this.state.tags.length < 1) {
            errorMsg += 'Specify at least one tag' + '<br/>';
            valid = false;
        }

        if(this.state.description.length < 300) {
            errorMsg += 'Puzzle description and stage description should have at least 300 chars' + '<br/>';
            valid = false;
        }

        this.state.stages.map((stage, index) => {
            if(stage.description.length < 200) {
                errorMsg += 'Stage ' + index + ' description should have at least 200 chars' + '<br/>';
                valid = false;
            }

            if(stage.code === undefined) {
                errorMsg += 'You should define a code for stage ' + index + '<br/>';
                valid = false;
            } else if(stage.code.length < 3) {
                errorMsg += 'Stage code should have at least 3 chars. See stage ' + index + '<br/>';
                valid = false;
            }
        });

        if(valid === true) {
            if(this.props.isFor === "create") {
                await this.submitPuzzle();
            } else if(this.props.isFor === "update") {
                await this.fetchUpdatePuzzle();
            }
        } else {
            document.getElementsByClassName('error-content')[0].innerHTML = errorMsg;
            document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
        }
    }

    async fetchUpdatePuzzle() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const request = {
            method: 'PUT',
            mode: 'cors',
            headers: headers,
            credentials: "include",
            body: JSON.stringify(this.state)
        };

        try {
            let response = await fetch(config.API_URL + '/api/puzzles/' + this.puzzleId, request);

            if (response.status === 401) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unauthorized.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 500) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Server error. Check the fields and try again. ';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 200) {
                Router.push(`/`);
            } else {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unknown error. Check the fields and try again.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            }
        } catch (e) {
            document.getElementsByClassName('error-content')[0].innerHTML += e.message;
            document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
        }
    }

    async submitPuzzle() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const request = {
            method: 'POST',
            mode: 'cors',
            headers: headers,
            credentials: "include",
            body: JSON.stringify(this.state)
        };

        try {
            let response = await fetch(config.API_URL + '/api/puzzles/create', request);

            if (response.status === 401) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unauthorized.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 500) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Server error. Check the fields and try again. ';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 201) {
                Router.push(`/`);
            } else {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unknown error. Check the fields and try again.';
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

    componentDidUpdate(prevProps, prevState) {
        // console.log(prevState);
        // console.log(this.state);
    }

    render(){
        return (
            <form className="form" id={"create-puzzle-form"}>
                <fieldset className="form-group">
                    <label >Name:</label>
                    <input
                        type="text" placeholder="puzzle name..."
                        className="form-control"
                        value={this.state.name}
                        onChange={(e) => this.setState({ name: e.target.value }) }
                    />
                </fieldset>

                <label htmlFor="private" className={"is-private btn btn-success btn-ghost minus"}>Private
                    <input
                        type="checkbox"
                        className={"is-private-ck-box"}
                        checked={this.state.isPrivate}
                        onChange = {this.setIsPrivate}
                    />
                </label>

                <label htmlFor="difficulty" className={"difficulty"}>
                    <div className={"btn btn-success btn-ghost minus"}>Difficulty</div>
                    <div className="number-input">
                        <div onClick={this.difficultyDown} className="btn btn-success btn-ghost minus">-</div>
                        <div className="quantity btn btn-success btn-ghost"> {this.state.difficultyByCreator} </div>
                        <div onClick={this.difficultyUp} className="btn btn-success btn-ghost minus plus">+</div>
                    </div>
                </label>


                <div className="form-tags-group" >
                    <select className="tags-multiple-select" name="states[]" multiple="multiple">
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
                                        key={stage.level}
                                        startDescription={stage.description}
                                        level={stage.level}
                                        removeStage={this.removeStage}
                                        updateDescription={this.updateDescription}
                                        setCode={this.setCode}
                                        code={stage.code}
                                        isLast={isLast}
                                    />
                                );
                            })
                        }
                    </div>
                    <div className={"btn btn-primary btn-ghost btn-block btn-add-scene"} onClick={this.addNewStage}>Add stage</div>
                </div>

                <div className="alert alert-error" style={{ display: 'none' }} >
                    <div className={"error-content"} >Error message</div>
                    {'\u00A0'} <a onClick={this.closeError}>x</a>
                </div>

                <button
                    type={"button"}
                    onClick={this.validateForm}
                    className={"btn btn-success btn-block btn-save-puzzle"}
                >Save puzzle</button>


                { /*language=SCSS*/ }
                <style jsx>{`
                  .alert {
                        display: flex;
                        flex-direction: row;
                        text-align: center;
                        margin-top: 2rem;
                        margin-bottom: 0;
                        justify-content: center;
                  }
                
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

export default withNamespaces()(PuzzleForm);