import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { Homepage, Team } from './pages';
import Header from './components/Header/HeaderMain';
import SideNav from './components/SideNav/SideNav';
import TeamDashboard from './components/Dashboard/TeamDashboard';
import UserDashboard from './components/Dashboard/UserDashboard';
import Overview from './components/ProjectOverview/Overview';
import Schedule from './components/Schedule/Schedule';
import ViewMembers from './components/ViewMembers/ViewMembers';
import Notes from './components/Notes/Notes';
import { WrappedCreateIssueForm } from './components/CreateIssue/CreateIssue';
import Active from './components/Active/Active';
import Backlog from './components/Backlog/Backlog';
import Logs from './components/Logs/Logs';
import Settings from './components/Settings/Settings';
import ChatIcon from './components/Chat/ChatIcon';
import HelpPanel from './components/Help/HelpPanel';
import BannedMembers from './components/BannedMembers/BannedMembers';
import { BodyWrapper, DashboardWrapper } from './globalStyles';
import { displaySimpleNotification } from './utility/services';
import { ThemeProvider } from './colors/theme';
import { checkAuth } from './utility/restCalls';
import HeaderDashboardPage from './components/Header/HeaderDashboardPage';
import HeaderTeamPage from './components/Header/HeaderTeamPage';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [authenticated, setAuthenticated] = useState(null);
  useEffect(() => {
    async function getToken() {
      try {
        await checkAuth();
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
    return <Route {...rest} render={(props) => <Component {...props} />} />;
  } else {
    displaySimpleNotification('Session expired', 2, 'bottomRight', 'You need to login again.', 'warning', '#108ee9');
    return <Route {...rest} render={() => <Redirect to='/' />} />;
  }
};

const addHeader = (Component, Header) => {
  return () => (
    <>
      {Header && <Header />}
      <BodyWrapper><Component /></BodyWrapper>
    </>
  )
}

function lazyLoadCss() {
  const cssToLazyLoad = ['https://fonts.googleapis.com/css?family=Montserrat'];
  const { head } = document;

  cssToLazyLoad.forEach((css) => {
    const link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = css;
    head.appendChild(link);
  });
}

export default function Routes() {
  useEffect(() => {
    lazyLoadCss()
  }, []);

  return (
    <ThemeProvider>
      <Router>

        <Switch>
          <Route exact path='/' component={addHeader(Homepage, Header)} />
          <ProtectedRoute path='/team' component={addHeader(Team, HeaderTeamPage)} />

          <Route
            path='/dashboard'
            render={({ match: { url } }) => (
              <>
                <HeaderDashboardPage />
                <BodyWrapper>
                  <SideNav path={window.location.pathname} />
                  <DashboardWrapper>
                    <Switch>
                      <ProtectedRoute path={`${url}/`} component={TeamDashboard} exact />
                      <ProtectedRoute
                        path={`${url}/issue/:id`}
                        component={(props) => <WrappedCreateIssueForm isManualNavigation {...props} />}
                      />
                      <ProtectedRoute path={`${url}/user`} component={UserDashboard} />
                      <ProtectedRoute path={`${url}/overview`} component={Overview} />
                      <ProtectedRoute path={`${url}/schedule`} component={Schedule} />
                      <ProtectedRoute path={`${url}/notes`} component={Notes} />
                      <ProtectedRoute path={`${url}/members`} component={ViewMembers} />
                      <ProtectedRoute path={`${url}/members-banned`} component={BannedMembers} />
                      <ProtectedRoute path={`${url}/create-issue`} component={WrappedCreateIssueForm} />
                      <ProtectedRoute path={`${url}/active-issues`} component={Active} />
                      <ProtectedRoute path={`${url}/backlog-issues`} component={Backlog} />
                      <ProtectedRoute path={`${url}/archive-issues`} component={Backlog} />
                      <ProtectedRoute path={`${url}/logs`} component={Logs} />
                      <ProtectedRoute path={`${url}/settings`} component={Settings} />
                      <ProtectedRoute path={`${url}/help`} component={HelpPanel} />
                      <Redirect push to='/' />
                    </Switch>
                  </DashboardWrapper>
                  <ChatIcon />
                </BodyWrapper>
              </>
            )}
          />
          <Redirect to='/' />
        </Switch>
      </Router>
    </ThemeProvider >
  );
}
