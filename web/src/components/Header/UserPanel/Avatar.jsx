import React from 'react'
import { Divider } from 'antd'

export default function Avatar() {
  const images = [
    'images/avatars/monster1.svg',
    'images/avatars/monster2.svg',
    'images/avatars/monster3.svg',
    'images/avatars/monster4.svg',
    'images/avatars/monster5.svg',
    'images/avatars/monster6.svg',
    'images/avatars/monster7.svg',
    'images/avatars/monster8.svg',
    'images/avatars/monster9.svg',
    'images/avatars/monster10.svg',
    'images/avatars/monster11.svg',
    'images/avatars/monster12.svg'
  ]

  return (
    <>
      <h1 style={{ color: '#666' }}>Choose your avatar!</h1>
      <div style={styles.container}>
        {images.map((image, index) => {
          return <img style={styles.image} key={index} src={image} alt="avatar icon" />
        })}
      </div>
      <Divider />
      <h2 style={{ color: '#666' }}>Change password</h2>
    </>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap'
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
  }
}