import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import Avatar from './Avatar';
import axios from 'axios';
import 'antd/dist/antd.css';
import { API_ENDPOINT } from '../../../utility/constants';

export default function UserSettings({ handleUserModal }) {
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || '1');

  useEffect(() => {
    (async function() {
      const { data } = await axios.get(`${API_ENDPOINT}/avatar`);
      let avatarIndex = data.avatar.toString();
      setAvatar(avatarIndex);
      localStorage.setItem('avatar', avatarIndex);
    })().catch(err => {
      console.log(err);
    });
  }, []);

  const handleOk = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleUserModal();
    }, 1000);
    await axios.post(`${API_ENDPOINT}/avatar`, { avatar });
  };

  const handleCancel = () => {
    handleUserModal();
  };

  return (
    <Modal
      visible={true}
      title='Settings'
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key='back' onClick={handleCancel}>
          Return
        </Button>,
        <Button key='submit' type='primary' loading={loading} onClick={handleOk}>
          Save
        </Button>,
      ]}
    >
      <Avatar avatar={avatar} setAvatar={setAvatar} />
    </Modal>
  );
}
