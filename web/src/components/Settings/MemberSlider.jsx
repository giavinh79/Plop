import React, { useState } from 'react';
import { Slider, InputNumber, Row, Col } from 'antd';
import 'antd/dist/antd.css';

export default function MemberSlider() {
  const [value, setValue] = useState(12);

  const onChange = value => {
    setValue(value);
  };

  return (
    <Row>
      <Col span={12}>
        <Slider min={4} max={12} onChange={onChange} value={value} disabled />
      </Col>
      <Col span={4}>
        <InputNumber min={4} max={12} style={{ marginLeft: 16 }} onChange={onChange} value={value} disabled />
      </Col>
    </Row>
  );
}
