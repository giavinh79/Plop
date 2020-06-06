import styled from 'styled-components';
import { Card } from 'antd';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
  background-color: ${({ theme }) => theme.team.container.backgroundColor};
  background-position: 0 0;
`;

export const Subcontainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 1rem;
`;

export const TeamCard = styled(Card)`
  flex: 1;
  min-width: 20rem;
  color: ${({ theme }) => theme.team.card.color} !important;
  background-color: ${({ theme }) => theme.team.card.backgroundColor} !important;
  border: ${({ theme }) => theme.team.card.border} !important;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  margin: ${(props) => (props.nomargin ? 0 : '1rem !important')};
`;

export const JoinedTeamCard = styled(TeamCard)`
  background-color: ${({ theme }) => theme.team.joinedTeamCard.backgroundColor} !important;
  box-shadow: ${({ theme }) => theme.team.joinedTeamCard.boxShadow};
  height: 100%;
  min-height: 20rem;
`;
