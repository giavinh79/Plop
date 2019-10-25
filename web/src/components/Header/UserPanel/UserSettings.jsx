
import React from 'react'
import 'antd/dist/antd.css'
import { Modal, Button } from 'antd'
import Avatar from './Avatar';

export default class UserSettings extends React.Component {
  state = {
    loading: false
  };

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
      this.props.handleUserModal();
    }, 3000);
  };

  handleCancel = () => {
    this.props.handleUserModal();
  };

  render() {
    const { loading } = this.state;
    return (
      <div>
        <Modal
          visible={true}
          title="Settings"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Return
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
              Save
            </Button>,
          ]}
        >
        <Avatar />
        </Modal>
      </div>
    );
  }
}
          