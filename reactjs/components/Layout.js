import Head from 'next/head';
import Container from "./Container";
import TopMenu from "./TopMenu";
import Footer from "./Footer";
import React from "react";
import {withNamespaces} from "react-i18next";
import Router from "next/router";

Router.events.on('routeChangeStart', (url) => {
    document.getElementById("page-loading").setAttribute('style', 'display: block;');
});


Router.events.on('routeChangeComplete', (url) => {
    document.getElementById("page-loading").setAttribute('style', 'display: none;');
});

class Layout extends React.Component {

    constructor(props, {t}){
        super(props, {t});
        this.t = t;

        this.state = {
            loading: true
        }
    }

    async componentDidMount() {
        await this.setState({loading: false});
    }


    render(){

        return (
            <div>
                <Head>
                    <title>Cicada</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />

                    <link rel="stylesheet" type="text/css" href={"/static/hack/dist/hack.css"}/>
                    <link href={"/static/select2-4.0.7/dist/css/select2.min.css"} rel="stylesheet" />
                    <link rel="stylesheet" type="text/css" href={"/static/style.css"}/>

                    <script src={"/static/jquery/dist/jquery.min.js"}/>
                    <script src={"/static/select2-4.0.7/dist/js/select2.min.js"}/>

                    <script src="../static/jquery-datetimepicker/jquery.js"/>
                    <script src="../static/jquery-datetimepicker/build/jquery.datetimepicker.full.js"/>
                </Head>

                <div id={"page-loading"} className={"page-loading"}>loading...</div>

                <TopMenu/>

                <Container>
                    {this.props.children}
                    <Footer/>
                </Container>

                { /*language=SCSS*/ }
                <style jsx>{`
                  html, body {
                    height: 100%;
                    margin: 0;


                  }

                  .page-loading {
                    position: fixed;
                    top: 0;
                    width: 100%;
                    height: 1.3rem;
                    background-color: #009b07;
                    text-align: center;
                    display: none;
                  }


                  hr {
                    text-align: center;
                  }
                `}
                </style>
            </div>
        );
    }
}

export default withNamespaces()(Layout);