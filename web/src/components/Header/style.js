// for more complex styling with selectors, responsive media queries, or seperating JS and styling code
import styled from 'styled-components';

export const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  font-family: 'Montserrat';
  height: 9%;
  min-height: 4rem;
  background-color: ${(props) => (props.lightmode ? '#79B7D4' : '#2d3848')};

  @media screen and (max-width: 1090px) {
    padding: ${(props) => (props.homepage ? '2rem !important' : '')};
  }

  @media screen and (max-width: 870px) {
    background-color: ${(props) => (props.homepage ? '#303f44 !important' : '')};
    height: ${(props) => (props.homepage ? 'auto' : '')};
    flex-direction: ${(props) => (props.homepage ? 'column-reverse' : '')};
  }
`;

export const Logo = styled.img`
  cursor: pointer;
  height: 2.8rem;

  @media screen and (max-width: 870px) {
    height: ${(props) => (props.homepage ? '4rem' : '')};
    margin-top: ${(props) => (props.homepage ? '3rem' : '')};
    padding: ${(props) => (props.homepage ? '0 1rem 0 0 !important' : '')};
  }
`;

export const UserPanelWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1rem;
  padding: 0.5rem;
  cursor: pointer;
  :hover {
    background-color: rgb(135, 183, 212);
  }
`;
