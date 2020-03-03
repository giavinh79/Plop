import React from 'react';
import axios from 'axios';
import { Button, Form, Icon, Input, Modal } from 'antd';
import { displaySimpleNotification } from '../../utility/services';
import { API_ENDPOINT } from '../../utility/constants';
import MediaQuery from 'react-responsive';
import './style.css';

class NormalLoginForm extends React.Component {
  state = {
    visible: true,
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Passwords do not match!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        try {
          await axios.post(`${API_ENDPOINT}/signup`, values);
          displaySimpleNotification('Success!', 2, 'bottomRight', 'Account was created.', 'smile', '#108ee9');
        } catch (err) {
          displaySimpleNotification('Error!', 2, 'bottomRight', 'Account could not be created.', 'warning', '#108ee9');
        }
      }
    });
  };

  hideModal = () => {
    this.setState({ visible: false });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <>
        <Form onSubmit={this.handleSubmit} className='signup-form'>
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
              rules: [{ validator: this.validateToNextPassword }],
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
              rules: [{ validator: this.compareToFirstPassword }],
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
        <MediaQuery minDeviceWidth={480} maxWidth={480}>
          <Modal
            title='Mobile usage is unsupported'
            visible={this.state.visible}
            onCancel={this.hideModal}
            footer={
              <Button type='primary' onClick={this.hideModal}>
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
