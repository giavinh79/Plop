import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Drawer, Form, Button, Col, Row, Input, Select } from 'antd';
import { API_ENDPOINT } from '../../../utility/constants';

const { Option } = Select;

const UserSettings2 = ({ displayUserModal, form }) => {
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || '1');
  const { getFieldDecorator } = form;

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

  const handleClose = () => {
    displayUserModal(false);
  };

  const handleSave = async () => {
    setLoading(true);
    await axios.post(`${API_ENDPOINT}/avatar`, { avatar });
    localStorage.setItem('avatar', avatar);
    setTimeout(() => {
      setLoading(false);
      handleClose();
    }, 1000);
  };

  const handleAvatar = e => {
    setAvatar(e);
  };

  return (
    <Drawer title='Settings' width={360} onClose={handleClose} visible={true} bodyStyle={{ paddingBottom: 80 }}>
      <Form layout='vertical' hideRequiredMark>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label='Change password'>
              {getFieldDecorator('pass', {
                rules: [{ required: true, message: 'Password' }],
              })(<Input placeholder='Please enter password' type='password' disabled />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label='Change email'>
              <Input placeholder='Please enter email' type='password' disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Avatar'>
              <Select
                placeholder='Please choose the type'
                optionLabelProp='label'
                defaultValue={avatar || '1'}
                onChange={e => handleAvatar(e)}
              >
                <Option value='1' label='Avatar 1'>
                  <img src='images/avatars/monster1.svg' alt='avatar 1' />
                </Option>
                <Option value='2' label='Avatar 2'>
                  <img src='images/avatars/monster2.svg' alt='avatar 2' />
                </Option>
                <Option value='3' label='Avatar 3'>
                  <img src='images/avatars/monster3.svg' alt='avatar 3' />
                </Option>
                <Option value='4' label='Avatar 4'>
                  <img src='images/avatars/monster4.svg' alt='avatar 4' />
                </Option>
                <Option value='5' label='Avatar 5'>
                  <img src='images/avatars/monster5.svg' alt='avatar 5' />
                </Option>
                <Option value='6' label='Avatar 6'>
                  <img src='images/avatars/monster6.svg' alt='avatar 6' />
                </Option>
                <Option value='7' label='Avatar 7'>
                  <img src='images/avatars/monster7.svg' alt='avatar 7' />
                </Option>
                <Option value='8' label='Avatar 8'>
                  <img src='images/avatars/monster8.svg' alt='avatar 8' />
                </Option>
                <Option value='9' label='Avatar 9'>
                  <img src='images/avatars/monster9.svg' alt='avatar 9' />
                </Option>
                <Option value='10' label='Avatar 10'>
                  <img src='images/avatars/monster10.svg' alt='avatar 10' />
                </Option>
                <Option value='11' label='Avatar 11'>
                  <img src='images/avatars/monster11.svg' alt='avatar 11' />
                </Option>
                <Option value='12' label='Avatar 12'>
                  <img src='images/avatars/monster12.svg' alt='avatar 12' />
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Theme'>
              <Select placeholder='Please choose the type' defaultValue='light' disabled>
                <Option value='light'>Light Theme</Option>
                <Option value='dark'>Dark Theme</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label='Role'>
              <Input placeholder='i.e. Frontend Developer' type='text' disabled maxLength={50} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label='Activity Overview'>
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: true,
                    message: 'please enter url description',
                  },
                ],
              })(<Input.TextArea rows={4} disabled />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={handleClose} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button type='primary' loading={loading} onClick={handleSave}>
          Save
        </Button>
      </div>
    </Drawer>
  );
};

export default Form.create()(UserSettings2);
