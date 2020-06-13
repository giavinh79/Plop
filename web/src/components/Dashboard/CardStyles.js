import styled from 'styled-components';

export const CardHeader = styled.div`
  display: flex;
  padding: 16px;
  justify-content: space-between;
  color: #f3f3f3;
  font-weight: bold;
  background-color: ${(props) => (props.overdue ? '#b15858' : '#5885b1')};
`;

export const CardBody = styled.div`
  display: flex;
  padding: 16px;
  min-height: 5rem;
  word-break: break-word;
  background-color: ${({ theme, overdue }) => (overdue ? theme.home.cardBgColorOverdue : theme.home.cardBgColor)};
  color: ${({ theme }) => theme.textColor};
`;
