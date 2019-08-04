import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'
import Panel from './pages/panel';
import Header from './components/Header/Header';
import SignupFormWrapper from './components/SignupFormWrapper/SignupFormWrapper';

export default class Routes extends React.Component {
  render() {
    return (
      <Router>
        <Header />
        <div style={styles.body}>
          <Switch>
            <Route exact path='/home' render={() => { return <SignupFormWrapper/>}}/>
            <Route exact path='/dashboard' render={() => { return <Panel/>}}/>
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
    minHeight: '92%'
  }
}
