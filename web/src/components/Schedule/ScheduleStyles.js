import styled from 'styled-components';

export const LinkWrapper = styled.div`
  background-color: #e05252;
  padding: 0 1rem;
  margin: 0 0.5rem 0.5rem 0;
  border: ${({ theme }) => theme.schedule.issueBorder};
  border-radius: 10px;
`;

export const OverdueIssue = styled.span`
  color: #bb6464;
  font-size: 1.1rem;
  margin: 0 1rem 0 auto;
`;
