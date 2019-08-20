import React from 'react'
import { layout, subheader } from '../../globalStyles'
import './style.css'
import { Input, Form, Radio, Button, Divider, Select, Upload, Icon } from 'antd'
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
        const tagSuggestions = [
          <Select.Option key='1'>Frontend</Select.Option>,
          <Select.Option key='2'>Backend</Select.Option>,
          <Select.Option key='3'>Testing</Select.Option>,
          <Select.Option key='4'>Documentation</Select.Option>,
          <Select.Option key='5'>Database</Select.Option>,
          <Select.Option key='6'>DevOps</Select.Option>
        ]

        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

      return (
          <div style={layout} className="createIssue">
              <p style={subheader}>Create Issue</p>
              <Form {...formItemLayout} onSubmit={this.handleSubmit} style={{display: 'flex', flexWrap: 'wrap', maxWidth: '80rem'}}>
                <div style={{flex: 4, padding: '1rem'}}>
                  <Form.Item label='Title'>
                    {getFieldDecorator('title', {
                      rules: [{ required: true, message: 'Please input your title!' }],
                    })(<Input />)}
                  </Form.Item>

                  <Form.Item label='Short Description'>
                    {getFieldDecorator('short-description', {
                      rules: [{ required: true, message: 'Please input a short description' }],
                    })(<Input />)}
                  </Form.Item>

                  <Form.Item label='Description'>
                    {getFieldDecorator('description')(<TextArea autosize={{minRows: '2'}}/>)}
                  </Form.Item>
                  
                  <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
                      <Form.Item label='Assignee' style={{flexDirection: 'row', alignItems: 'center', marginRight: '1rem'}}>
                        {getFieldDecorator('assignee')(<Input.Search
                          placeholder='Search by email'
                          onSearch={value => console.log(value)}
                          style={{ width: 200 }}
                        />)}
                      </Form.Item>

                      <Form.Item label='Tags' style={{flexDirection: 'row', alignItems: 'center'}}>
                        {getFieldDecorator('tag')(
                          <Select mode='tags' maxTagTextLength={10} maxTagCount={1} style={{ width: '100%' }} placeholder='Issue Tags' onChange={() => {console.log('hi')}}>
                            {tagSuggestions}
                          </Select>
                        )}
                      </Form.Item>
                  </div>

                  <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
                      <Form.Item label='Priority' style={{flexDirection: 'row'}}>
                      {getFieldDecorator('priority', {initialValue: 1})(
                        <Radio.Group>
                          <Radio value={1}>Minor</Radio>
                          <Radio value={2}>Major</Radio>
                        </Radio.Group>
                      )}
                      </Form.Item>
                      {/* <div style={{width: '2px', margin: '6px', padding: '2rem 0', background: 'rgb(232, 232, 232)'}}></div> */}
                      <Form.Item label='Status' style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                      {getFieldDecorator('status', {initialValue: 1})(
                        <Radio.Group>
                          <Radio value={1}>Backlog</Radio>
                          <Radio value={2}>Active</Radio>
                        </Radio.Group>
                      )}
                      </Form.Item>
                  </div>

                  <Divider/>
                  <Form.Item wrapperCol={{ span: 12, offset: 6 }} style={{alignItems: 'flex-end'}}>
                    <Button type='primary' htmlType='submit'>Submit</Button>
                  </Form.Item>
                </div>
                
                <Form.Item label='Files' style={{flex: 3, padding: '1rem'}}>
                  <div className='dropbox' style={{width:'100%'}}>
                    {getFieldDecorator('dragger', {
                      valuePropName: 'fileList',
                      getValueFromEvent: this.normFile,
                    })(
                      <Upload.Dragger name='files' action='/upload.do' accept='image/*,.xml,.json,.txt,.doc,.docx,.js,.html'>
                        <p className='ant-upload-drag-icon'>
                          <Icon type='inbox' />
                        </p>
                        <p className='ant-upload-text'>Click or drag images/text files to this area to upload</p>
                        <p className='ant-upload-hint'>Upload size limit set to 10MB.</p>
                      </Upload.Dragger>,
                    )}
                  </div>
                </Form.Item>
              </Form>
          </div>
      );
    }
}

export const WrappedCreateIssueForm = Form.create({ name: 'validate_other' })(CreateIssue);