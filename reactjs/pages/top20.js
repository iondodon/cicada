import React from 'react';
import Layout from "../components/Layout";
import Dashboard from "../components/Dashboard";

import '../i18n';
import { withNamespaces } from 'react-i18next';
import Head from "next/head";
import LeftPanel from "../components/LeftPanel";
import TopPlayers from "../components/TopPlayers";
import TopTeams from "../components/TopTeams";

class Notifications extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;
    }

    render(){
        return (
            <Layout>
                <Head>
                    <title>Cicada</title>
                    <scr name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>

                <Dashboard>
                    <LeftPanel>
                        <div className="card">
                            <header className="card-header">specific to page</header>
                            <div className="card-content">
                                <div className="inner">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita, quas
                                    ex vero enim in doloribus officiis ullam vel nam esse sapiente velit incidunt. Eaque quod
                                    et, aut maiores excepturi sint.
                                </div>
                            </div>
                        </div>
                    </LeftPanel>

                    <div className="card page-content" id={"page-content"}>
                        {/*<header className="card-header"></header>*/}
                        <div className="card-content">
                            <div className="inner">
                                <TopPlayers/>
                                <TopTeams/>
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
                    
                    .inner {
                      display: flex;
                      flex-direction: row;
                    }
                `}</style>
            </Layout>
        );
    }
}

export default withNamespaces()(Notifications);