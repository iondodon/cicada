import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import config from "../configs/keys";

class StageShow extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {
            code: '',
            stageId: this.props.stageId,
            sessionId: this.props.sessionId,
            level: this.props.level,
            current: this.props.current,
            error: false,
            responseMessage: null
        };

        this.toggleStage = this.toggleStage.bind(this);
        this.checkStageCode = this.checkStageCode.bind(this);
    }

    async checkStageCode() {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const request = {
            method: 'POST',
            mode: 'cors',
            headers: headers,
            credentials: 'include',
            body: JSON.stringify({
                sessionId: this.state['sessionId'],
                stageId: this.state['stageId'],
                code: this.state['code']
            })
        };

        try {
            let response = await fetch(
                config.API_URL + '/api/stage/check-code',
                request
            );
            let responseJson = await response.json();

            if(response.status === 200){
                await this.setState({error: false});
                await this.setState({responseMessage: responseJson['message']});
                if(responseJson['message'] === 'Valid') {
                    window.location.reload();
                }
                setTimeout(async ()=>{
                    await this.setState({responseMessage: ''});
                }, 10000);
                await this.setState({responseMessage: ''});
            } else {
                await this.setState({error: true});
                await this.setState({responseMessage: responseJson['message']});
            }
        } catch(e) {
            await this.setState({error: true});
            await this.setState({responseMessage: e});
        }
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
                    {(()=>{
                        if(this.state['responseMessage']) {
                            return(
                                <div className={"header-trigger pull-left"} >{this.state['responseMessage']}</div>
                            );
                        }
                    })()}
                    {(()=>{
                        if(this.props.completeness === this.props.level) {
                            return(
                                <input
                                    type="text"
                                    placeholder="stage code here"
                                    className={"stage-code pull-left"}
                                    onChange={async e => {
                                        await this.setState({code: e.target.value});
                                    }}
                                    value={this.state['code']}
                                />
                            );
                        }
                    })()}
                    {(()=>{
                        if(this.props.completeness === this.props.level) {
                            return(
                                <div className={"header-trigger pull-left"} onClick={this.checkStageCode}>check</div>
                            );
                        }
                    })()}
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
                    color: black;
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