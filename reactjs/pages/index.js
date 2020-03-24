import React from 'react';
import Layout from "../components/Layout";
import Dashboard from "../components/Dashboard";

import '../i18n';
import { withNamespaces } from 'react-i18next';
import Head from "next/head";
import LeftPanel from "../components/LeftPanel";
import SocialShare from "../components/SocialShare";
import text from "../text/text";

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
                        <div className="card specific">
                            <header className="card-header">Cicada 3301</header>
                            <div className="card-content">
                                <div className="inner">
                                    Cicada 3301 is a nickname given to an organization that on three occasions has posted a set of puzzles to recruit codebreakers from the public. The first internet puzzle started on January 4, 2012 on 4chan and ran for approximately one month.
                                </div>
                            </div>
                        </div>
                    </LeftPanel>
                    <hr/>

                    <div className="card page-content" id={"page-content"}>
                        {/*<header className="card-header">title</header>*/}
                        <div className="card-content">
                            <div className="inner">

                                <h2>Idea based on Cicada 3301</h2>
                                <br/>
                                <h2>The site offers you the possibility to create puzzles and solve other puzzles.</h2>


                                <div className={"container"}>
                                    <iframe className={"video"}
                                            src="https://www.youtube.com/embed/I2O7blSSzpI"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen/>
                                </div>

                                <SocialShare message={text.GLOBAL_SOCIAL_MESSAGE} />
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
                    
                    .specific {
                      height: 100%;
                    }
                `}</style>
            </Layout>
        );
    }
}

export default withNamespaces()(Index);