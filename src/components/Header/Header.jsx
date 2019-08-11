import React from 'react'
import UserPanel from './UserPanel/UserPanel'
import { HeaderWrapper, Logo } from './style.js'
import { WrappedHorizontalLoginForm } from './LoginForm.jsx'
import { withRouter } from 'react-router-dom'


function Header(props) {
    const handleClick = () => {
        // run function passed in as prop from routes when it is implemented - check what path we are currently on as well
    }

    return (
        <HeaderWrapper style={{backgroundColor: props.location.pathname === '/home' ? '#445D66' : '#79B7D4'}}>
            <Logo src="images/justlogo.png" alt="logo" onClick={handleClick}/>
            <div style={{marginLeft: 'auto'}}>
                { props.location.pathname === '/home' ? 
                    <WrappedHorizontalLoginForm /> : <UserPanel />
                }
            </div>
        </HeaderWrapper>
    );
}

export default withRouter(Header)