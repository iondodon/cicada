import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';

class StageShow extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.toggleStage = this.toggleStage.bind(this);
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

    render(){
        return (
            <div className="card stage" key={this.props.key}>
                <header className="card-header">
                    <div className="pull-left stage-word">Stage { this.props.level }</div>
                    <input
                        type="text"
                        placeholder="code"
                        value={this.props.code}
                        className={"stage-code pull-left"}
                    />
                    <div className={"header-trigger pull-right"} onClick={this.toggleStage}>-</div>
                    <p/>
                </header>
                <div className="card-content" dangerouslySetInnerHTML={{__html: this.props.description}} />

                { /*language=SCSS*/ }
                <style jsx>{`                    
                  .stage-word {
                    margin-left: 1rem;
                  }
                  
                  .card {
                    margin-top: 10px;
                  }
                  
                  .card-content {
                      padding: 1rem;
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

export default withNamespaces()(StageShow);