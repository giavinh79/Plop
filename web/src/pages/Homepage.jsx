import React, { useState, useRef, lazy, Suspense } from 'react';
import { WrappedNormalLoginForm as SignupForm } from '../components/SignupForm/SignupForm';
import { FormWrapper } from './HomepageStyles';
import { Alert, Button, Icon, Result } from 'antd';
import HomepagePrivacyTerms from './HomepagePrivacyTerms';
import { particleParams } from '../constants/particles';
import HomepageTermsConditions from './HomepageTermsConditions';
import './Homepage.css';

const ParticlesComponent = lazy(async () => {
  return Promise.all([import('react-tsparticles'), new Promise((resolve) => setTimeout(resolve, 300))]).then(
    ([moduleExports]) => moduleExports
  );
});

const Backtop = lazy(() => import('antd').then((module) => ({ default: module.BackTop })));

export default function Homepage() {
  const [displayPrivacyModal, setDisplayPrivacyModal] = useState(false);
  const [displayTermsModal, setDisplayTermsModal] = useState(false);
  // const signupRef = useRef(); // will need to forward refs
  const backToTop = useRef();

  return (
    <>
      {displayPrivacyModal && <HomepagePrivacyTerms setDisplayPrivacyModal={setDisplayPrivacyModal} />}
      {displayTermsModal && <HomepageTermsConditions setDisplayTermsModal={setDisplayTermsModal} />}
      <div className='particle-wrapper'>
        <Suspense fallback={<></>}>
          {window.innerWidth > 870 && (
            <ParticlesComponent options={particleParams} height='50rem' className='particle-effect' />
          )}
        </Suspense>
      </div>
      <div style={{ width: '100%' }}>
        <div className='landing-container'>
          <div className='landing-flex-wrapper'>
            <div className='landing-container-one'>
              <h1 className='landing-header'>
                Make <span style={{ color: '#5faeff' }}>managing projects</span> simple and <span>efficient</span>.
              </h1>
              <h1 className='landing-mobile-header'>
                Plop is not designed for small screens yet, please wait for the mobile app. Thanks!
              </h1>
              <h2 className='landing-subheader'>
                Featuring a simple interface with chat, drag-and-drop dashboards, and more,{' '}
                <span style={{ color: '#5FAEFF' }}>Plop</span> makes it easy for teams to stay connected and organized.
              </h2>
            </div>
            <div style={{ display: 'flex', padding: '0 2rem', justifyContent: 'flex-end' }}>
              <FormWrapper style={{ position: 'inherit' }}>
                <SignupForm />
              </FormWrapper>
            </div>
          </div>
        </div>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'>
          <path
            fill='#445D66'
            fillOpacity='1'
            d='M0,96L60,101.3C120,107,240,117,360,117.3C480,117,600,107,720,112C840,117,960,139,1080,149.3C1200,160,1320,160,1380,160L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z'
          ></path>
        </svg>
        <div className='landing-section-one'>
          <p className='landing-section-header-one'>Why Plop?</p>
        </div>
        <div className='landing-section-info-wrapper'>
          <div className='landing-section-info'>
            <img src='/images/plan.svg' alt='plan' style={{ width: '100%', padding: '0 3rem', maxWidth: '30rem' }} />
            <Alert
              message={<span style={{ fontWeight: '500' }}>Plan</span>}
              description='Create project issues and track their progress through the team/user dashboard.'
              type='info'
              showIcon
              style={{ minWidth: '20rem', marginTop: '2rem' }}
            />
          </div>
          <div className='landing-section-info'>
            <img
              src='/images/manage.svg'
              alt='manage'
              style={{ width: '100%', padding: '0 3rem', maxWidth: '30rem' }}
            />
            <Alert
              message={<span style={{ fontWeight: '500' }}>Manage</span>}
              description='Create teams, invite new members, and establish a team hierarchy with ease.'
              type='info'
              showIcon
              style={{ minWidth: '20rem', marginTop: '2rem' }}
            />
          </div>
          <div className='landing-section-info'>
            <img
              src='/images/communicate.svg'
              alt='communicate'
              style={{ width: '100%', padding: '0 3rem', maxWidth: '30rem' }}
            />
            <Alert
              message={<span style={{ fontWeight: '500' }}>Communicate</span>}
              description='Share issues and collaborate through the notification system and in-built chat.'
              type='info'
              showIcon
              style={{ minWidth: '20rem', marginTop: '2rem' }}
            />
          </div>
        </div>
        <div className='landing-plop-image-wrapper'>
          <img
            src='/images/landing.png'
            style={{
              border: '1px solid #e8e8e8',
              borderRadius: '10px',
              boxShadow: '0 6px 15px rgba(36, 37, 38, 0.08)',
              width: '100%',
              height: 'auto',
            }}
            alt='plop interface'
          />
        </div>

        <div className='landing-cloud-section'>
          {/* <div
            className='landing-cloud-section-filter'
            style={{ position: 'absolute', zIndex: '1', width: '100%', height: '100rem', backgroundColor: '#86868659' }}
          ></div> */}
          <Suspense fallback={<></>}>
            <div className='suspense-element'>
              <div className='fade-in-element-wrapper'>
                <img src='/images/opensource.svg' className='fade-in-element-image' alt='open-source' />
              </div>
              <div
                className='fade-in-element-wrapper'
                style={{ padding: '2rem', fontFamily: 'Montserrat', maxWidth: '800px' }}
              >
                <p className='fade-in-element-text'>
                  <span style={{ color: '#577090' }}>Free</span> and
                  <span style={{ color: '#577090' }}> Open Source</span>
                </p>
                <p style={{ fontSize: '1.2rem', color: '#666' }}>
                  As an open-source project, anyone can help contribute to Plop's code repository. By being community
                  driven, more power and flexibility is given to the users. Drop by the GitHub (in site footer) and help
                  improve Plop!
                </p>
              </div>
            </div>
            <div className='suspense-element' style={{ marginTop: '2rem' }}>
              <div className='fade-in-element-wrapper'>
                <img src='/images/theme.svg' className='fade-in-element-image' alt='configuration' />
              </div>
              <div
                className='fade-in-element-wrapper'
                style={{ padding: '2rem', fontFamily: 'Montserrat', maxWidth: '800px' }}
              >
                <p className='fade-in-element-text'>
                  <span style={{ color: '#577090' }}>Comprehensive</span>
                </p>
                <p style={{ fontSize: '1.2rem', color: '#666' }}>
                  There are many other features that still haven't been discussed! Theming, avatars, team and user
                  logs... all these different functionalities give users a complete experience and the ability to
                  customize various things.
                </p>
              </div>
            </div>
          </Suspense>
        </div>
        <div className='landing-last-section'>
          <Result
            status='success'
            title='What are you waiting for?'
            subTitle='Sign up now and leverate this project management platform for free! Feel free to contact us for any questions, concerns, or feedback.'
            extra={[
              <Button type='primary' key='registration' onClick={() => backToTop.current.scrollToTop()}>
                Sign Up
              </Button>,
              <Button key='contact' onClick={() => (window.location.href = 'mailto:plopwebapp@gmail.com')}>
                Contact Us
              </Button>,
            ]}
            className='landing-last-section-content'
          />
        </div>
        <Suspense fallback={<></>}>
          <Backtop ref={backToTop} />
        </Suspense>

        <footer className='landing-footer'>
          <div className='landing-footer-text'>
            <p style={{ color: '#e2e2e2', margin: 0 }}>&copy; 2020 Plop, Inc. </p>
            <p className='landing-footer-terms' onClick={() => setDisplayPrivacyModal(true)}>
              Privacy
            </p>
            <p className='landing-footer-terms' onClick={() => setDisplayTermsModal(true)}>
              Terms
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <a href='https://twitter.com/plopwebapp' target='_blank' rel='noopener noreferrer'>
              <Icon type='twitter' style={{ fontSize: '2rem', color: 'white' }} />
            </a>
            <a href='https://github.com/gv79/plop' target='_blank' rel='noopener noreferrer'>
              <Icon type='github' style={{ fontSize: '2rem', color: 'white', margin: '0 1rem' }} />
            </a>
            <img src='/images/justlogo.png' alt='logo' style={{ cursor: 'pointer', height: '2.1rem' }} />
          </div>
        </footer>
      </div>
    </>
  );
}
