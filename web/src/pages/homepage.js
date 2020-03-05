import React from 'react';
import { WrappedNormalLoginForm } from '../components/SignupForm/SignupForm';

export default function Homepage() {
  return (
    <div style={styles.formContainer}>
      <div style={styles.form}>
        <WrappedNormalLoginForm />
      </div>
      <div style={styles.formBackground} />
    </div>
  );
}

const styles = {
  formContainer: {
    width: '100%',
    backgroundImage: "url('images/wallpaper.png')",
    backgroundSize: 'cover',
  },
  form: {
    position: 'absolute',
    top: '19rem',
    height: '28rem',
    left: '0',
    right: '0',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '30rem',
    maxWidth: '20rem',
    zIndex: '3',
  },
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
