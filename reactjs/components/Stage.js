import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import dynamic from "next/dynamic";

const CKEditor = dynamic(() => import('../components/CKEditor'), {
    ssr: false
});

class Stage extends React.Component {

    constructor({t}){
        super({t});
        this.t = t;
    }

    render(){
        return (
            <div className="card stage">
                <header className="card-header">
                    <div className="pull-left stage-word">Stage 1</div>
                    <div className="pull-right open-stage" onClick={this.toggleStage}>-</div>
                    <p/>
                </header>
                <div className="card-content">
                    <CKEditor
                        data="<p>New Stage description here</p>"
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
}

export default withNamespaces()(Stage);