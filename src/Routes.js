import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'
import Panel from './pages/panel';
import Homepage from './pages/homepage';
import Header from './components/Header/Header';
import Room from './pages/room'

export default class Routes extends React.Component {
    render() {
        return (
            <Router>
                <Header />
                <div style={styles.body}>
                    <Switch>
                      <Route exact path='/home' render={() => { return <Homepage/>}}/>
                      <Route exact path='/dashboard' render={() => { return <Panel/>}}/>
                      <Route exact path='/room' render={() => {return <Room/>}}/>
                      <Route path='/'>
                          <Redirect to="/home"/>
                      </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
}

const styles = {
    body : {
        display: 'flex',
        minHeight: '91%'
    }
}
