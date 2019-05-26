import React from 'react';
import {Helmet} from 'react-helmet';

class Home extends React.Component {

    exampleMethod(){
        console.log("clicked");
    }

    head(){
        return(
            <Helmet>
                <title>
                    Title
                </title>
            </Helmet>
        )
    }

    render() {
        return(
            <div>
                {this.head()}
                <h1>
                    Interesting
                </h1>
                <p>
                    Some content
                </p>
                <button onClick={this.exampleMethod}>Console log some text</button>
            </div>
        )
    }
}

export default Home;