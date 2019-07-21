import React from 'react';
import Head from 'next/head';

import { withNamespaces } from 'react-i18next';
import '../i18n';

import Layout from "../components/Layout";
import SignUpInfo from "../components/SignUpInfo";
import SignUpForm from "../components/SignUpForm";

class SignUp extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;
    }

    render(){

        return (
            <Layout>
                <Head>
                    <title>Login</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>
                <SignUpForm/>
                <SignUpInfo/>
            </Layout>
        );
    }
}

export default withNamespaces()(SignUp);