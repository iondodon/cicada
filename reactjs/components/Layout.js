import Head from 'next/head';
import Container from "./Container";
import TopMenu from "./TopMenu";
import Footer from "./Footer";

const Layout = (props) => (
    <div>
        <Head>
            <title>Cicada</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link rel="stylesheet" type="text/css" href={"./static/hack/dist/hack.css"}/>
            <link rel="stylesheet" type="text/css" href={"./static/style.css"}/>
        </Head>
        <Container>
            <TopMenu/>
            <hr/>
            {props.children}
            <Footer/>
        </Container>
    </div>
);

export default Layout;