import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import Text from 'antd/lib/typography/Text';

export default function NoteHelpModal({ setDisplayHelpModal }) {
  const [visible, setVisible] = useState(true);

  const handleCancel = () => {
    setVisible(false);
    setTimeout(() => {
      setDisplayHelpModal(false);
    }, 200);
  };

  return (
    <Modal
      title='Info'
      visible={visible}
      onCancel={handleCancel}
      onOk={handleCancel}
      footer={[
        <Button key='submit' type='primary'>
          Ok
        </Button>,
      ]}
    >
      <p>
        <span style={{ fontWeight: 500 }}>Purpose:</span>{' '}
        <span style={{ color: '#797979' }}>
          Notes are used by the team to store general information such as documentation, team guidelines, or
          links/passwords to different services.
        </span>
      </p>
      <p>
        <span style={{ fontWeight: 500 }}>Using:</span>{' '}
        <span style={{ color: '#797979' }}>
          Notes can be created by pressing the plus (+) button. These notes can then be stretched and moved around the
          layout. The two buttons at the bottom of each note allows you to edit or delete notes instantly. Keep in mind
          that any changes will automatically save!
        </span>
      </p>
      <div>
        <span style={{ fontWeight: 500 }}>Markdown:</span>{' '}
        <span style={{ color: '#797979' }}>
          For adding links, use the following markdown in the content body of a note: <Text code>[title](link)</Text>{' '}
          where 'title' is replaced by the text you want to display for the link (ie. Firebase) and 'link' is replaced
          by website url (ie. https://firebase.google.com/).
        </span>
      </div>
    </Modal>
  );
}
