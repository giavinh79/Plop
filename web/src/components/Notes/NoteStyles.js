import styled from 'styled-components';
import { Row, Avatar } from 'antd';

export const ModalTextTitle = styled.span`
  font-weight: 500;
`;

export const ModalText = styled.span`
  color: #797979;
`;

export const CirclePickerContainer = styled(Row)`
  justify-content: center;
  text-align: center;
  padding: 1rem 0;
  margin: 1rem;
  flex: 1;
  flex-direction: column !important;
  background-color: #cfcfcf;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
`;

export const NoteAvatar = styled(Avatar)`
  cursor: pointer;
  border: ${({ highlighted }) => (highlighted ? '2px solid rgba(81, 203, 238, 1)' : 'none')};
  box-shadow: ${({ highlighted }) => (highlighted ? '0 0 5px rgba(81, 203, 238, 1)' : 'none')};
  color: #676767 !important;
  background-color: #efefef !important;
`;
