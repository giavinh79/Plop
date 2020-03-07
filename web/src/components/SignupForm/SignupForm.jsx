import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Icon, Input, Modal } from 'antd';
import { displaySimpleNotification } from '../../utility/services';
import { API_ENDPOINT } from '../../utility/constants';
import MediaQuery from 'react-responsive';
import './style.css';
import { Redirect } from 'react-router-dom';

function NormalLoginForm({ form }) {
  const [visible, setVisible] = useState(true);
  const [toTeam, setToTeam] = useState(false);
  const { getFieldDecorator } = form;

  const compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== form.getFieldValue('password')) {
      callback('Passwords do not match!');
    } else {
      callback();
    }
  };

  const validateToNextPassword = (rule, value, callback) => {
    if (value) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  const handleSubmit = async e => {
    e.preventDefault();
    form.validateFields(async (err, values) => {
      if (!err) {
        try {
          await axios.post(`${API_ENDPOINT}/signup`, values);
          displaySimpleNotification('Success!', 2, 'bottomRight', 'Account was created.', 'smile', '#108ee9');
          await axios.post(`${API_ENDPOINT}/login`, values);
          setToTeam(true);
        } catch (err) {
          displaySimpleNotification('Error!', 2, 'bottomRight', 'Account could not be created.', 'warning', '#108ee9');
        }
      }
    });
  };

  const hideModal = () => {
    setVisible(false);
  };

  return (
    <>
      {toTeam && <Redirect push to='/team' />}
      <Form onSubmit={handleSubmit} className='signup-form'>
        <div style={{ textAlign: 'center' }}>
          <p style={styles.title}>Sign Up</p>
        </div>
        <Form.Item>
          {getFieldDecorator('email')(
            <Input
              prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='Email'
              type='email'
              required
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ validator: validateToNextPassword }],
          })(
            <Input
              prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
              type='password'
              placeholder='Password'
              autoComplete='new-password'
              required
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('confirm', {
            rules: [{ validator: compareToFirstPassword }],
          })(
            <Input
              prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
              type='password'
              placeholder='Confirm Password'
              autoComplete='new-password'
              required
            />
          )}
        </Form.Item>
        <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {/* button bg color potential #495463 */}
          <Button type='primary' htmlType='submit' className='signup-form-button'>
            Register
          </Button>
        </Form.Item>
      </Form>
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

const styles = {
  title: {
    fontSize: '3rem',
    fontFamily: 'Montserrat',
    paddingBottom: '2rem',
    color: 'white',
    margin: '0',
  },
};

export const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);
