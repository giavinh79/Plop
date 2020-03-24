import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'antd';
import Avatar from './Avatar-deprecated';
import { API_ENDPOINT } from '../../../constants';
import 'antd/dist/antd.css';

export default function UserSettings({ displayUserModal }) {
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
      displayUserModal();
    }, 1000);
    await axios.post(`${API_ENDPOINT}/avatar`, { avatar });
  };

  const handleCancel = () => {
    displayUserModal(false);
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
