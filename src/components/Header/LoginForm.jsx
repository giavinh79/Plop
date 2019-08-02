
import React from 'react'
import 'antd/dist/antd.css'
import { Form, Icon, Input, Button } from 'antd'
import { Redirect } from 'react-router-dom'
import './style.css'

class HorizontalLoginForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      toDashboard : false
    }
  }

  componentDidMount() {
    this.props.form.validateFields();
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ toDashboard : true })
  };

  render() {
    return !this.state.toDashboard ? (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <Form.Item>
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username" required />
        </Form.Item>
        <Form.Item>
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
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
          