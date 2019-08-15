import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'
import Panel from './pages/panel';
import Homepage from './pages/homepage';
import Header from './components/Header/Header';
import Team from './pages/team'

export default class Routes extends React.Component {
    render() {
        return (
            <Router>
                <Header />
                <div style={styles.body}>
                    <Switch>
                      <Route exact path='/home' render={() => <Homepage/>}/>
                      <Route exact path='/team' render={() => <Team/>}/>
                      <Route exact path='/dashboard' render={() => <Panel/>}/>
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
