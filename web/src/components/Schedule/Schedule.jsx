import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { layout, subheader } from '../../globalStyles';
import { Calendar } from 'antd';
import 'antd/dist/antd.css';
import axios from 'axios';
import { API_ENDPOINT } from '../../constants';

export default function Schedule() {
  useEffect(() => {
    (async () => {
      let { data } = await axios.get(`${API_ENDPOINT}/issue/team/1`);
      console.log(data);
    })().catch((err) => {
      console.log(err);
    });
  });

  const getListData = (value) => {
    let listData;
    switch (value.date()) {
      case 5:
        listData = [
          { type: 'warning', id: 1 },
          { type: 'success', id: 2 },
          { type: 'success', id: 3 },
          { type: 'success', id: 4 },
        ];
        break;
      default:
    }
    return listData || [];
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <div
        className='events'
        style={{ overflow: 'auto', display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}
      >
        {listData.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#e05252',
              padding: '0 1rem',
              margin: '0 0.5rem 0.5rem 0',
              border: '1px solid #e8e8e8',
              borderRadius: '10px',
            }}
          >
            {/* <Badge
              status="error"
              text={
                <a href="google.ca" target="_blank">
                  Issue 10
                </a>
              }
            /> */}
            {/* <p
              style={{ cursor: 'pointer', margin: 0 }}
              // onClick={() => history.push(`/dashboard/issue/${item.id}`)}
            > */}
            <Link to={`/dashboard/issue/${item.id}`} style={{ color: 'white' }} target='_blank'>
              Issue {item.id}
            </Link>
            {/* </p> */}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={layout}>
      <p style={subheader}>Project Schedule</p>
      <Calendar
        dateCellRender={dateCellRender}
        // monthCellRender={monthCellRender}
      />
    </div>
  );
}
