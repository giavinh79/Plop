
import React from 'react'
import axios from 'axios'
import 'antd/dist/antd.css'
import { Form, Icon, Input, Button, notification } from 'antd'
import { Redirect } from 'react-router-dom'
import './style.css'

class HorizontalLoginForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      toDashboard : false
    }
  }
  
  openNotification = (status) => {
      notification.open({
          message: 'Error',
          duration : 2,
          placement: 'bottomRight',
          description: 'Invalid login.',
          icon: <Icon type='warning' style={{ color: 'red' }} />,
      });
  };

  componentDidMount() {
    this.props.form.validateFields()
  }

  handleSubmit = e => {
    e.preventDefault()

    const values = { email: document.querySelector('#loginEmail').value, password: document.querySelector('#loginPassword').value}
    axios.post('/login', values, {withCredentials: true})
    .then(res => {
      // JWT Bearer Token stored on clientside
      localStorage.setItem('email', values.email)
      this.setState({ toDashboard : true })
    })
    .catch(err => {
      this.openNotification()
    })
  }

  render() {
    return !this.state.toDashboard ? (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <Form.Item>
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username" name="loginEmail" id="loginEmail" required />
        </Form.Item>
        <Form.Item>
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password" name="loginPassword" id="loginPassword"
              placeholder="Password" required />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit"> Log in </Button>
        </Form.Item>
      </Form>
    ) : <Redirect push to="/dashboard"/>;
  }
}

export const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_login' })(HorizontalLoginForm);
          