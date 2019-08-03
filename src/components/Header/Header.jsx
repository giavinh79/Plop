import React from 'react'
import { Wrapper } from './style.js'
import { WrappedHorizontalLoginForm } from './LoginForm.jsx'
import { withRouter } from 'react-router-dom'

function Header(props) {
    return (
        <Wrapper style={{backgroundColor: props.location.pathname === '/home' ? '#445D66' : '#79B7D4'}}>
            <div><img src="images/justlogo.png" alt="logo" style={{cursor: 'pointer', width: '6rem', padding: '0 0.5rem'}}/></div>
            { props.location.pathname === '/home' ? 
                <div style={{marginLeft: 'auto'}}>
                    <WrappedHorizontalLoginForm />
                </div> : ''
            }
        </Wrapper>
    );
}

export default withRouter(Header)