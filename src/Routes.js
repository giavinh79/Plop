import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'
import './App.css';

function Routes() {
  return (
    <>
      <header className="App-header">Hi</header>
      <Router>
        <Switch>
          <Route exact path='/' render={() => {return <p>Hi</p>}}>
            <Redirect to="/"/>
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default Routes;
