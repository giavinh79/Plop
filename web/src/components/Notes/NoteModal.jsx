import React, { useEffect, useState, useRef } from 'react';
import { Button, Input, Modal } from 'antd';

const { TextArea } = Input;

export default function NoteModal({ loading, data, handleCreate, setDisplayModal }) {
  const [visible, setVisible] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const createInput = useRef();

  useEffect(() => {
    setTimeout(() => {
      if (createInput.current) {
        createInput.current.focus();
      }
    }, 600);
  }, []);

  useEffect(() => {
    // if
  }, [loading]);

  const handleCancel = () => {
    setVisible(false);
    setTimeout(() => {
      setDisplayModal(false);
    }, 200);
  };

  const handleSave = async () => {
    let index = data.length + 1;
    // setData((data) => [
    //   ...data,
    //   {
    //     uuid: index.toString(),
    //     title,
    //     description,
    //   },
    // ]);
    handleCreate({ uuid: index.toString(), title, description });
    // if loading === false
    handleCancel();
  };

  return (
    <Modal
      title='Create a note'
      visible={visible}
      onCancel={handleCancel}
      maskClosable={true}
      footer={[
        <Button
          key='submit'
          type='primary'
          onClick={handleSave}
          disabled={title.length === 0 || description.length === 0}
          loading={false}
        >
          Save
        </Button>,
      ]}
    >
      <p>Note title:</p>
      <Input
        style={{ marginBottom: '1rem' }}
        name='noteTitle'
        id='noteTitle'
        allowClear={true}
        maxLength={100}
        aria-label='note-title-input'
        onChange={(e) => {
          setTitle(e.currentTarget.value);
        }}
        ref={createInput}
      />
      <p>Note description:</p>
      <TextArea
        autosize={{ minRows: 4, maxRows: 12 }}
        style={{ marginBottom: '1rem' }}
        name='noteDescription'
        id='noteDescription'
        maxLength={800}
        aria-label='note-description-input'
        onChange={(e) => {
          setDescription(e.currentTarget.value);
        }}
      />
    </Modal>
  );
}
