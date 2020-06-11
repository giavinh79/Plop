import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import Text from 'antd/lib/typography/Text';
import { ModalText, ModalTextTitle } from './NoteStyles';

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
      footer={[
        <Button key='submit' type='primary' onClick={handleCancel}>
          Ok
        </Button>,
      ]}
    >
      <p>
        <ModalTextTitle>Purpose:</ModalTextTitle>{' '}
        <ModalText>
          Notes are used by the team to store general information such as documentation, team guidelines, or
          links/passwords to different services.
        </ModalText>
      </p>
      <p>
        <ModalTextTitle>Using:</ModalTextTitle>{' '}
        <ModalText>
          Notes can be created by pressing the plus (+) button. These notes can then be stretched and moved around the
          layout. The three buttons at the bottom of each note allows you to edit or delete notes instantly. Keep in
          mind that any changes will automatically save!
        </ModalText>
      </p>
      <p>
        <ModalTextTitle>Markdown:</ModalTextTitle>{' '}
        <ModalText>
          For adding links, use the following markdown in the content body of a note: <Text code>[title](link)</Text>{' '}
          where 'title' is replaced by the text you want to display for the link (ie. Firebase) and 'link' is replaced
          by the website url (ie. https://firebase.google.com/).
        </ModalText>
      </p>
      <>
        <ModalTextTitle>Permissions:</ModalTextTitle>{' '}
        <ModalText>You must have administration tier 3 or higher to edit/add notes.</ModalText>
      </>
    </Modal>
  );
}
