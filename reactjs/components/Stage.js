import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import dynamic from "next/dynamic";

const CKEditor = dynamic(() => import('../components/CKEditor'), {
    ssr: false
});

class Stage extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.toggleStage = this.toggleStage.bind(this);
        this.removeStage = this.removeStage.bind(this);
    }

    toggleStage(e){
        let cardContent = e.target.parentElement.querySelector('.card-content');

        if(cardContent.style.display !== 'none'){
            cardContent.setAttribute('style', 'display: none;');
        } else {
            cardContent.setAttribute('style', 'display: block;');
        }
    }

    removeStage() {
        console.log('removing');
    }

    render(){
        return (
            <div className="card stage" key={this.props.key}>
                <header className="card-header"  onClick={this.toggleStage}>
                    <div className="pull-left stage-word">Stage { this.props.stageNumber }</div>
                    <div className="pull-right remove-stage" onClick={this.removeStage}>Remove</div>
                    <p/>
                </header>
                <div className="card-content">
                    <CKEditor
                        data={this.props.startContent}

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

                { /*language=SCSS*/ }
                <style jsx>{`                    
                  .stage-word {
                    margin-left: 1rem;
                  }
                  
                  .card {
                    margin-top: 10px;
                  }
                  
                  .card-content {
                      padding: 0;
                      margin: 0;
                  }

                  .remove-stage {
                    margin-right: 1rem;
                    padding-left: 4px;
                    padding-right: 4px;
                    color: darkred;
                    border: 1px solid #4caf50;
                    cursor: pointer;
                  }
                  
                  .card-header {
                    cursor: pointer;
                  }
                `}</style>
            </div>
        );
    }
}

export default withNamespaces()(Stage);