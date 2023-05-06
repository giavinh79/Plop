import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { HeaderWrapper, Logo } from './style.js';
import { WrappedHorizontalLoginForm } from './LoginForm.jsx';
import { ThemeContext } from '../../colors/theme';
import { MobileLogoText } from './HeaderStyles';

export default function Header() {
  const [theme] = useContext(ThemeContext);

  const history = useHistory();

  return (
    <HeaderWrapper theme={theme} homepage style={{ backgroundColor: '#445D66', padding: '1rem 13rem 0 13rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0' }} onClick={() => history.push('/')}>
        <Logo src='/images/justlogo.png' alt='logo' onClick={undefined} homepage style={{ padding: '0 1rem' }} />
        <MobileLogoText>plop</MobileLogoText>
      </div>

      <div className='login-form-wrapper'>
        <WrappedHorizontalLoginForm />
      </div>
    </HeaderWrapper>
  );
}
