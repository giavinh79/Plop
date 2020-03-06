import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Alert, Button, Input, Modal } from 'antd';
import { displayInfoDialog, displaySimpleNotification } from '../../utility/services';
import { API_ENDPOINT } from '../../utility/constants';

const { TextArea } = Input;

export default function TeamCreationModal({ setTeams, setTeamCreation, teams }) {
  const [teamCreateError, setTeamCreateError] = useState(false);
  const createTeamData = useRef({});

  const handleCancel = () => {
    setTeamCreation(false);
    setTeamCreateError(false);
    createTeamData.current = {};
  };

  const handleCreate = async () => {
    const data = {
      roomName: createTeamData.current.name,
      roomDescription: createTeamData.current.description,
      roomPassword: createTeamData.current.password,
    };

    if (!data.roomName || !data.roomDescription || !data.roomPassword) {
      setTeamCreateError(true);
      return;
    }

    if (teamCreateError) {
      setTeamCreateError(false);
    }

    try {
      const res = await axios.put(`${API_ENDPOINT}/room`, data);
      setTeams([
        ...teams,
        { name: res.data.name, description: res.data.description, id: res.data.id, currentMembers: '1' },
      ]);
      displayInfoDialog(
        'Team was successfully created!',
        'Your team ID is:',
        res.data.id,
        "These credentials were emailed to you as a backup and can also be found in your team settings. You may now enter the team's room."
      );
    } catch (err) {
      displaySimpleNotification(
        'Team was not created',
        5,
        'bottomRight',
        'This may be due to you being at your team limit (3) or exceeding input values (description < 300 characters and title < 100 characters).',
        'warning',
        'red'
      );
    } finally {
      setTeamCreation(false);
      createTeamData.current = {};
    }
  };

  return (
    <Modal
      title='Create a team'
      visible={true}
      onCancel={handleCancel}
      footer={[
        <Button key='back' onClick={handleCancel}>
          Return
        </Button>,
        <Button key='submit' type='primary' onClick={handleCreate}>
          Save
        </Button>,
      ]}
    >
      <p>Team name:</p>
      <Input
        style={{ marginBottom: '1rem' }}
        name='teamName'
        id='teamName'
        allowClear={true}
        maxLength={100}
        required
        onChange={e => {
          createTeamData.current.name = e.currentTarget.value;
        }}
      />
      <p>Team description:</p>
      <TextArea
        autosize={{ minRows: 2, maxRows: 6 }}
        style={{ marginBottom: '1rem' }}
        name='teamDescription'
        id='teamDescription'
        maxLength={250}
        required
        onChange={e => {
          createTeamData.current.description = e.currentTarget.value;
        }}
      />
      <p>Team password:</p>
      <Input.Password
        name='teamPassword'
        id='teamPassword'
        autoComplete='new-password'
        allowClear={true}
        required
        onChange={e => {
          createTeamData.current.password = e.currentTarget.value;
        }}
      />
      {teamCreateError && (
        <Alert message='All fields must be filled in.' type='error' showIcon style={{ marginTop: '1rem' }} />
      )}
    </Modal>
  );
}
