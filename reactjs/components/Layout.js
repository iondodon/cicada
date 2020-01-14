import Head from 'next/head';
import Container from "./Container";
import TopMenu from "./TopMenu";
import Footer from "./Footer";
import React from "react";
import {withNamespaces} from "react-i18next";
import Router from "next/router";

Router.events.on('routeChangeStart', (url) => {
    document.getElementById("loading-gif").setAttribute('style', 'display: block;');
});


Router.events.on('routeChangeComplete', (url) => {
    document.getElementById("loading-gif").setAttribute('style', 'display: none;');
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
                
                <img id={"loading-gif"} className={"loading-gif"} src="/static/Pulse-1s-244px-croped.gif" alt="loading"/>

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
                    
                    .loading-gif {
                        position: fixed;
                        top: -4px;
                        right: 1.5%;
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