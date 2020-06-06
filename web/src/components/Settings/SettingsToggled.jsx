import React from 'react';
import { Icon, Tooltip, Switch, Spin } from 'antd';
import { TextSecondary, ToggleContainer, ToggleWrapper } from './SettingStyles';

export default function SettingsToggled({ adminApproval, loading, privateTeam }) {
  return loading ? (
    <ToggleContainer style={{ display: 'flex', height: '11.5rem', alignItems: 'center', justifyContent: 'center' }}>
      <Spin />
    </ToggleContainer>
  ) : (
    <ToggleContainer>
      <ToggleWrapper>
        <Switch defaultChecked={privateTeam} disabled />
        <TextSecondary>
          Enable private team{' '}
          <span>
            <Tooltip title='Lock room and prevent new members'>
              <Icon type='question-circle-o' style={{ paddingRight: '0.3rem' }} />
            </Tooltip>
          </span>
        </TextSecondary>
      </ToggleWrapper>
      <ToggleWrapper>
        <Switch defaultChecked={true} disabled />
        <TextSecondary>
          Enable logs{' '}
          {/* <span>
            <Tooltip title='Preserve team history at cost of slightly slower request calls'>
              <Icon type='question-circle-o' style={{ paddingRight: '0.3rem' }} />
            </Tooltip>
          </span> */}
        </TextSecondary>
      </ToggleWrapper>
      <ToggleWrapper>
        <Switch defaultChecked={adminApproval} disabled />
        <TextSecondary>
          Enable member approval{' '}
          <span>
            <Tooltip title='New members will need to be approved by team owner in order to join'>
              <Icon type='question-circle-o' style={{ paddingRight: '0.3rem' }} />
            </Tooltip>
          </span>
        </TextSecondary>
      </ToggleWrapper>
    </ToggleContainer>
  );
}
