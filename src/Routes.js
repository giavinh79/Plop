import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'
import Dashboard from './pages/dashboard';
import Header from './components/Header/Header';
import SideNav from './components/SideNav/SideNav';
import { WrappedNormalLoginForm } from './components/SignupForm/SignupForm';

class Routes extends React.Component {
  // state = {
  //   isLogged : false
  // }

  // setLogged = () => {
  //   console.log('hahah')
  //   this.setState({ isLogged : true })
  //   console.log(this.state)
  // }

  render() {
    return (
      <>
        <Router>
          <Header />
          <div style={styles.body}>
            <Switch>
              <Route exact path='/home' render={() => {
                return (
                  <div style={styles.formContainer}>
                    <div style={styles.form}>
                      <WrappedNormalLoginForm/>
                    </div>
                    <div style={{zIndex: '2', position: 'absolute', bottom: '30%', left: '0', right: '0', marginLeft: 'auto', marginRight: 'auto', height: '50%', width:'30%', opacity: 0.6, backgroundColor: 'black', maxWidth: '25rem'}}></div>
                  </div>
                )}}/>
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
  },
  formContainer : {
    width:'100%',
    backgroundImage: 'url(\'images/wallpaper.png\')',
    backgroundPosition: '0 0'
  },
  form : {
    position: 'absolute',
    bottom: '20%',
    height: '50%',
    left:'0',
    right: '0',
    marginLeft: 'auto',
    marginRight: 'auto',
    width:'20%',
    maxWidth: '20rem',
    zIndex: '3', 
  }
}

export default Routes;
