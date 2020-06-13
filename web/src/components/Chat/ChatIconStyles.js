import styled from 'styled-components';
import { Dropdown } from 'antd';

export const ChatIconWrapper = styled(Dropdown)`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  position: fixed !important;
  bottom: 0;
  right: 1.5rem;
  padding: 0.7rem 1.2rem !important;
  background-color: white;

  box-shadow: ${({ theme }) => theme.chat.iconBoxShadow};

  border: 1px solid #ccc;
  border-bottom: none;

  /* border-top-left-radius: 10px !important;
    border-top-right-radius: 10px !important; */
`;
