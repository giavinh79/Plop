import styled from 'styled-components';

export const Layout = styled.div`
  width: 100%;
  padding: 2rem;

  background-color: ${({ theme }) => {
    if (theme.home) return theme.home.backgroundColor;
  }};
  border-left: ${({ theme }) => {
    if (theme.home) return theme.home.leftBorder;
  }};
`;

export const subheader = {
  fontSize: '2rem',
};

export const BodyWrapper = styled.div`
  display: flex;
  min-height: 91%;
`;

export const DashboardWrapper = styled.div`
  display: flex;
  width: 100%;
`;
