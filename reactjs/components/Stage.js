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
        this.checkRemoveBtn = this.checkRemoveBtn.bind(this);
        this.updateDescription = this.updateDescription.bind(this);
        this.setCode = this.setCode.bind(this);
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

    removeStage(){
        this.props.removeStage(this);
    }

    updateDescription(data){
        this.props.updateDescription(this, data);
    }

    setCode(code) {
        this.props.setCode(this, code);
    }

    checkRemoveBtn(){
        if(this.props.isLast === true){
            return(
                <div className="pull-right remove-stage" onClick={ this.removeStage }>remove
                    { /*language=SCSS*/ }
                    <style jsx>{`                    
                      .remove-stage {
                        margin-right: 1px;
                        padding-left: 2px;
                        padding-right: 2px;
                        color: gray;
                        border: 1px solid gray;
                        cursor: pointer;
                      }
                    `}</style>
                </div>
            );
        }
    }

    render(){
        return (
            <div className="card stage" key={this.props.key}>
                <header className="card-header">
                    <div className="pull-left stage-word">Stage { this.props.stageNumber }</div>
                    <input
                        type="text"
                        placeholder="code"
                        className={"stage-code pull-left"}
                        onChange={e => this.setCode(e.target.value)}
                    />
                    <div className={"header-trigger pull-right"} onClick={this.toggleStage}>-</div>
                    { this.checkRemoveBtn() }
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

                            console.log(data);

                            this.updateDescription(data);
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
                  
                  .stage-code {
                    margin-right: 1rem;
                    padding-left: 4px;
                    padding-right: 4px;
                    cursor: text;
                    color: gray;
                    border: 1px solid gray;
                    margin-left: 1rem;
                  }
                  
                  .header-trigger {
                    margin-right: 1rem;
                    padding-left: 4px;
                    padding-right: 4px;
                    cursor: pointer;
                    float: right;
                    color: gray;
                    border: 1px solid gray;
                    margin-left: 2rem;
                  }
                `}</style>
            </div>
        );
    }
}

export default withNamespaces()(Stage);