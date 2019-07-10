import React from 'react';
import dynamic from 'next/dynamic'

import '../i18n';
import { withNamespaces } from 'react-i18next';

const CKEditor = dynamic(() => import('../components/CKEditor'), {
    ssr: false
});

class CreatePuzzleForm extends React.Component {

    constructor({t}){
        super({t});
        this.t = t;
    }

    componentDidMount() {
        $('.js-example-basic-multiple').select2();

        let puzzleDescription = document.getElementsByClassName('puzzle-description')[0];
        puzzleDescription.setAttribute(
            'style', 'width: ' + puzzleDescription.offsetWidth + 'px'
        );
        puzzleDescription.setAttribute(
            'style', 'max-width: ' + puzzleDescription.offsetWidth + 'px'
        );
    }

    static getInitialProps({ req, query }) {
        return {}
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

                <label htmlFor="private">Private <input type="checkbox"/></label>

                <div className={"puzzle-description"}>
                    <CKEditor
                        data="<p>Puzzle description...</p>"
                        onInit={ editor => {
                            // You can store the "editor" and use when it is needed.
                            console.log( 'Editor is ready to use!', editor );
                        } }
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            console.log( { event, editor, data } );
                        } }
                        onBlur={ editor => {
                            console.log( 'Blur.', editor );
                        } }
                        onFocus={ editor => {
                            console.log( 'Focus.', editor );
                        } }
                    />
                </div>

                <div className="form-actions">
                    <button type="button" className="btn btn-primary btn-block">Submit</button>
                </div>

                { /*language=SCSS*/ }
                <style jsx>{`                    
                    .form {
                      display: flex;
                      flex-direction: row;
                      flex-wrap: wrap; margin: auto;
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
                    
                    .puzzle-description {
                        margin-top: 10px;
                        width: 100%;
                        max-width: 100%;
                    }
                `}</style>
            </form>
        );
    }
}

export default withNamespaces()(CreatePuzzleForm);