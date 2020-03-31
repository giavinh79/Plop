import styled from 'styled-components';
import { Dropdown } from 'antd';

export const ChatIconWrapper = styled(Dropdown)`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  position: fixed !important;
  bottom: 0;
  right: 1.5rem;
  padding: 0.7rem 1.2rem !important;
  border: 1px solid #ccc;
  border-bottom: none;
  background-color: white;
`;
