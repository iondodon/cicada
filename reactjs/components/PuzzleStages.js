import React from 'react';

import '../i18n';
import { withNamespaces } from 'react-i18next';
import Stage from "./Stage";

class PuzzleStages extends React.Component {

    constructor({t}){
        super({t});
        this.t = t;

        this.addNewScene = this.addNewScene.bind(this);
    }

    componentDidMount() {
        {/*TODO: CKEditor overlaps page content, if page size changed */}

        let stagesCards = document.getElementsByClassName('stages-cards')[0];
        let widthPX = stagesCards.offsetWidth;
        stagesCards.setAttribute('style', 'width:' + widthPX + 'px');
    }

    addNewScene(e){

    }

    render(){
        return (
            <div className={"stages-cards"}>
                <div>
                    {
                        this.props.stages.map((stage, index) => {
                            return(
                                <Stage
                                    key={stage.stageNumber}
                                    stageNumber={stage.stageNumber}
                                    startContent={stage.content}
                                />
                            );
                        })
                    }

                    <div className={"btn btn-primary btn-ghost btn-block btn-add-scene"} onClick={this.addNewScene}>Add scene</div>
                </div>

                { /*language=SCSS*/ }
                <style jsx>{`                    
                  .stages-cards {
                   width: 100%;
                   margin-top: 20px;
                  }
                  
                  .btn {
                    margin-top: 10px;
                  }
                `}</style>
            </div>
        );
    }
}

export default withNamespaces()(PuzzleStages);