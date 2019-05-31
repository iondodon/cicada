import React from 'react';
import Layout from "../components/Layout";

import '../i18n';
import { withNamespaces } from 'react-i18next';

class Home extends React.Component {

    constructor({t}){
        super({t});
        this.t = t;
    }

    render(){

        return (
            <Layout>
                <div>{ this.t('aha') }</div>
            </Layout>
        );
    }
}

export default withNamespaces()(Home);