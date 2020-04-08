import React from 'react';
import { WrappedNormalLoginForm as SignupForm } from '../components/SignupForm/SignupForm';
import { Body, FormWrapper } from './HomepageStyles';

export default function Homepage() {
  return (
    // <div style={{ width: '100%' }}>
    //   <div style={{ height: '35rem', borderBottom: '1px solid #ccc', flexDirection: 'row' }}>
    //     <div
    //       style={{
    //         height: '100%',
    //         backgroundImage: "url('images/coder.jpg')",
    //         bakcgroundPosition: 'center top',
    //         backgroundSize: 'cover',
    //         overflow: 'hidden',
    //       }}
    //     >
    //       f
    //     </div>
    //     <div></div>
    //   </div>
    // </div>
    <Body>
      <FormWrapper>
        <SignupForm />
      </FormWrapper>
      <div style={styles.formBackground} />
    </Body>
  );
}

const styles = {
  formBackground: {
    zIndex: '2',
    position: 'absolute',
    top: '14rem',
    left: '0',
    right: '0',
    marginLeft: 'auto',
    marginRight: 'auto',
    height: '30rem',
    width: '40rem',
    opacity: 0.6,
    backgroundColor: 'rgb(31, 42, 53)',
    maxWidth: '25rem',
    borderRadius: '10px',
  },
};
