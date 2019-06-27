import React from 'react';
import Head from 'next/head';

import { withNamespaces } from 'react-i18next';
import '../i18n';

import Layout from "../components/Layout";
import LogInForm from "../components/LogInForm";

class LogIn extends React.Component {

    constructor({t}){
        super({t});
        this.t = t;
    }

    render(){

        return (
            <Layout>
                <Head>
                    <title>Login</title>
                    <link rel="stylesheet" type="text/css" href={"./static/pages/login/loginStyle.css"}/>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>
                <LogInForm/>
            </Layout>
        );
    }
}

export default withNamespaces()(LogIn);