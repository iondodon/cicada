import React from 'react';
import Layout from "../../components/Layout";
import Dashboard from "../../components/Dashboard";

import '../../i18n';
import { withNamespaces } from 'react-i18next';
import Head from "next/head";
import LeftPanel from "../../components/LeftPanel";
import PuzzleForm from "../../components/PuzzleForm";

class Create extends React.Component {

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
                    <link href="../../static/select2-4.0.7/dist/css/select2.css" rel="stylesheet" />
                    <script src="../../static/select2-4.0.7/dist/js/select2.min.js"/>
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

                    <div className="card page-content">
                        {/*<header className="card-header">Create puzzle</header>*/}
                        <div className="card-content">
                            <div className="inner">
                                <PuzzleForm isFor={"create"} />
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
                    }
                    
                    .card-content {
                        padding: 2rem;
                    }
                `}</style>
            </Layout>
        );
    }
}

export default withNamespaces()(Create);