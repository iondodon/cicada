import React from 'react';
import Layout from "../../components/Layout";
import Dashboard from "../../components/Dashboard";

import '../../i18n';
import { withNamespaces } from 'react-i18next';
import Head from "next/head";
import LeftPanel from "../../components/LeftPanel";
import AccountShow from "../../components/AccountShow";

class ShowAccountPage extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;
    }

    render(){
        return (
            <Layout>
                <Head>
                    <title> Show account </title>
                    <scr name="viewport" content="initial-scale=1.0, width=device-width" />
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
                        {/*<header className="card-header">Puzzles</header>*/}
                        <div className="card-content">
                            <div className="inner">
                                <AccountShow/>
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

export default withNamespaces()(ShowAccountPage);