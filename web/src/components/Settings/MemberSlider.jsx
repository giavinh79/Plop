import React, { useState } from 'react';
import { Slider, InputNumber, Row, Col } from 'antd';

export default function MemberSlider() {
  const [value, setValue] = useState(12);

  const onChange = (value) => {
    setValue(value);
  };

  return (
    <Row style={{ width: '100%' }}>
      <Col span={18}>
        <Slider min={4} max={12} onChange={onChange} value={value} disabled />
      </Col>
      <Col span={6}>
        <InputNumber
          min={4}
          max={12}
          style={{ marginLeft: 16, width: 'fit-content' }}
          onChange={onChange}
          value={value}
          disabled
        />
      </Col>
    </Row>
  );
}
