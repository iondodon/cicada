import React from 'react';
import Layout from "../components/Layout";
import Dashboard from "../components/Dashboard";

import '../i18n';
import { withNamespaces } from 'react-i18next';
import Head from "next/head";

class Home extends React.Component {

    constructor({t}){
        super({t});
        this.t = t;
    }

    render(){

        return (
            <Layout>
                <Head>
                    <title>Cicada</title>
                    <link rel="stylesheet" type="text/css" href={"./static/pages/index/indexStyle.css"}/>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>
                <Dashboard>
                    dsadasdaSAASDASD
                </Dashboard>
            </Layout>
        );
    }
}

export default withNamespaces()(Home);