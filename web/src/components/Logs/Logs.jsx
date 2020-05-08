import React, { useEffect, useState } from 'react';
import { layout, subheader } from '../../globalStyles';
import { Avatar, Input, List, Row, Skeleton } from 'antd';
import { getLogs } from '../../utility/restCalls';
import moment from 'moment';

// const dataExample = [
//   {
//     description: 'wahoo@gmail.com joined the team',
//     date: 'April 20, 2020',
//     time: '5:30 AM',
//   },
// ];

export default function Logs() {
  const [backup, setBackup] = useState();
  const [data, setData] = useState(['1']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { data: logs } = await getLogs();
      let formattedData = logs.reverse().map((log) => {
        return {
          description: log.description,
          date: moment(log.date).format('MMMM DD, YYYY'),
          time: moment(log.date).format('hh:mm A'),
        };
      });
      setData(formattedData);
      setBackup(formattedData);
      setLoading(false);
    })().catch((err) => console.log(err));
  }, []);

  const handleFilter = (e) => {
    let userInput = e.target.value.toLowerCase();
    setData(
      backup.filter((item) => {
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
      <Input.Search
        allowClear
        size='large'
        placeholder='Filter logs by date or description'
        onChange={(e) => handleFilter(e)}
        style={{
          height: '2.7rem',
          marginBottom: '1rem',
        }}
      />
      <List
        style={{ border: '1px solid #ccc' }}
        itemLayout='horizontal'
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9f5f5', padding: '1rem' }}>
            <Skeleton loading={loading} active avatar size='small' paragraph={{ rows: 1 }} avatar={{ size: 'small' }}>
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
            </Skeleton>
          </List.Item>
        )}
      />
    </div>
  );
}
