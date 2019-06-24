import React from 'react';
import Layout from "../components/Layout";
import { Button } from "reactstrap"

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
                <Button className={"bbtn"}>
                    <div>{ this.t('aha') }</div>
                </Button>
                cxzczxc
            </Layout>
        );
    }
}

export default withNamespaces()(Home);