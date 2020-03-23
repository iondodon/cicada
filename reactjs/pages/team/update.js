import React from 'react';
import Layout from "../../components/Layout";
import Dashboard from "../../components/Dashboard";

import '../../i18n';
import {withNamespaces} from 'react-i18next';
import Head from "next/head";
import LeftPanel from "../../components/LeftPanel";
import TeamForm from "../../components/TeamForm";

class Update extends React.Component {

    constructor(props, {t}) {
        super(props, {t});
        this.t = t;
    }

    render(){
        return (
            <Layout>
                <Head>
                    <title>Cicada</title>
                    <scr name="viewport" content="initial-scale=1.0, width=device-width" />
                    <link href={"/static/select2-4.0.7/dist/css/select2.css"} rel="stylesheet" />
                    <script src={"/static/select2-4.0.7/dist/js/select2.min.js"}/>
                </Head>

                <Dashboard>
                    <LeftPanel>
                        <div className="card specific">
                            <header className="card-header">Cicada 3301</header>
                            <div className="card-content">
                                <div className="inner">
                                    Cicada 3301 is a nickname given to an organization that on three occasions has posted a set of puzzles to recruit codebreakers from the public. The first internet puzzle started on January 4, 2012 on 4chan and ran for approximately one month.
                                </div>
                            </div>
                        </div>
                    </LeftPanel>

                    <div className="card page-content" id={"page-content"}>
                        {/*<header className="card-header">Create puzzle</header>*/}
                        <div className="card-content">
                            <div className="inner">
                                <TeamForm isFor={"update"} />
                            </div>
                        </div>
                    </div>
                </Dashboard>

                { /*language=SCSS*/ }
                <style jsx>{`
                    .page-content {
                      display: flex;
                      flex-direction: column;
                      min-width: 75%;
                      max-width: 75%;
                    }
                    
                    .card-content {
                        padding: 2rem;
                    }
                    
                    .specific {
                      height: 100%;
                    }
                `}</style>
            </Layout>
        );
    }
}

export default withNamespaces()(Update);