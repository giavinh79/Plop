import React, { useState } from 'react';
import { Modal, Row, Button } from 'antd';
import { CirclePicker, TwitterPicker, HuePicker } from 'react-color';
import { CirclePickerContainer } from './NoteStyles';
import { NOTE_BACKGROUND_COLORS, NOTE_TITLE_COLORS, NOTE_CONTENT_COLORS } from '../../constants';
import './react-color.css';

export default function ColorModal({ data, handleColorEdit, setColorModal }) {
  const [titleColor, setTitleColor] = useState(data.titleColor);
  const [contentColor, setContentColor] = useState(data.contentColor);
  const [backgroundColor, setBackgroundColor] = useState(data.backgroundColor);

  const [visible, setVisible] = useState(true);

  const handleCancel = () => {
    setVisible(false);
    handleColorEdit(data.id, {
      backgroundColor: data.backgroundColor,
      titleColor: data.titleColor,
      contentColor: data.contentColor,
    });
    setTimeout(() => {
      setColorModal(null);
    }, 200);
  };

  const handleBgColorChange = (color) => {
    setBackgroundColor(color.hex);
    handleColorEdit(data.id, { backgroundColor: color.hex });
  };

  const handleTitleColorChange = (color) => {
    const {
      rgb: { r, g, b, a },
    } = color;
    const rgbString = `rgb(${r}, ${g}, ${b}, ${a})`;

    setTitleColor(rgbString);
    handleColorEdit(data.id, { titleColor: rgbString });
  };

  const handleContentColorChange = (color) => {
    const {
      rgb: { r, g, b, a },
    } = color;
    const rgbString = `rgb(${r}, ${g}, ${b}, ${a})`;
    setContentColor(rgbString);
    handleColorEdit(data.id, { contentColor: rgbString });
  };

  const handleSave = () => {
    handleColorEdit(data.id, { backgroundColor, titleColor, contentColor }, true);
    setVisible(false);
    setTimeout(() => {
      setColorModal(null);
    }, 200);
  };

  return (
    <Modal
      visible={visible}
      onCancel={handleCancel}
      maskClosable={true}
      footer={[
        <Button
          key='submit'
          type='primary'
          disabled={
            titleColor === data.titleColor &&
            contentColor === data.contentColor &&
            backgroundColor === data.backgroundColor
          }
          onClick={handleSave}
        >
          Save
        </Button>,
      ]}
      style={{ backgroundColor: '#e8e8e8', padding: 0, position: 'absolute', width: '505px', top: 0, right: 0 }}
    >
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
