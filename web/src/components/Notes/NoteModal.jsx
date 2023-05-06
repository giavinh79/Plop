import React, { useEffect, useState, useRef } from 'react';
import { Button, Input, Modal, Row } from 'antd';
import { CirclePicker, TwitterPicker, HuePicker } from 'react-color';

import { CirclePickerContainer } from './NoteStyles';
import { NOTE_BACKGROUND_COLORS, NOTE_TITLE_COLORS, NOTE_CONTENT_COLORS } from '../../constants';

import './react-color.css';

const { TextArea } = Input;

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
    let index = data.length > 0 ? parseInt(data[data.length - 1].uuid) + 1 : 0;
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
        autosize={{ minRows: 2, maxRows: 12 }}
        style={{ marginBottom: '1rem' }}
        name='noteDescription'
        id='noteDescription'
        maxLength={800}
        aria-label='note-description-input'
        onChange={(e) => {
          setDescription(e.currentTarget.value);
        }}
      />
      {/* <p style={{ fontWeight: 500 }}>Icon</p>
      <Row type='flex' style={{ marginBottom: '1rem', justifyContent: 'space-around' }}>
        <NoteAvatar icon='stop' highlighted={icon === 0} onClick={() => setIcon(0)} />
        <NoteAvatar icon='bulb' highlighted={icon === 1} onClick={() => setIcon(1)} />
        <NoteAvatar icon='folder' highlighted={icon === 2} onClick={() => setIcon(2)} />
        <NoteAvatar icon='exclamation' highlighted={icon === 3} onClick={() => setIcon(3)} />
        <NoteAvatar icon='folder' highlighted={icon === 4} onClick={() => setIcon(4)} />
        <NoteAvatar icon='cloud' highlighted={icon === 5} onClick={() => setIcon(5)} />
        <NoteAvatar icon='fire' highlighted={icon === 6} onClick={() => setIcon(6)} />
        <NoteAvatar icon='smile' highlighted={icon === 7} onClick={() => setIcon(7)} />
        <NoteAvatar icon='frown' highlighted={icon === 8} onClick={() => setIcon(8)} />
      </Row> */}
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
