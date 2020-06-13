import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Input, Modal } from 'antd';
import { displayInfoDialog, displaySimpleNotification } from '../../utility/services';
import { createTeam, retrieveTeams } from '../../utility/restCalls';

const { TextArea } = Input;

export default function TeamCreationModal({ setTeams, setTeamCreation, teams }) {
  const [teamCreateError, setTeamCreateError] = useState(false);
  const createInput = useRef();
  const createTeamData = useRef({});

  useEffect(() => {
    setTimeout(() => {
      if (createInput.current) {
        createInput.current.focus();
      }
    }, 600);
  }, []);

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
      const res = await createTeam(data);
      const currentTeams = await retrieveTeams();
      setTeams([
        ...teams,
        { name: res.data.name, description: res.data.description, id: res.data.id, currentMembers: '1' },
      ]);
      localStorage.setItem('teams', JSON.stringify(currentTeams.data));
      // console.log(localStorage.getItem('teams'));

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
        aria-label='team-name-input'
        onChange={(e) => {
          createTeamData.current.name = e.currentTarget.value;
        }}
        ref={createInput}
      />
      <p>Team description:</p>
      <TextArea
        autosize={{ minRows: 2, maxRows: 6 }}
        style={{ marginBottom: '1rem' }}
        name='teamDescription'
        id='teamDescription'
        maxLength={220}
        aria-label='team-description-input'
        onChange={(e) => {
          createTeamData.current.description = e.currentTarget.value;
        }}
      />
      <p>Team password:</p>
      <Input.Password
        name='teamPassword'
        id='teamPassword'
        autoComplete='new-password'
        allowClear={true}
        aria-label='team-password-input'
        onChange={(e) => {
          createTeamData.current.password = e.currentTarget.value;
        }}
      />
      {teamCreateError && (
        <Alert message='All fields must be filled in.' type='error' showIcon style={{ marginTop: '1rem' }} />
      )}
    </Modal>
  );
}
