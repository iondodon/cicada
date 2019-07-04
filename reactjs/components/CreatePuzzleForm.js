import React, { Component } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


import '../i18n';
import { withNamespaces } from 'react-i18next';

class CreatePuzzleForm extends React.Component {

    constructor({t}){
        super({t});
        this.t = t;
    }

    render(){
        return (
            <form className="form">
                <fieldset className="form-group">
                    <label htmlFor="username">USERNAME:</label>
                    <input id="username" type="text" placeholder="type your name..." className="form-control"/>
                </fieldset>
                <fieldset className="form-group">
                    <label htmlFor="email">EMAIL:</label>
                    <input id="email" type="email" placeholder="" className="form-control"/>
                </fieldset>
                <fieldset className="form-group">
                    <label htmlFor="country">COUNTRY:</label>
                    <select id="country" className="form-control">
                        <option>China</option>
                        <option>U.S.</option>
                        <option>U.K.</option>
                        <option>Japan</option>
                    </select>
                </fieldset>
                <fieldset className="form-group form-textarea">
                    <label htmlFor="message">MESSAGE:</label>
                    <textarea id="message" rows="5" className="form-control"/>
                </fieldset>

                <CKEditor
                    editor={ ClassicEditor }
                    data="<p>Hello from CKEditor 5!</p>"
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

                <div className="form-actions">
                    <button type="button" className="btn btn-primary btn-block">Submit</button>
                </div>

                { /*language=SCSS*/ }
                <style jsx>{`                    
                    .form {
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      margin: auto;
                    }
                `}</style>
            </form>

    );
    }
}

export default withNamespaces()(CreatePuzzleForm);