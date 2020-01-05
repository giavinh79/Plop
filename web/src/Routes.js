import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Panel from './pages/panel';
import Homepage from './pages/homepage';
import Header from './components/Header/Header';
import Team from './pages/team';
import styled from 'styled-components';
import axios from 'axios';
import { displaySimpleNotification } from './utility/services';

const BodyWrapper = styled.div`
  display: flex;
  min-height: 91%;
`;

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [authenticated, setAuthenticated] = useState(null);
  useEffect(() => {
    async function getToken() {
      try {
        await axios.post('/session', null, { withCredentias: true });
        setAuthenticated(true);
      } catch (err) {
        setAuthenticated(false);
      }
    }
    getToken();
  }, []);

  if (authenticated === null) {
    return <></>;
  } else if (authenticated) {
    return <Route {...rest} render={props => <Component {...props} />} />;
  } else {
    displaySimpleNotification('Session expired', 2, 'bottomRight', 'You need to login again.', 'warning', '#108ee9');
    return <Route {...rest} render={props => <Redirect to='/home' />} />;
  }
};

export default class Routes extends React.Component {
  render() {
    return (
      <Router>
        <Header />
        <BodyWrapper>
          <Switch>
            <Route path='/home' component={Homepage} />
            <ProtectedRoute path='/team' component={Team} />
            <ProtectedRoute path='/dashboard' component={Panel} />
            <Route path='/'>
              <Redirect to='/home' />
            </Route>
          </Switch>
        </BodyWrapper>
      </Router>
    );
  }
}
