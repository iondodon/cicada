import React from 'react';
import Layout from "../components/Layout";
import Dashboard from "../components/Dashboard";

import '../i18n';
import { withNamespaces } from 'react-i18next';
import Head from "next/head";
import LeftPanel from "../components/LeftPanel";
import SocialShare from "../components/SocialShare";

class Index extends React.Component {

    constructor(props, {t}){
        super(props, {t});
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
                    <hr/>

                    <div className="card page-content" id={"page-content"}>
                        {/*<header className="card-header">title</header>*/}
                        <div className="card-content">
                            <div className="inner">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita,
                                quas ex vero enim in doloribus officiis ullam vel nam esse sapiente velit incidunt.
                                Eaque quod et, aut maiores excepturi sint.


                                <div className={"container"}>
                                    <iframe className={"video"}
                                            src="https://www.youtube.com/embed/I2O7blSSzpI"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen/>
                                </div>

                                <SocialShare/>
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
                    
                    .container {
                        position: relative;
                        width: 100%;
                        height: 0;
                        padding-bottom: 56.25%;
                    }
                    .video {
                        position: absolute;
                        align-self: center;
                        padding: 1rem;
                        left: 0;
                        width: 100%;
                        height: 100%;
                    }
                `}</style>
            </Layout>
        );
    }
}

export default withNamespaces()(Index);