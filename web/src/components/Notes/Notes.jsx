import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, Icon, Row } from 'antd';
import { layout, subheader } from '../../globalStyles';
import NoteModal from './NoteModal';
import 'antd/dist/antd.css';

const { Meta } = Card;

export default function Notes() {
  const [displayModal, setDisplayModal] = useState(false);

  return (
    <>
      {displayModal && <NoteModal />}
      <div style={layout}>
        <p style={subheader}>Notes (placeholder)</p>
        <Row type='flex' style={{ alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: '0 1rem 0 auto', fontFamily: 'Montserrat' }}>New Note</h3>
          <Button type='primary' shape='circle' icon='plus' size={'large'} onClick={() => setDisplayModal(true)} />
        </Row>

        <Card
          style={{ width: 300 }}
          cover={
            <img
              alt='example'
              src='https://images.ctfassets.net/2y9b3o528xhq/5YhXXuS0hIw6JV3nJr3GgP/682bf2a70a98c3e466f26c2c2a812d65/front-end-web-developer-nanodegree--nd001.jpg'
            />
          }
          actions={[<Icon type='edit' key='edit' />, <Icon type='delete' key='delete' />]}
        >
          <Meta
            avatar={<Avatar icon='bulb' style={{ backgroundColor: '#dab632', color: 'white' }} />}
            title='Frontend'
            description='Technologies: React.js, Gatsby.js'
          />
        </Card>
      </div>
    </>
  );
}
