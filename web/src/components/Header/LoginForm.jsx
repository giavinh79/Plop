import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Button, Col, Form, Input, Icon } from 'antd';
import { API_ENDPOINT } from '../../constants';
import { displaySimpleNotification } from '../../utility/services';
import { checkAuth, logout } from '../../utility/restCalls';
import './style.css';

function HorizontalLoginForm({ form }) {
  const [loggedInEmail, setLoggedInEmail] = useState(null);
  const [toDashboard, setToDashboard] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    form.validateFields();
    checkSession();
  }, [form]);

  const handleLoginFail = () => {
    displaySimpleNotification('Error', 4, 'bottomRight', 'Invalid login.', 'warning', 'red');
  };

  const checkSession = async () => {
    try {
      const {
        data: { email },
      } = await checkAuth();
      setLoggedInEmail(email);
    } catch (err) {
      localStorage.clear();
      setLoggedInEmail(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_ENDPOINT}/login`, { email, password });
      setToDashboard(true);
    } catch (err) {
      handleLoginFail();
      setPassword('');
    }
  };

  const handleLogout = async () => {
    await logout().catch((err) => {
      displaySimpleNotification('Error', 5, 'bottomRight', `Log out was unsuccessful. ${err}`, 'warning', 'red');
    });
    localStorage.clear(); // get rid of team caching and other vars
    setLoggedInEmail(false);
  };

  return (
    <>
      {loggedInEmail ? (
        <Col type='flex' align='middle' style={{ textAlign: 'right' }}>
          <p className='loggedInText' onClick={() => setToDashboard(true)}>
            Continue as {loggedInEmail} <Icon type='swap-right' />
          </p>
          <p className='loggedInText' onClick={handleLogout}>
            <span style={{ color: '#e4d8d8' }}>
              Sign out <Icon type='swap-left' />
            </span>
          </p>
        </Col>
      ) : (
        <Form layout='inline' onSubmit={handleSubmit} className='login-form'>
          <Form.Item>
            <Input
              prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder='Username'
              name='loginEmail'
              id='loginEmail'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              autoComplete='username'
              required
            />
          </Form.Item>
          <Form.Item>
            <Input
              prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
              type='password'
              name='loginPassword'
              id='loginPassword'
              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              autoComplete='current-password'
              required
            />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Log in
            </Button>
          </Form.Item>
        </Form>
      )}
      {toDashboard && <Redirect push to='/team' />}
    </>
  );
}

export const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_login' })(HorizontalLoginForm);
