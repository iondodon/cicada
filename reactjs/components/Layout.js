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
            <script src="../static/jquery/dist/jquery.min.js" crossOrigin="anonymous"/>
        </Head>
        <Container>
            <TopMenu/>
            {props.children}
            <Footer/>
        </Container>

        { /*language=SCSS*/ }
        <style jsx>{`            
              html, body {
                height: 100%;
                margin: 0;
            }
            
            hr {
                text-align: center;
            }    
        `}
        </style>
    </div>
);

export default Layout;