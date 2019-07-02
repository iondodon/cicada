import React from 'react';
import Head from 'next/head';

import { withNamespaces } from 'react-i18next';
import '../i18n';

import Layout from "../components/Layout";
import SignUpInfo from "../components/SignUpInfo";
import SignUpForm from "../components/SignUpForm";

class SignUp extends React.Component {

    constructor({t}){
        super({t});
        this.t = t;
    }

    render(){

        return (
            <Layout>
                <Head>
                    <title>Login</title>
                    <link rel="stylesheet" type="text/css" href={"./static/pages/signup/signupStyle.css"}/>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>
                <div className={"signupPageContent"}>
                    <SignUpInfo/>
                    <SignUpForm/>
                </div>
            </Layout>
        );
    }
}

export default withNamespaces()(SignUp);