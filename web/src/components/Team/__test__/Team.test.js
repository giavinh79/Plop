import React from 'react';
import { Team } from '../../../pages';
import { ThemeProvider } from '../../../Theme';
import * as rest from '../../../utility/restCalls';

// import react-testing methods
import { render, fireEvent, waitForElement } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { toBeInTheDocument } from '@testing-library/jest-dom';

rest.createTeam = jest.fn();
rest.joinTeam = jest.fn();
rest.retrieveTeams = jest.fn().mockReturnValue({
  data: [
    {
      name: 'Testing Room',
      description:
        'This room was created automatically using a database seed. Manual and automated testing will be done using this room.',
      currentMembers: 1,
      id: 'e4bbd4bbeb17e7745f254ee9adc6fac4Qz2+jzxya7YR0wNSHQjp8Q==',
    },
  ],
});

let getByLabelText, getByText, queryByText;

describe('Team page test suite', () => {
  beforeEach(async () => {
    await act(async () => {
      let testFunctions = render(
        <ThemeProvider>
          <Team />
        </ThemeProvider>
      );
      getByText = testFunctions.getByText;
      queryByText = testFunctions.queryByText;
      getByLabelText = testFunctions.getByLabelText;
    });
  });

  it('sends API call to retrieve teams after mounting', () => {
    expect(rest.retrieveTeams).toHaveBeenCalledTimes(1);
  });

  /** Team Creation Modal  */
  it('loads team creation modal when create text is clicked', () => {
    fireEvent.click(getByText('Create'));
    expect(getByText('Create a team')).toBeInTheDocument();
  });

  it('removes team creation modal when return button is clicked', () => {
    fireEvent.click(getByText('Create'));
    fireEvent.click(getByText('Return'));
    expect(queryByText('Create a team')).toBeNull();
  });

  it('errors if saving team with empty values', () => {
    fireEvent.click(getByText('Create'));
    fireEvent.click(getByText('Save'));
    expect(getByText('All fields must be filled in.')).toBeInTheDocument();
  });

  it('sends API call to create team if input conditions are met', async () => {
    fireEvent.click(getByText('Create'));
    const inputName = getByLabelText('team-name-input');
    fireEvent.change(inputName, { target: { value: 'New Team' } });
    const inputDescription = getByLabelText('team-description-input');
    fireEvent.change(inputDescription, { target: { value: 'This team was made for testing.' } });
    const inputPassword = getByLabelText('team-password-input');
    fireEvent.change(inputPassword, { target: { value: 'password' } });

    await act(async () => {
      fireEvent.click(getByText('Save'));
    });

    expect(rest.createTeam).toHaveBeenCalledTimes(1);
  });

  /** Joining a team */
  it('errors if joining team with empty values', () => {
    fireEvent.click(getByText('Join'));
    expect(getByText('All fields must be filled in.')).toBeInTheDocument();
  });

  it('sends API call to join team if input conditions are met', () => {
    // const inputName = getByLabelText('team-name-input');
    // fireEvent.change(inputName, { target: { value: 'New Team' } });
    // const inputDescription = getByLabelText('team-description-input');
    // fireEvent.change(inputDescription, { target: { value: 'This team was made for testing.' } });
    // const inputPassword = getByLabelText('team-password-input');
    // fireEvent.change(inputPassword, { target: { value: 'password' } });
    // await act(async () => {
    //   fireEvent.click(getByText('Save'));
    // });
    // expect(rest.createTeam).toHaveBeenCalledTimes(1);
  });
});
