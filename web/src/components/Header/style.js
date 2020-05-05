// for more complex styling with selectors, responsive media queries, or seperating JS and styling code
import styled from 'styled-components';

export const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  font-family: 'Montserrat';
  height: 9%;
  min-height: 4rem;

  @media screen and (max-width: 1090px) {
    padding: 2rem !important;
  }

  @media screen and (max-width: 870px) {
    background-color: #303f44 !important;
    height: auto;
    flex-direction: column-reverse;
  }

  background-color: ${(props) => (props.lightmode ? '#79B7D4' : '#2d3848')};
`;

export const Logo = styled.img`
  cursor: pointer;
  height: 2.8rem;

  @media screen and (max-width: 870px) {
    height: 4rem;
    margin-top: 3rem;
    padding: 0 1rem 0 0 !important;
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
