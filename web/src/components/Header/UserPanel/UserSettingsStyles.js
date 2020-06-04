import styled from 'styled-components';

export const ActivityContainer = styled.div`
  width: 100%;
  height: 10rem;
  text-align: center;
  border: 1px solid #e8e8e8;
  border-radius: 5px;
  overflow-y: scroll;
`;

export const ActionsWrapper = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px;
  background: #fff;
  text-align: right;
  z-index: 2;
`;

export const ActivityLogWrapper = styled.div`
  padding: 0.7rem 0.7rem 0 0.7rem;
  width: 100%;
`;

export const ObjectLinkWrapper = styled.span`
  color: #1b5b9a;
  cursor: pointer;
  font-weight: 500;
`;
