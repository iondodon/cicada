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
            puzzle: {
                name: '',
                description: 'Puzzle description...',
                difficultyByCreator: 1,
                isPrivate: false,
                stagesCount: 1,
                stages: [
                    {level: 0, description: 'Description of stage 0...', code: ""}
                ],
                tags: []
            }
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
        this.setTags = this.setTags.bind(this);
        this.fetchUpdatePuzzle = this.fetchUpdatePuzzle.bind(this);
    }

    async componentDidMount() {
        // language=JQuery-CSS
        $('.tags-multiple-select').select2({
            placeholder: 'Select tags',
            width: '100%'
        });

        $('.tags-multiple-select').on('change', () => {
            this.setState({
                puzzle: {...this.state['puzzle'], tags: $(".tags-multiple-select").val() }
            });
        });

        if(this.props.isFor === "update") {
            await this.fetchSetState();
        }
    }

    setTags(puzzle) {
        let tags = [];
        puzzle['tags'].forEach((value) => {
            tags.push(value.tag);
        });
        $('.tags-multiple-select').val(tags);
        $('.tags-multiple-select').trigger('change');
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
            } else if (response.status === 400) {
                document.getElementsByClassName('error-content')[0].innerHTML = 'You can not update this puzzle.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            } else if (response.status === 200) {
                let responseJson = await response.json();
                await this.setState({puzzle: responseJson});
                if(this.props.isFor === "update"){
                    this.setTags(responseJson);
                }
                await this.setState({loading: false});
                console.log(this.state);
            } else {
                document.getElementsByClassName('error-content')[0].innerHTML = 'Unknown error. Check the fields and try again.';
                document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
            }
        } catch (e) {
            document.getElementsByClassName('error-content')[0].innerHTML += e.message;
            document.getElementsByClassName('alert-error')[0].setAttribute('style', 'display: inline;');
        }
    }

    async difficultyUp() {
        if(this.state['puzzle']['difficultyByCreator'] + 1 <= 5){
            await this.setState(prevState => ({
                puzzle: {...this.state['puzzle'], difficultyByCreator: prevState['puzzle']['difficultyByCreator'] + 1}
            }));
        }
    }

    async difficultyDown() {
        if(parseInt(this.state['puzzle']['difficultyByCreator']) - 1 > 0){
            await this.setState(prevState => ({
                puzzle: {...this.state['puzzle'], difficultyByCreator: prevState['puzzle']['difficultyByCreator'] - 1}
            }));
        }
    }

    async addNewStage(){
        if(this.state['puzzle']['stagesCount'] + 1 > 30){
            alert("No more than 30 stages.");
            return;
        }

        let puzzle = this.state['puzzle'];
        let stages = this.state['puzzle']['stages'];

        stages = [...stages, {
            level: puzzle['stagesCount'],
            description: 'Description of stage ' + puzzle['stagesCount'] + '...'
        }];
        puzzle['stages'] = stages;
        puzzle['stagesCount'] += 1;
        await this.setState({puzzle: puzzle});
        console.log(this.state);
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
            let array = [...this.state['puzzle']['stages']];
            let index = this.findInAttr(array, 'level', child.props.level);
            if (index !== -1) {
                array.splice(index, 1);
                let puzzle = this.state['puzzle'];
                puzzle['stages'] = array;
                puzzle['stagesCount'] -= 1;
                this.setState({puzzle: puzzle});
            }
        }
    }

    updateDescription(child, data) {
        let puzzle = this.state['puzzle'];
        let array = [...puzzle['stages']];
        array[child.props.level].description = data;
        puzzle['stages'] = array;
        this.setState({ puzzle: puzzle });
    }

    setCode(child, code) {
        let puzzle = this.state['puzzle'];
        let array = [...puzzle['stages']];
        array[child.props.level].code = code;
        puzzle['stages'] = array;
        this.setState({ puzzle: puzzle });
    }

    setIsPrivate(e){
        let puzzle = this.state['puzzle'];
        puzzle['isPrivate'] = e.target.checked;
        this.setState({ puzzle: puzzle });
    }

    async validateForm() {
        let valid = true;
        let errorMsg = '';
        const puzzle = this.state['puzzle'];

        if(puzzle['name'] === '') {
            errorMsg += 'You should specify a name' + '<br/>';
            valid = false;
        } else if(puzzle['name'].length < 1) {
            errorMsg += 'The name should have at least 1 character.' + '<br/>';
            valid = false;
        }

        if(puzzle['tags'] == null || puzzle['tags'].length < 1) {
            errorMsg += 'Specify at least one tag' + '<br/>';
            valid = false;
        }

        if(puzzle['description'].length < 20) {
            errorMsg += 'Puzzle description and stage description should have at least 20 chars' + '<br/>';
            valid = false;
        }

        puzzle['stages'].map((stage, index) => {
            if(puzzle['description'].length < 10) {
                errorMsg += 'Stage ' + index + ' description should have at least 10 characters.' + '<br/>';
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
        const urlParams = new URLSearchParams(window.location.search);
        this.puzzleId = urlParams.get('puzzleId');

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const request = {
            method: 'PUT',
            mode: 'cors',
            headers: headers,
            credentials: "include",
            body: JSON.stringify(this.state['puzzle'])
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
            body: JSON.stringify(this.state['puzzle'])
        };

        console.log(this.state['puzzle']);

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
                    <label>Name:</label>
                    <input
                        type="text" placeholder="puzzle name..."
                        className="form-control"
                        value={this.state['puzzle']['name']}
                        onChange={(e) => this.setState({
                            puzzle: {...this.state['puzzle'], name: e.target.value}
                        })}
                    />
                </fieldset>

                {/*<label htmlFor="private" className={"is-private btn btn-success btn-ghost minus"}>Private*/}
                {/*    <input*/}
                {/*        type="checkbox"*/}
                {/*        className={"is-private-ck-box"}*/}
                {/*        checked={this.state.isPrivate}*/}
                {/*        onChange = {this.setIsPrivate}*/}
                {/*    />*/}
                {/*</label>*/}

                <label htmlFor="difficulty" className={"difficulty"}>
                    <div className={"btn btn-success btn-ghost minus"}>Difficulty</div>
                    <div className="number-input">
                        <div onClick={this.difficultyDown} className="btn btn-success btn-ghost minus">-</div>
                        <div className="quantity btn btn-success btn-ghost"> {this.state['puzzle']['difficultyByCreator']} </div>
                        <div onClick={this.difficultyUp} className="btn btn-success btn-ghost minus plus">+</div>
                    </div>
                </label>


                <div className="form-tags-group">
                    <select className="tags-multiple-select" name="states[]" multiple="multiple">
                        <option value="General">General</option>
                        <option value="CyberSecurity">CyberSecurity</option>
                        <option value="Cryptography">Cryptography</option>
                        <option value="Blockchain">Blockchain</option>
                        <option value="DataScience">DataScience</option>
                        <option value="DigitalLife">DigitalLife</option>
                        <option value="MachineLearning">MachineLearning</option>
                        <option value="Math">Math</option>
                        <option value="NeuroScience">NeuroScience</option>
                        <option value="Programming">Programming</option>
                        <option value="Science">Science</option>
                        <option value="SoftwareEngineering">SoftwareEngineering</option>
                        <option value="Space">Space</option>
                        <option value="Technology">Technology</option>
                        <option value="Creativity">Creativity</option>
                        <option value="Disability">Disability</option>
                        <option value="Health">Health</option>
                        <option value="Money">Money</option>
                        <option value="Outdoors">Outdoors</option>
                        <option value="Psychology">Psychology</option>
                        <option value="Travel">Travel</option>
                        <option value="Cities">Cities</option>
                        <option value="Education">Education</option>
                        <option value="Environment">Environment</option>
                        <option value="Future">Future</option>
                        <option value="History">History</option>
                        <option value="Justice">Justice</option>
                        <option value="Media">Media</option>
                        <option value="Language">Language</option>
                        <option value="Philosophy">Philosophy</option>
                        <option value="Society">Society</option>
                        <option value="World">World</option>
                        <option value="Art">Art</option>
                        <option value="Books">Books</option>
                        <option value="Culture">Culture</option>
                        <option value="Fiction">Fiction</option>
                        <option value="Film">Film</option>
                        <option value="Makers">Makers</option>
                        <option value="Music">Music</option>
                        <option value="Humor">Humor</option>
                        <option value="Poetry">Poetry</option>
                        <option value="Photography">Photography</option>
                        <option value="Social media">Social media</option>
                        <option value="Sports">Sports</option>
                        <option value="Crime">Crime</option>
                        <option value="Writing">Writing</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Artificial Intelligence">Artificial Intelligence</option>
                    </select>
                </div>

                <div className={"puzzle-description"}>
                    <CKEditor
                        data={this.state['puzzle']['description']}
                        onInit={editor => {
                            // You can store the "editor" and use when it is needed.
                        }}

                        onChange={(event, editor) => {
                            const data = editor.getData();
                            this.setState({
                                puzzle: {...this.state['puzzle'], description: data}
                            });
                        }}
                        onBlur={editor => {

                        }}
                        onFocus={editor => {

                        }}
                    />
                </div>


                <div className={"stages-cards"}>
                    <div>
                        {
                            this.state['puzzle']['stages'].map((stage, index) => {
                                let isLast = false;

                                if (index === this.state['puzzle']['stagesCount'] - 1 && index !== 0) {
                                    isLast = true;
                                }

                                return (
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
                    <div className={"btn btn-primary btn-ghost btn-block btn-add-scene"}
                         onClick={this.addNewStage}>Add stage
                    </div>
                </div>

                <div className="alert alert-error" style={{display: 'none'}}>
                    <div className={"error-content"}>Error message</div>
                    {'\u00A0'} <a onClick={this.closeError}>x</a>
                </div>

                <button
                    type={"button"}
                    onClick={this.validateForm}
                    className={"btn btn-success btn-block btn-save-puzzle"}
                >Save puzzle
                </button>


                { /*language=SCSS*/}
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

                  .btn-save-puzzle {
                    margin-top: 2rem;
                  }

                  .stages-cards {
                    margin-top: 20px;
                  }

                  .btn-add-scene {
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