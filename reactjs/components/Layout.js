import Head from 'next/head';
import Container from "./Container";

const Layout = (props) => (
    <div>
        <Head>
            <title>Cicada</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link rel="stylesheet" type="text/css" href={"./static/hack/dist/hack.css"}/>
            <link rel="stylesheet" type="text/css" href={"./static/style.css"}/>
        </Head>
        <Container>
            {props.children}
        </Container>
    </div>
);

export default Layout;