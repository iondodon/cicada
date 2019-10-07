import React from 'react';
import Layout from "../../components/Layout";
import Dashboard from "../../components/Dashboard";

import '../../i18n';
import { withNamespaces } from 'react-i18next';
import Head from "next/head";
import LeftPanel from "../../components/LeftPanel";
import ContestForm from "../../components/ContestForm";

class CreateContestPage extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;
    }

    render(){
        return (
            <Layout>
                <Head>
                    <title>Create contest</title>
                    <scr name="viewport" content="initial-scale=1.0, width=device-width" />
                    <link rel="stylesheet" href="../../static/jquery-datetimepicker/jquery.datetimepicker.css"/>
                    <script src="../../static/jquery-datetimepicker/jquery.js"/>
                    <script src="../../static/jquery-datetimepicker/build/jquery.datetimepicker.full.js"/>
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
                        {/*<header className="card-header">Create puzzle</header>*/}
                        <div className="card-content">
                            <div className="inner">
                                <ContestForm/>
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
                `}</style>
            </Layout>
        );
    }
}

export default withNamespaces()(CreateContestPage);