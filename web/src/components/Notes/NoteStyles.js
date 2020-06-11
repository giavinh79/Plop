import styled from 'styled-components';
import { Row } from 'antd';

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
