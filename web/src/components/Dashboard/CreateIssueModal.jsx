import React, { useEffect, useState, useRef } from 'react';
import { AutoComplete, Button, DatePicker, Divider, Icon, Input, Form, Modal, Radio, Select, Upload } from 'antd';
import { displaySimpleNotification } from '../../utility/services.js';
import { retrieveAssignees } from '../../utility/restCalls.js';
import { tagSuggestions, API_ENDPOINT } from '../../constants/index.js';
import './CreateIssueModal.css';
import { Redirect, useHistory } from 'react-router-dom';
import axios from 'axios';

function CreateIssueModal({ form, setIssueModal, newRequest, setNewRequest, resetSearch }) {
  const [visible, setVisible] = useState(true);
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [defaultFileList, setDefaultFileList] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [loadingSave, setLoadingSave] = useState(false);
  const titleRef = useRef();
  const { getFieldDecorator } = form;
  const createInput = useRef();
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  useEffect(() => {
    setTimeout(() => {
      if (createInput.current) {
        createInput.current.focus();
      }
    }, 600);

    (async () => {
      const { data } = await retrieveAssignees();
      setAssignees(data);
    })().catch((err) => {
      console.log(err);
    });
  }, []);

  const handleCancel = () => {
    setVisible(false);
    setTimeout(() => {
      setIssueModal(false);
    }, 200);
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

  const disabledDate = (current) => {
    return current && current.valueOf() < Date.now() - 60 * 60 * 24 * 1000 * 2;
  };

  const handleSubmit = () => {
    // e.preventDefault();

    form.validateFields((err, values) => {
      setLoadingSave(true);

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
            const res = await axios.put(`${API_ENDPOINT}/issue`, values);
            resetSearch();
            setNewRequest(!newRequest);
            displaySimpleNotification(
              'Success',
              2,
              'bottomRight',
              `Issue was sent to ${res.data.status}.`,
              'smile',
              '#108ee9'
            );
            resetForm();
            setLoadingSave(false);
          } catch (err) {
            displaySimpleNotification('Error', 2, 'bottomRight', `Issue could not be created.`, 'warning', 'red');
          }
        } else {
          console.log(err);
        }
      })(values, form.resetFields);
    });
  };

  return (
    <Modal
      title='Create Issue'
      visible={visible}
      onCancel={handleCancel}
      maskClosable={true}
      footer={[
        <Button
          key='submit'
          type='primary'
          onClick={handleSubmit}
          loading={loadingSave}
          disabled={title.length === 0 || shortDescription.length === 0}
        >
          Submit
        </Button>,
      ]}
      bodyStyle={{
        maxHeight: '33rem',
        overflow: 'auto',
      }}
    >
      <Form
        {...formItemLayout}
        className='issue-modal'
        //   onSubmit={handleSubmit}
        // style={{ display: 'flex', flexWrap: 'wrap' }}
      >
        <Form.Item label='Title' labelCol={{ span: 24 }}>
          {getFieldDecorator('title', {
            rules: [
              {
                required: true,
                message: 'Please input the task title',
              },
            ],
            initialValue: '',
          })(<Input maxLength={100} ref={titleRef} onChange={(e) => setTitle(e.target.value)} />)}
        </Form.Item>

        <Form.Item label='Short Description' labelCol={{ span: 24 }}>
          {getFieldDecorator('shortDescription', {
            rules: [
              {
                required: true,
                message: 'Please input a short description',
              },
            ],
            initialValue: '',
          })(<Input maxLength={200} onChange={(e) => setShortDescription(e.target.value)} />)}
        </Form.Item>

        <Form.Item label='Description' labelCol={{ span: 24 }}>
          {getFieldDecorator('description', {
            initialValue: '',
          })(<Input.TextArea autosize={{ minRows: '2', maxRows: '15' }} maxLength={1000} />)}
        </Form.Item>

        <Form.Item label='Assignee' labelCol={{ span: 24 }}>
          {getFieldDecorator('assignee', {
            initialValue: '',
          })(
            <AutoComplete
              dataSource={assignees}
              filterOption={(inputValue, option) =>
                option.props.children.toUpperCase().substring(0, inputValue.length).includes(inputValue.toUpperCase())
              }
            >
              <Input.Search placeholder='Search by email' onSearch={(value) => console.log(value)} autoComplete='off' />
            </AutoComplete>
          )}
        </Form.Item>

        <Form.Item label='Tags' labelCol={{ span: 24 }}>
          {getFieldDecorator('tag', {
            initialValue: [],
          })(
            <Select mode='tags' maxTagTextLength={10} maxTagCount={1} tokenSeparators={[',']} placeholder='Issue Tags'>
              {tagSuggestions}
            </Select>
          )}
        </Form.Item>

        <Form.Item label='Deadline' labelCol={{ span: 24 }}>
          {getFieldDecorator('deadline', {
            initialValue: null,
          })(<DatePicker disabledDate={disabledDate} style={{ width: '100%' }} />)}
        </Form.Item>
        <Form.Item label='Status' labelCol={{ span: 24 }}>
          {getFieldDecorator('status', {
            initialValue: 1,
          })(
            <Select>
              <Select.Option value={0}>Backlog</Select.Option>
              <Select.Option value={1}>Active</Select.Option>
              <Select.Option value={2}>In Progress</Select.Option>
              <Select.Option value={3}>Complete</Select.Option>
            </Select>
          )}
        </Form.Item>

        <Form.Item className='priority' labelCol={{ offset: 0 }}>
          {getFieldDecorator('priority', {
            initialValue: 0,
          })(
            <Radio.Group>
              <Radio value={0}>Minor Priority</Radio>
              <Radio value={1}>Major Priority</Radio>
            </Radio.Group>
          )}
        </Form.Item>

        <Divider />

        <Form.Item>
          <div style={{ width: '100%' }}>
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
    </Modal>
  );
}

const IssueFormModal = Form.create({ name: 'validate_other' })(CreateIssueModal);
export default IssueFormModal;
