import React from 'react';
import { Divider } from 'antd';

export default function Avatar({ avatar, setAvatar }) {
  const handleAvatarChange = event => {
    setAvatar(event.target.alt.substring(event.target.alt.lastIndexOf(' ') + 1));
  };

  const selectedAvatar = index => {
    if (index === avatar) return true;
  };

  return (
    <>
      <h1 style={{ color: '#666' }}>Choose your avatar!</h1>
      <div style={styles.container}>
        <img
          style={selectedAvatar('1') ? { ...styles.image, backgroundColor: '#e0e0e0' } : styles.image}
          src={'images/avatars/monster1.svg'}
          alt='avatar icon 1'
          onClick={e => handleAvatarChange(e)}
        />
        <img
          style={selectedAvatar('2') ? { ...styles.image, backgroundColor: '#e0e0e0' } : styles.image}
          src={'images/avatars/monster2.svg'}
          alt='avatar icon 2'
          onClick={e => handleAvatarChange(e)}
        />
        <img
          style={selectedAvatar('3') ? { ...styles.image, backgroundColor: '#e0e0e0' } : styles.image}
          src={'images/avatars/monster3.svg'}
          alt='avatar icon 3'
          onClick={e => handleAvatarChange(e)}
        />
        <img
          style={selectedAvatar('4') ? { ...styles.image, backgroundColor: '#e0e0e0' } : styles.image}
          src={'images/avatars/monster4.svg'}
          alt='avatar icon 4'
          onClick={e => handleAvatarChange(e)}
        />
        <img
          style={selectedAvatar('5') ? { ...styles.image, backgroundColor: '#e0e0e0' } : styles.image}
          src={'images/avatars/monster5.svg'}
          alt='avatar icon 5'
          onClick={e => handleAvatarChange(e)}
        />
        <img
          style={selectedAvatar('6') ? { ...styles.image, backgroundColor: '#e0e0e0' } : styles.image}
          src={'images/avatars/monster6.svg'}
          alt='avatar icon 6'
          onClick={e => handleAvatarChange(e)}
        />
        <img
          style={selectedAvatar('7') ? { ...styles.image, backgroundColor: '#e0e0e0' } : styles.image}
          src={'images/avatars/monster7.svg'}
          alt='avatar icon 7'
          onClick={e => handleAvatarChange(e)}
        />
        <img
          style={selectedAvatar('8') ? { ...styles.image, backgroundColor: '#e0e0e0' } : styles.image}
          src={'images/avatars/monster8.svg'}
          alt='avatar icon 8'
          onClick={e => handleAvatarChange(e)}
        />
        <img
          style={selectedAvatar('9') ? { ...styles.image, backgroundColor: '#e0e0e0' } : styles.image}
          src={'images/avatars/monster9.svg'}
          alt='avatar icon 9'
          onClick={e => handleAvatarChange(e)}
        />
        <img
          style={selectedAvatar('10') ? { ...styles.image, backgroundColor: '#e0e0e0' } : styles.image}
          src={'images/avatars/monster10.svg'}
          alt='avatar icon 10'
          onClick={e => handleAvatarChange(e)}
        />
        <img
          style={selectedAvatar('11') ? { ...styles.image, backgroundColor: '#e0e0e0' } : styles.image}
          src={'images/avatars/monster11.svg'}
          alt='avatar icon 11'
          onClick={e => handleAvatarChange(e)}
        />
        <img
          style={selectedAvatar('12') ? { ...styles.image, backgroundColor: '#e0e0e0' } : styles.image}
          src={'images/avatars/monster12.svg'}
          alt='avatar icon 12'
          onClick={e => handleAvatarChange(e)}
        />
      </div>
      <Divider />
      <h2 style={{ color: '#666' }}>Change password</h2>
    </>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  image: {
    borderRadius: '50%',
    border: '1px solid #e6e6e6',
    minWidth: '3rem',
    width: '25%',
    cursor: 'pointer',
    // CSS below for showing 'active' or 'chosen' avatar
    // color: '#ece958',
    // boxShadow: '0px 0px 20px 8px',
  },
};
