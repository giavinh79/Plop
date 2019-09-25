import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Panel from './pages/panel';
import Homepage from './pages/homepage';
import Header from './components/Header/Header';
import Team from './pages/team';
import styled from 'styled-components';

const BodyWrapper = styled.div`
  display: flex;
  min-height: 91%;
`

export default class Routes extends React.Component {
  render() {
    return (
      <Router>
        <Header />
        <BodyWrapper>
          <Switch>
            <Route path='/home' render={() => <Homepage />} />
            <Route path='/team' render={() => <Team />} />
            <Route path='/dashboard' component={() => <Panel />} />
            <Route path='/'>
              <Redirect to="/home" />
            </Route>
          </Switch>
        </BodyWrapper>
      </Router>
    );
  }
}