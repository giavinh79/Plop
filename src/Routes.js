import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'
import Dashboard from './pages/dashboard';
import Header from './components/Header/Header';
import SideNav from './components/SideNav/SideNav';
import SignupFormWrapper from './components/SignupFormWrapper/SignupFormWrapper';

class Routes extends React.Component {
  render() {
    return (
      <>
        <Router>
          <Header />
          <div style={styles.body}>
            <Switch>
              <Route exact path='/home' render={() => { return <SignupFormWrapper/>}}/>
              <Route exact path='/dashboard' render={() => {
                return <><SideNav/><Dashboard/></>
              }}/>
              <Route path='/'>
                <Redirect to="/home"/>
              </Route>
            </Switch>
          </div>
        </Router>
      </>
    );
  }
}

const styles = {
  body : {
    display: 'flex',
    minHeight: '92%'
  }
}

export default Routes;
