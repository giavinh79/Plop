import styled from 'styled-components';

export const ChatBubble = styled.div`
  border-radius: 7px;
  padding: 0.3rem 0.7rem;
  border: 1px solid #ccc;
  width: fit-content;
`;

export const ChatUser = styled.p`
  color: #8c8c8c;
  margin-bottom: 0.4rem;
  max-width: 10rem;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  background-color: #79b7d4;
  padding: 0.5rem;
  margin-right: 0.5rem;
  border-radius: 50%;
`;

export const MembersOnlineWrapper = styled.span`
  padding: 0.2rem 0.8rem;
  background-color: white;
  color: green;
  border-radius: 8px;
`;

export const UserChatBubble = styled.div`
  width: fit-content;
  max-width: 80%;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  padding: 0.4rem 0.7rem;
  margin-bottom: 1rem;
  color: white;
  background-color: #477084;
`;
