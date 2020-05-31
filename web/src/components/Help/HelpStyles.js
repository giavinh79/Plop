import styled from 'styled-components';

export const SectionNavHeader = styled.h3`
  margin: 0 0 1.5rem 0;
  color: rgb(60, 53, 53);
  font-weight: 500;
`;

export const Table = styled.nav`
  padding: 0.5rem 1rem;
  margin: 0 1rem 0 1rem;
  min-width: 15rem;
  border-radius: 10px;
  text-align: center;
  background-color: #fafbfc;
  box-shadow: 0 1px 8px rgba(27, 31, 35, 0.15), 0 0 1px rgba(106, 115, 125, 0.35);
`;

export const TableHeader = styled.h2`
  margin: 1rem 0 1.5rem 0rem;
  font-weight: 700;
  color: #2c343e;
`;

export const NavText = styled.p`
  font-weight: ${(props) => (props.bold ? 'bold' : 'initial')};
  color: #6f6f6f;
  cursor: pointer;

  &:hover {
    -webkit-transform: scale(1.05);
    -ms-transform: scale(1.05);
    transform: scale(1.05);
  }
`;

export const Subheader = styled.p`
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 0.8rem;
`;
