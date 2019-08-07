import React from 'react'
import 'antd/dist/antd.css'
import { layout, subheader } from '../../globalStyles'
import { Input, Form, Radio, Button, Upload, Icon } from 'antd'

const { TextArea } = Input;

class CreateIssue extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <div style={layout}>
        <p style={subheader}>Create Issue</p>
        <Form {...formItemLayout} onSubmit={this.handleSubmit} style={{maxWidth: '60rem'}}>
          <Form.Item label="Title">
            {getFieldDecorator('title', {
              rules: [{ required: true, message: 'Please input your note!' }],
            })(<Input />)}
          </Form.Item>

          <Form.Item label="Short Description">
            {getFieldDecorator('short-description', {
              rules: [{ required: true, message: 'Please input a short description' }],
            })(<Input />)}
          </Form.Item>

          <Form.Item label="Description">
            {getFieldDecorator('description')(<TextArea />)}
          </Form.Item>

          <Form.Item label="Priority">
          {getFieldDecorator('priority', {initialValue: 2})(
            <Radio.Group>
              <Radio value={1}>Major</Radio>
              <Radio value={2}>Minor</Radio>
            </Radio.Group>
          )}
          </Form.Item>

          <Form.Item label="Status">
          {getFieldDecorator('status', {initialValue: 2})(
            <Radio.Group>
              <Radio value={1}>Active</Radio>
              <Radio value={2}>Backlog</Radio>
            </Radio.Group>
          )}
          </Form.Item>

          <Form.Item label="Assignee">
            {getFieldDecorator('assignee')(<Input.Search
              placeholder="Search by email"
              onSearch={value => console.log(value)}
              style={{ width: 200 }}
            />)}
          </Form.Item>

          <Form.Item label="Images">
            <div className="dropbox" style={{width:'100%'}}>
              {getFieldDecorator('dragger', {
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
              })(
                <Upload.Dragger name="files" action="/upload.do" accept="image/*, .xml, .json, .txt, .doc, .docx">
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">Click or drag images/text files to this area to upload</p>
                  <p className="ant-upload-hint">Upload size limit set to 10MB.</p>
                </Upload.Dragger>,
              )}
            </div>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export const WrappedCreateIssueForm = Form.create({ name: 'validate_other' })(CreateIssue);