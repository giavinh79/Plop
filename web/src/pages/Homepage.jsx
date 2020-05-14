import React, { useState, useRef } from 'react';
import { WrappedNormalLoginForm as SignupForm } from '../components/SignupForm/SignupForm';
import { FormWrapper } from './HomepageStyles';
import { Alert, Button, BackTop, Card, Icon, Modal, Result, Divider } from 'antd';
import MediaQuery from 'react-responsive';
// import Fade from 'react-reveal/Fade';
import './Homepage.css';
import HomepagePrivacyTerms from './HomepagePrivacyTerms';
import Particles from 'react-particles-js';
import { particleParams } from '../constants/particles';

export default function Homepage() {
  const [visible, setVisible] = useState(true);
  const [displayModal, setDisplayModal] = useState(false);
  const signupRef = useRef(); // will need to forward refs
  const backToTop = useRef();

  const hideModal = () => {
    setVisible(false);
  };

  return (
    <>
      {displayModal && <HomepagePrivacyTerms setDisplayModal={setDisplayModal} />}
      <div className='particle-wrapper'>
        <Particles params={particleParams} height='50rem' className='particle-effect' />
      </div>
      <div style={{ width: '100%' }}>
        <div className='landing-container'>
          <div className='landing-flex-wrapper'>
            {/* <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}> */}
            <div className='landing-container-one'>
              <h1 className='landing-header'>
                Make <span style={{ color: '#5faeff' }}>managing projects</span> simple and <span>efficient</span>.
              </h1>
              <h2 className='landing-subheader'>
                Featuring a simple interface with chat, drag-and-drop dashboards, and more,{' '}
                <span style={{ color: '#5FAEFF' }}>Plop</span> makes it easy for teams to stay connected and organized.
              </h2>
            </div>
            <div style={{ display: 'flex', padding: '0 2rem', justifyContent: 'flex-end' }}>
              {/* <img src='/images/work_svg.svg' /> */}
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
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            width: '100%',
            justifyContent: 'center',
            padding: '0 11rem 1.5rem 11rem',
          }}
        >
          <div style={{ flex: 1, padding: '1rem' }}>
            <Alert
              message={<span style={{ fontWeight: '500' }}>Plan</span>}
              description='Create project issues and track their progress through the team/user dashboard.'
              type='info'
              showIcon
              style={{ minWidth: '20rem' }}
            />
          </div>
          <div style={{ flex: 1, padding: '1rem' }}>
            <Alert
              message={<span style={{ fontWeight: '500' }}>Manage</span>}
              description='Create teams, invite new members, and establish a team hierarchy with ease.'
              type='info'
              showIcon
              style={{ minWidth: '20rem' }}
            />
          </div>
          <div style={{ flex: 1, padding: '1rem' }}>
            <Alert
              message={<span style={{ fontWeight: '500' }}>Communicate</span>}
              description='Share issues and collaborate through the notification system and in-built chat.'
              type='info'
              showIcon
              style={{ minWidth: '20rem' }}
            />
          </div>
        </div>
        <div className='landing-plop-image-wrapper'>
          <img
            src='/images/carousel5.PNG'
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
            style={{ position: 'absolute', zIndex: '1', width: '100%', height: '100rem', backgroundColor: '#86868659' }}
          ></div> */}
          {/* <Fade left>
            <Card
              style={{ width: 300, height: '18rem', margin: '5rem' }}
              cover={<img alt='example' src='https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png' />}
            >
              <Card.Meta avatar={<Avatar icon='smile' />} title='Card title' description='This is the description' />
            </Card>
          </Fade>
          <Fade right delay={500}>
            <Card
              style={{ width: 300, height: '18rem', margin: '5rem' }}
              cover={<img alt='example' src='https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png' />}
            >
              <Card.Meta avatar={<Avatar icon='smile' />} title='Card title' description='This is the description' />
            </Card>
          </Fade> */}
          {/* <Fade left>
            <div style={{ width: '50%' }}>
              <img
                src='/images/carousel1.PNG'
                alt='example pic of app'
                style={{ width: '100%', height: 'auto', borderRadius: '15px' }}
              />
            </div>
          </Fade> */}
          {/* <img src='/images/blob-shape.svg' alt='blob' /> */}
        </div>
        <div className='landing-last-section'>
          <Result
            status='success'
            title='What are you waiting for?'
            subTitle='Sign up now and leverate this project management platform for free! Plop will always remain free and open-source.'
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
        <BackTop ref={backToTop} />
        <footer className='landing-footer'>
          <div>
            <p style={{ color: 'white', margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>&copy; 2020 Plop, Inc. </p>
          </div>
          <div className='landing-footer-text'>
            <p
              style={{ color: 'white', cursor: 'pointer', margin: 0, fontSize: '1rem', fontWeight: 'bold' }}
              onClick={() => setDisplayModal(true)}
            >
              Privacy Policy
            </p>
            {/* <Divider type='vertical' style={{ margin: '0 0.5rem' }} />
            <p
              style={{ color: 'white', cursor: 'pointer', margin: 0, fontSize: '1rem', fontWeight: 'bold' }}
              onClick={() => setDisplayModal(true)}
            >
              Terms
            </p> */}
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Icon type='twitter' style={{ fontSize: '2rem', color: 'white' }} />
            <a href='https://github.com/gv79/plop' target='_blank' rel='noopener noreferrer'>
              <Icon type='github' style={{ fontSize: '2rem', color: 'white', margin: '0 1rem' }} />
            </a>
            <img src='/images/justlogo.png' alt='logo' style={{ cursor: 'pointer', height: '2.1rem' }} />
          </div>
        </footer>
      </div>
      <MediaQuery maxDeviceWidth={480} maxWidth={480}>
        <Modal
          title='Mobile usage is unsupported'
          visible={visible}
          onCancel={hideModal}
          footer={
            <Button type='primary' onClick={hideModal}>
              Ok
            </Button>
          }
          width={450}
        >
          <p>Plop is not designed for small screens yet, please wait for the mobile app. Thanks!</p>
        </Modal>
      </MediaQuery>
    </>
  );
}
