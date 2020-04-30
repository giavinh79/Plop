import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { AutoComplete, Popconfirm, Input, Form, Radio, Button, Divider, Select, Row, Spin, Upload, Icon } from 'antd';
import { displaySimpleNotification } from '../../utility/services.js';
import { layout, subheader } from '../../globalStyles';
import { API_ENDPOINT } from '../../constants';
import { retrieveAssignees, deleteIssue, getIssueById } from '../../utility/restCalls.js';
import CommentBody from '../Comment/CommentBody.jsx';
import ShareIssue from './ShareIssue.jsx';
import './style.css';

const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

// Divide this up into two components and make a HoC (maybe)
export default function CreateIssue({ form, location, isManualNavigation }) {
  const [defaultFileList, setDefaultFileList] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [data, setData] = useState(location.data || null);
  const [loading, setLoading] = useState((isManualNavigation && data == null) || false);
  const titleRef = useRef();
  const history = useHistory();
  const historyTrack = useRef(true); // track whether user manually navigated to this page to configure go back button

  const parseImages = (issue) => {
    if (issue && issue.image) {
      setDefaultFileList(
        issue.image.map((item, key) => {
          return {
            uid: item.id,
            key: key,
            name: item.id,
            status: 'done',
            url: item.url,
          };
        })
      );
      return;
    }
    if (data && data.image) {
      setDefaultFileList(
        data.image.map((item, key) => {
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
  };

  useEffect(() => {
    try {
      titleRef.current.focus();
    } catch (err) {
      console.log('ERROR: Unable to focus element');
    }

    (async function () {
      if (isManualNavigation && location.data == null) {
        let path = window.location.pathname;
        let issueId = path.substring(path.lastIndexOf('/') + 1, path.length);
        const {
          data: { issue },
        } = await getIssueById(issueId);
        historyTrack.current = false;
        setData(issue);
        parseImages(issue);
        setLoading(false);
      } else {
        parseImages();
      }
      const { data } = await retrieveAssignees();
      setAssignees(data);
    })().catch((err) => {
      console.log(err);
    });
  }, []);

  const handleDeletion = async (id) => {
    try {
      await deleteIssue(id);
      displaySimpleNotification('Success', 2, 'bottomRight', 'Issue was deleted', 'smile', '#108ee9');
      historyTrack.current ? history.goBack() : history.push('/dashboard');
    } catch (err) {
      displaySimpleNotification('Error', 2, 'bottomRight', 'Issue was not deleted', 'warning', 'red');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    form.validateFields((err, values) => {
      const toBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });

      (async function getEncodedImageValues(values, resetForm) {
        let base = [];
        if (values.dragger) {
          for (let item of values.dragger) {
            if (item.originFileObj) base.push(await toBase64(item.originFileObj));
            else base.push({ id: item.uid, url: item.url });
          }
          values.dragger = base; // replace image file objects with base64 version
        }

        if (!err) {
          try {
            if (data) {
              await axios.post(`${API_ENDPOINT}/issue`, { ...values, id: data.id });
              displaySimpleNotification(
                'Success',
                2,
                'bottomRight',
                `Issue was updated successfully.`,
                'smile',
                '#108ee9'
              );
            } else {
              const res = await axios.put(`${API_ENDPOINT}/issue`, values);
              displaySimpleNotification(
                'Success',
                2,
                'bottomRight',
                `Issue was sent to ${res.data.status}.`,
                'smile',
                '#108ee9'
              );
              resetForm();
            }
          } catch (err) {
            displaySimpleNotification(
              'Error',
              2,
              'bottomRight',
              `Issue could not be created/updated.`,
              'warning',
              'red'
            );
          }
        } else {
          console.log(err);
        }
      })(values, form.resetFields);
    });
  };

  const normFile = (e) => {
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

  return !loading ? (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={layout} className='createIssue'>
        <div style={{ display: 'flex' }}>
          <p style={subheader}>{data == null ? 'Create Issue' : data.title}</p>
          {data && (
            <>
              <p
                style={{ marginLeft: '1rem', fontSize: '1rem', cursor: 'pointer', color: '#595a5d' }}
                onClick={() => {
                  historyTrack.current ? history.goBack() : history.push('/dashboard');
                }}
              >
                Go back
              </p>
              <Icon
                type='rollback'
                style={{ margin: '0 0.5rem', fontSize: '1.5rem', cursor: 'pointer' }}
                onClick={() => {
                  historyTrack.current ? history.goBack() : history.push('/dashboard');
                }}
              />
              <ShareIssue assignees={assignees} />
            </>
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
                    message: 'Please input the task title',
                  },
                ],
                initialValue: data == null ? '' : data.title,
              })(<Input maxLength={100} ref={titleRef} />)}
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
              })(<Input maxLength={200} />)}
            </Form.Item>

            <Form.Item label='Description'>
              {getFieldDecorator('description', {
                initialValue: data == null ? '' : data.description,
              })(<TextArea autosize={{ minRows: '2', maxRows: '15' }} maxLength={1000} />)}
            </Form.Item>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <Form.Item label='Assignee' style={{ flexDirection: 'row', alignItems: 'center', marginRight: '1rem' }}>
                {getFieldDecorator('assignee', {
                  initialValue: data == null ? '' : data.assignee,
                })(
                  <AutoComplete
                    style={{ width: 200 }}
                    dataSource={assignees}
                    filterOption={(inputValue, option) =>
                      option.props.children
                        .toUpperCase()
                        .substring(0, inputValue.length)
                        .includes(inputValue.toUpperCase())
                    }
                  >
                    <Input.Search
                      placeholder='Search by email'
                      onSearch={(value) => console.log(value)}
                      style={{ width: 200 }}
                      autoComplete='off'
                    />
                  </AutoComplete>
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
                  initialValue: data == null ? 1 : data.status,
                })(
                  <Select>
                    <Select.Option value={0}>Backlog</Select.Option>
                    <Select.Option value={1}>Active</Select.Option>
                    <Select.Option value={2}>In Progress</Select.Option>
                    <Select.Option value={3}>Complete</Select.Option>
                  </Select>
                )}
              </Form.Item>
            </div>

            <Divider />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {data && (
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
                      style={{
                        backgroundColor: '#cc8181',
                        borderColor: '#cc8181',
                        marginRight: '1rem',
                      }}
                    >
                      Delete
                    </Button>
                  </Popconfirm>
                </Form.Item>
              )}
              <Form.Item wrapperCol={{ span: 12, offset: 6 }} style={{ alignItems: 'flex-end' }}>
                {data == null ? (
                  <Button type='primary' onClick={handleSubmit}>
                    Submit
                  </Button>
                ) : (
                  <Popconfirm
                    title='Are you sure you want to save this task?'
                    onConfirm={handleSubmit}
                    okText='Yes'
                    cancelText='No'
                  >
                    <Button type='primary'>Save</Button>
                  </Popconfirm>
                )}
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
      {data && <CommentBody id={data.id} />}
    </div>
  ) : (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      <Spin size='large' />
    </div>
  );
}

export const WrappedCreateIssueForm = Form.create({ name: 'validate_other' })(CreateIssue);
