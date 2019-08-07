import React from 'react'
import UserPanel from './UserPanel'
import { HeaderWrapper } from './style.js'
import { WrappedHorizontalLoginForm } from './LoginForm.jsx'
import { withRouter } from 'react-router-dom'

function Header(props) {
    return (
        <HeaderWrapper style={{backgroundColor: props.location.pathname === '/home' ? '#445D66' : '#79B7D4'}}>
            <div><img src="images/justlogo.png" alt="logo" style={{cursor: 'pointer', width: '6rem', padding: '0 0.5rem'}}/></div>
            <div style={{marginLeft: 'auto'}}>
                { props.location.pathname === '/home' ? 
                    <WrappedHorizontalLoginForm /> : <UserPanel />
                }
            </div>
        </HeaderWrapper>
    );
}

export default withRouter(Header)