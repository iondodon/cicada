import React from 'react';
import Layout from "../components/Layout";
import Dashboard from "../components/Dashboard";

import '../i18n';
import { withNamespaces } from 'react-i18next';
import Head from "next/head";
import LeftPanel from "../components/LeftPanel";
import CreatePuzzleForm from "../components/CreatePuzzleForm";

class CreatePuzzle extends React.Component {

    constructor({t}){
        super({t});
        this.t = t;
    }

    render(){

        return (
            <Layout>
                <Head>
                    <title>Cicada</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
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

                    <div className="card" id={"page-content"}>
                        <header className="card-header">Create puzzle</header>
                        <div className="card-content">
                            <div className="inner">
                                <CreatePuzzleForm/>
                            </div>
                        </div>
                    </div>
                </Dashboard>

                { /*language=SCSS*/ }
                <style jsx>{`                    
                    #page-content {
                      display: flex;
                      flex-grow: 100;
                      flex-direction: column;
                    }
                `}</style>
            </Layout>
        );
    }
}

export default withNamespaces()(CreatePuzzle);