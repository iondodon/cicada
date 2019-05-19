import React from 'react';
import {Helmet} from 'react-helmet';

class Page404 extends React.Component {

    head(){
        return(
            <Helmet>
                <title>
                    404
                </title>
            </Helmet>
        )
    }

    render() {
        return(
            <div>
                {this.head()}
                <h1>
                    404
                </h1>
                <p>
                    Page not found
                </p>
            </div>
        )
    }
}

export default Page404;