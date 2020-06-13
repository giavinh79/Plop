import React, { useEffect, useState, useRef } from 'react';
import { AutoComplete, Button, DatePicker, Divider, Icon, Input, Form, Modal, Radio, Select, Upload } from 'antd';
import { displaySimpleNotification } from '../../utility/services.js';
import { retrieveAssignees, createIssue } from '../../utility/restCalls.js';
import { tagSuggestions, formItemLayout } from '../../constants/index.js';
import { disabledDate, toBase64, normFile } from '../../utility/issueServices';
import './CreateIssueModal.css';

function CreateIssueModal({ form, setIssueModal, newRequest, setNewRequest, resetSearch }) {
  const [visible, setVisible] = useState(true);
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [assignees, setAssignees] = useState([]);
  const [loadingSave, setLoadingSave] = useState(false);
  const titleRef = useRef();
  const { getFieldDecorator } = form;
  const createInput = useRef();

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

  const handleSubmit = () => {
    // e.preventDefault();

    form.validateFields((err, values) => {
      setLoadingSave(true);

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
            const res = await createIssue(values);
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
      <Form {...formItemLayout} className='issue-modal'>
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

        <Form.Item label='Assignee' labelCol={{ span: 24 }} style={{ position: 'relative', zIndex: 5 }}>
          {getFieldDecorator('assignee', {
            initialValue: '',
          })(
            <AutoComplete
              dataSource={assignees}
              filterOption={(inputValue, option) =>
                option.props.children.toUpperCase().substring(0, inputValue.length).includes(inputValue.toUpperCase())
              }
              getPopupContainer={(trigger) => trigger.parentNode}
            >
              <Input.Search placeholder='Search by email' autoComplete='none' />
            </AutoComplete>
          )}
        </Form.Item>

        <Form.Item label='Tags' labelCol={{ span: 24 }} style={{ position: 'relative', zIndex: 4 }}>
          {getFieldDecorator('tag', {
            initialValue: [],
          })(
            <Select
              mode='tags'
              maxTagTextLength={10}
              maxTagCount={1}
              tokenSeparators={[',']}
              placeholder='Issue Tags'
              getPopupContainer={(trigger) => trigger.parentNode}
              style={{ position: 'relative' }}
              placement='bottomLeft'
            >
              {tagSuggestions}
            </Select>
          )}
        </Form.Item>

        <Form.Item label='Deadline' labelCol={{ span: 24 }} style={{ zIndex: 3 }}>
          {getFieldDecorator('deadline', {
            initialValue: null,
          })(
            <DatePicker
              disabledDate={disabledDate}
              style={{ position: 'relative', width: '100%' }}
              getCalendarContainer={() => document.getElementById('validate_other_deadline')}
            />
          )}
        </Form.Item>
        <Form.Item label='Status' labelCol={{ span: 24 }} style={{ zIndex: 2 }}>
          {getFieldDecorator('status', {
            initialValue: 1,
          })(
            <Select getPopupContainer={(trigger) => trigger.parentNode} style={{ zIndex: 5 }}>
              <Select.Option value={0}>Backlog</Select.Option>
              <Select.Option value={1}>Active</Select.Option>
              <Select.Option value={2}>In Progress</Select.Option>
              <Select.Option value={3}>Complete</Select.Option>
            </Select>
          )}
        </Form.Item>

        <Form.Item className='priority' labelCol={{ offset: 0 }} style={{ zIndex: 1 }}>
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

        <Form.Item style={{ zIndex: 1 }}>
          <div style={{ width: '100%' }}>
            {getFieldDecorator('dragger', {
              valuePropName: 'fileList',
              getValueFromEvent: normFile,
              initialValue: [],
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
                <p className='ant-upload-hint'>Upload Limits: 5 Images</p>
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
