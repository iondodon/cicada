import React from 'react';
import { Switch, Route } from 'react-router';


import Home from './pages/homePageComponent';
import Page404 from "./pages/Page404";


class App extends React.Component {

    render(){
        return(
            <Switch>
                <Route  path="/home" component={Home} exact />
                <Route component={Page404} />
            </Switch>
        )
    }
}


export default App;