import React, { useEffect, useState, useRef } from 'react';
import { Button, Input, Modal, Row } from 'antd';
import { CirclePicker, TwitterPicker, HuePicker } from 'react-color';
import { CirclePickerContainer } from './NoteStyles';
import './react-color.css';
import { NOTE_BACKGROUND_COLORS, NOTE_TITLE_COLORS, NOTE_CONTENT_COLORS } from '../../constants';

const { TextArea } = Input;

// Add icons to choose from
// Support retrospectives as well: smile, frown, lightbulb, alert, exclamation, folder, cloud, fire (lets go for 8/10)
export default function NoteModal({ data, handleCreate, setDisplayModal }) {
  const [visible, setVisible] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [titleColor, setTitleColor] = useState('rgba(0,0,0,.85)');
  const [contentColor, setContentColor] = useState('rgba(0,0,0,.60)');
  const [backgroundColor, setBackgroundColor] = useState('white');

  const createInput = useRef();

  useEffect(() => {
    setTimeout(() => {
      if (createInput.current) {
        createInput.current.focus();
      }
    }, 600);
  }, []);

  const handleCancel = () => {
    setVisible(false);
    setTimeout(() => {
      setDisplayModal(false);
    }, 200);
  };

  const handleBgColorChange = (color) => {
    console.log(color);
    setBackgroundColor(color.hex);
  };

  const handleTitleColorChange = (color) => {
    const {
      rgb: { r, g, b, a },
    } = color;
    setTitleColor(`rgb(${r}, ${g}, ${b}, ${a})`);
  };

  const handleContentColorChange = (color) => {
    const {
      rgb: { r, g, b, a },
    } = color;
    setContentColor(`rgb(${r}, ${g}, ${b}, ${a})`);
  };

  const handleSave = async () => {
    let index = data.length + 1;
    handleCreate({ uuid: index.toString(), title, description, titleColor, contentColor, backgroundColor });
    handleCancel();
  };

  return (
    <Modal
      title='Create Note'
      visible={visible}
      onCancel={handleCancel}
      maskClosable={true}
      footer={[
        <Button key='submit' type='primary' onClick={handleSave} disabled={title.length === 0} loading={false}>
          Save
        </Button>,
      ]}
    >
      <p style={{ fontWeight: 500 }}>Note Title</p>
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
      <p style={{ fontWeight: 500 }}>Note Description</p>
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
      <p style={{ fontWeight: 500 }}>Background Color</p>
      <TwitterPicker
        width='100%'
        triangle='hide'
        color={backgroundColor}
        colors={NOTE_BACKGROUND_COLORS}
        onChange={handleBgColorChange}
        onChangeComplete={handleBgColorChange}
      />
      <div style={{ padding: '1rem 0' }}>
        <HuePicker width='100%' color={backgroundColor} onChange={handleBgColorChange} />
      </div>
      <Row type='flex'>
        <CirclePickerContainer type='flex'>
          <p style={{ fontWeight: 500, color: titleColor }}>Title Text Color</p>
          <CirclePicker colors={NOTE_TITLE_COLORS} width='initial' onChange={handleTitleColorChange} />
        </CirclePickerContainer>
        <CirclePickerContainer type='flex'>
          <p style={{ fontWeight: 500, color: contentColor }}>Content Text Color</p>
          <CirclePicker colors={NOTE_CONTENT_COLORS} width='initial' onChange={handleContentColorChange} />
        </CirclePickerContainer>
      </Row>
    </Modal>
  );
}
