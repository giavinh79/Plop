import React, { useState } from 'react';
import { layout, subheader } from '../../globalStyles';
import { Avatar, Input, List, Row } from 'antd';

const { Search } = Input;

const dataExample = [
  {
    description: 'wahoo@gmail.com joined the team',
    date: 'April 20, 2020',
    time: '5:30 AM',
  },
  {
    description: "tester@gmail.com created the issue 'test'",
    date: 'February 8, 2019',
    time: '11:47 PM',
  },
];

export default function Logs() {
  const [data, setData] = useState(dataExample);
  //   const [searchInput, setSearchInput] = useState();

  const handleFilter = (e) => {
    let userInput = e.target.value.toLowerCase();
    setData(
      dataExample.filter((item) => {
        return (
          item.description.toLowerCase().includes(userInput) ||
          item.time.toLowerCase().includes(userInput) ||
          item.date.toLowerCase().includes(userInput)
        );
      })
    );
  };

  return (
    <div style={layout}>
      <p style={subheader}>Project Logs (incomplete)</p>
      <Search
        allowClear
        size='large'
        placeholder='Filter logs'
        onChange={(e) => handleFilter(e)}
        style={{
          height: '2.7rem',
          marginBottom: '1rem',
          //   boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }}
      />
      <List
        style={{ border: '1px solid #ccc' }}
        itemLayout='horizontal'
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9f5f5', padding: '1rem' }}>
            <List.Item.Meta
              avatar={<Avatar icon='pushpin' />}
              title={
                <Row type='flex'>
                  <div>{item.date}</div>
                  <div style={{ marginLeft: 'auto' }}>{item.time}</div>
                </Row>
              }
              description={item.description}
            />
          </List.Item>
        )}
      />
    </div>
  );
}
