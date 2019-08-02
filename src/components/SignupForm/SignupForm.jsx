
import React from 'react'
import 'antd/dist/antd.css'
import { Form, Icon, Input, Button, Checkbox } from 'antd'
import './style.css'

class NormalLoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="signup-form">
        <div style={{textAlign: 'center'}}><p style={styles.title}>Sign Up</p></div>
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your email!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Email"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox style={{color: '#ccc'}}>Remember me</Checkbox>)}
          <a className="signup-form-forgot" href="/" style={{color:'#ccc'}}>
            Forgot password
          </a>
          {/* Or <a href="">register now!</a> */}
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