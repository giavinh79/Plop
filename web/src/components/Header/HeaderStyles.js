import styled from 'styled-components';

export const LogoText = styled.h1`
  color: white;
  margin: 0;
`;

export const TeamWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: white;
  width: 20rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const MobileLogoText = styled.h1`
  margin: 0;
  margin-top: 3rem;
  color: white;
  font-size: 2.5rem;
  font-family: 'Montserrat';
  font-weight: bold;

  @media only screen and (min-width: 870px) {
    display: none;
  }
`;
