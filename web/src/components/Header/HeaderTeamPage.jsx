import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { HeaderWrapper, Logo } from './style.js';
import { ThemeContext } from '../../colors/theme';
import { MobileLogoText } from './HeaderStyles';

export default function HeaderTeamPage() {
  const [theme] = useContext(ThemeContext);

  const history = useHistory();
  const { location } = history;

  return (
    <HeaderWrapper theme={theme} homepage={false}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem' }} onClick={() => history.push('/')}>
        <Logo
          src='/images/justlogo.png'
          alt='logo'
          onClick={undefined}
          homepage={location.pathname === '/' ? 1 : 0}
          style={{ padding: location.pathname === '/team' ? 0 : '0 1rem' }}
        />
        <MobileLogoText style={{ margin: '0 0 0 0.5rem', fontSize: '2rem' }}>plop</MobileLogoText>
      </div>
    </HeaderWrapper>
  );
}
