import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { Homepage, Panel, Team } from './pages';
import Header from './components/Header/Header';
import { displaySimpleNotification } from './utility/services';
import { API_ENDPOINT } from './constants';
import { ThemeProvider } from './Theme';
// import IssuePage from './pages/IssuePage';

const BodyWrapper = styled.div`
  display: flex;
  min-height: 91%;
`;

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [authenticated, setAuthenticated] = useState(null);
  useEffect(() => {
    async function getToken() {
      try {
        await axios.post(`${API_ENDPOINT}/session`);
        setAuthenticated(true);
      } catch (err) {
        setAuthenticated(false);
      }
    }
    getToken();
  }, []);

  if (authenticated == null) {
    return <></>;
  } else if (authenticated) {
    return <Route {...rest} render={props => <Component {...props} />} />;
  } else {
    displaySimpleNotification('Session expired', 2, 'bottomRight', 'You need to login again.', 'warning', '#108ee9');
    return <Route {...rest} render={() => <Redirect to='/' />} />;
  }
};

export default function Routes() {
  return (
    <ThemeProvider>
      <Router>
        <Header />
        <BodyWrapper>
          <Switch>
            <Route exact path='/' component={Homepage} />
            <ProtectedRoute path='/team' component={Team} />
            {/* <ProtectedRoute path='/dashboard/issue:id' component={IssuePage} /> */}
            <ProtectedRoute path='/dashboard' component={Panel} />
            <Redirect to='/' />
          </Switch>
        </BodyWrapper>
      </Router>
    </ThemeProvider>
  );
}
