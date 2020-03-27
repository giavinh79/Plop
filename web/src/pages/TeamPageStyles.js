import styled from 'styled-components';
import { Card } from 'antd';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
  background-color: ${props => (props.lightmode ? 'white' : '#1A2330')};
  background-position: 0 0;
`;

export const TeamCard = styled(Card)`
  color: ${props => (props.lightmode ? 'rgba(0,0,0,.65)' : 'rgba(255, 255, 255, 0.65)')} !important;
  background-color: ${props => (props.lightmode ? 'white' : '#24344C')} !important;
  border: ${props => (props.lightmode ? {} : 'none')} !important;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  margin: ${props => (props.nomargin ? 0 : '1rem !important')};
  flex: 1;
`;

export const JoinedTeamCard = styled(TeamCard)`
  background-color: ${props => (props.lightmode ? 'white' : '#00000040')} !important;
  box-shadow: ${props =>
    props.lightmode ? 'none' : '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'};
  height: 100%;
  min-height: 20rem;
`;
