import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Popconfirm, Input, Form, Radio, Button, Divider, Select, Upload, Icon } from 'antd';
import { displaySimpleNotification } from '../../utility/services.js';
import { layout, subheader } from '../../globalStyles';
import './style.css';

const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

// Divide this up into two components and make a HOC (maybe)
export default function CreateIssue({ changePage, data, form }) {
  const [defaultFileList, setDefaultFileList] = useState([]);

  useEffect(() => {
    if (data && data.image) {
      setDefaultFileList(
        JSON.parse(data.image).map((item, key) => {
          return {
            uid: item.id,
            key: key,
            name: item.id,
            status: 'done',
            url: item.url,
          };
        })
      );
    }
  }, [data]);

  const handleDeletion = id => {
    try {
      axios.delete(`/issue/${id}`, { withCredentials: true });
      displaySimpleNotification('Success', 2, 'bottomRight', 'Issue was deleted', 'smile', '#108ee9');
      changePage(0);
    } catch (err) {
      displaySimpleNotification('Error', 2, 'bottomRight', 'Issue was not deleted', 'warning', 'red');
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    form.validateFields((err, values) => {
      const toBase64 = file =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });

      (async function getEncodedImageValues(values, resetForm) {
        let base = [];
        if (values.dragger) {
          for (let item of values.dragger) {
            base.push(await toBase64(item.originFileObj));
          }
          values.dragger = base; // replace image file objects with base64 version
        }

        if (!err) {
          axios
            .put('/issue', values)
            .then(res => {
              resetForm();
              displaySimpleNotification(
                'Success',
                2,
                'bottomRight',
                `Issue was sent to ${res.data.status}.`,
                'smile',
                '#108ee9'
              );
            })
            .catch(err => {
              displaySimpleNotification('Error', 2, 'bottomRight', `Issue could not be created.`, 'warning', 'red');
            });
        }
      })(values, form.resetFields);
    });
  };

  const normFile = e => {
    if (e.fileList.length >= 6) {
      while (e.fileList.length >= 6) e.fileList.pop();
      displaySimpleNotification('Error', 6, 'bottomRight', 'Image uploads are limited to five.', 'warning', 'red');
    }
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const tagSuggestions = [
    <Select.Option key='Backend'>Backend</Select.Option>,
    <Select.Option key='Bug'>Bug</Select.Option>,
    <Select.Option key='Database'>Database</Select.Option>,
    <Select.Option key='DevOps'>DevOps</Select.Option>,
    <Select.Option key='Documentation'>Documentation</Select.Option>,
    <Select.Option key='Frontend'>Frontend</Select.Option>,
    <Select.Option key='Research'>Research</Select.Option>,
    <Select.Option key='Security'>Security</Select.Option>,
    <Select.Option key='Testing'>Testing</Select.Option>,
  ];

  const { getFieldDecorator } = form;

  return (
    <div style={layout} className='createIssue'>
      <div style={{ display: 'flex' }}>
        <p style={subheader}>{data == null ? 'Create Issue' : data.title}</p>
        {!data ? null : (
          <Icon
            type='rollback'
            style={{ margin: '0 1rem', fontSize: '1.5rem', cursor: 'pointer' }}
            onClick={() => {
              changePage(0);
            }}
          />
        )}
        {/* <div style="justify-content: center;display: flex;border-radius: 50%;height: 2.5rem;width: 2.5rem;margin: 0 1rem;border: 1px solid #ccc;align-items: center;"> */}
      </div>
      <Form {...formItemLayout} onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: 4, padding: '1rem' }}>
          <Form.Item label='Title'>
            {getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  message: 'Please input your title!',
                },
              ],
              initialValue: data == null ? '' : data.title,
            })(<Input />)}
          </Form.Item>

          <Form.Item label='Short Description'>
            {getFieldDecorator('shortDescription', {
              rules: [
                {
                  required: true,
                  message: 'Please input a short description',
                },
              ],
              initialValue: data == null ? '' : data.shortDescription,
            })(<Input />)}
          </Form.Item>

          <Form.Item label='Description'>
            {getFieldDecorator('description', {
              initialValue: data == null ? '' : data.description,
            })(<TextArea autosize={{ minRows: '2', maxRows: '15' }} />)}
          </Form.Item>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <Form.Item label='Assignee' style={{ flexDirection: 'row', alignItems: 'center', marginRight: '1rem' }}>
              {getFieldDecorator('assignee', {
                initialValue: data == null ? '' : data.assignee,
              })(
                <Input.Search
                  placeholder='Search by email'
                  onSearch={value => console.log(value)}
                  style={{ width: 200 }}
                />
              )}
            </Form.Item>

            <Form.Item label='Tags' style={{ flexDirection: 'row', alignItems: 'center' }}>
              {getFieldDecorator('tag', {
                initialValue: data == null ? [] : data.tag,
              })(
                <Select
                  mode='tags'
                  maxTagTextLength={10}
                  maxTagCount={1}
                  tokenSeparators={[',']}
                  style={{ width: '100%' }}
                  placeholder='Issue Tags'
                  onChange={() => {
                    // console.log('hi')
                  }}
                >
                  {tagSuggestions}
                </Select>
              )}
            </Form.Item>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <Form.Item label='Priority' style={{ flexDirection: 'row' }}>
              {getFieldDecorator('priority', {
                initialValue: data == null ? 0 : +data.priority || 0,
              })(
                <Radio.Group>
                  <Radio value={0}>Minor</Radio>
                  <Radio value={1}>Major</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item
              label='Status'
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}
            >
              {getFieldDecorator('status', {
                initialValue: data == null ? 0 : data.status || 0,
              })(
                <Radio.Group>
                  <Radio value={0}>Backlog</Radio>
                  <Radio value={1}>Active</Radio>
                </Radio.Group>
              )}
            </Form.Item>
          </div>

          <Divider />

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Form.Item wrapperCol={{ span: 12, offset: 6 }} style={{ alignItems: 'flex-end' }}>
              <Popconfirm
                title='Are you sure you want to delete this task?'
                onConfirm={() => handleDeletion(data.id)}
                // onCancel={cancel}
                okText='Yes'
                cancelText='No'
              >
                <Button
                  type='primary'
                  htmlType='submit'
                  style={{
                    display: data == null ? 'none' : 'block',
                    backgroundColor: '#cc8181',
                    borderColor: '#cc8181',
                    marginRight: '1rem',
                  }}
                >
                  Delete
                </Button>
              </Popconfirm>
            </Form.Item>
            <Form.Item wrapperCol={{ span: 12, offset: 6 }} style={{ alignItems: 'flex-end' }}>
              <Button type='primary' htmlType='submit'>
                {data == null ? 'Submit' : 'Save'}
              </Button>
            </Form.Item>
          </div>
        </div>

        <Form.Item label='Files' style={{ flex: 3, padding: '1rem' }}>
          <div className='dropbox' style={{ width: '100%' }}>
            {getFieldDecorator('dragger', {
              valuePropName: 'fileList',
              getValueFromEvent: normFile,
              initialValue: defaultFileList,
            })(
              <Upload.Dragger
                listType='picture'
                accept='image/*'
                beforeUpload={() => {
                  return false;
                }}
              >
                <p className='ant-upload-drag-icon'>
                  <Icon type='inbox' />
                </p>
                <p className='ant-upload-text'>Click or drag images to this area to upload</p>
                <p className='ant-upload-hint'>Upload Limits: 5 Images or 5 MB.</p>
              </Upload.Dragger>
            )}
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

export const WrappedCreateIssueForm = Form.create({ name: 'validate_other' })(CreateIssue);
