
import React from 'react'
import 'antd/dist/antd.css'
import { Form, Icon, Input, Button, Checkbox, notification } from 'antd'
import './style.css'
import axios from 'axios'

class NormalLoginForm extends React.Component {
  openNotification = (status) => {
    notification.open({
      message: status ? 'Success!' : 'Error!',
      duration : 2,
      placement: 'bottomRight',
      description:
        status ? 'Account was created.' : 'Account could not be created.',
      icon: <Icon type={status ? 'smile' : 'warning'} style={{ color: '#108ee9' }} />,
    });
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
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        axios.post('/signup', values)
        .then((res) => {
          this.openNotification(true)
        })
        .catch(err => {
          this.openNotification(false)
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="signup-form">
        <div style={{textAlign: 'center'}}><p style={styles.title}>Sign Up</p></div>
        <Form.Item>
          {getFieldDecorator('email')(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Email"
              required
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            // rules: [{ validator: this.validateToNextPassword }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
              required
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('confirm', {
            // rules: [{ validator: this.compareToFirstPassword }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Confirm Password"
              required
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox style={{color: '#ccc'}}>Terms & Conditions</Checkbox>)}
          <a className="signup-form-forgot" href="/" style={{color:'#ccc'}}>
            Forgot password
          </a>
        </Form.Item>
        <Form.Item style={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button type="primary" htmlType="submit" className="signup-form-button">
                Sign Up
            </Button>
        </Form.Item>
      </Form>
    );
  }
}

const styles = {
    title : {
        fontSize: '3rem',
        fontFamily: 'Montserrat',
        paddingBottom: '2rem',
        color: 'white',
        margin: '0'
    }
}
export const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);