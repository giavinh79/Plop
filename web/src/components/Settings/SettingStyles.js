import styled from 'styled-components';
import { Typography } from 'antd';

export const SettingsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  max-width: 90rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  color: #757575;
`;

export const ToggleContainer = styled.div`
  padding: 1rem;
  background-color: #fbfbfb;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin: 1rem;
  width: 100%;
  color: #898ea9;
  font-weight: 500;
`;

export const ToggleWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding-bottom: 0.5rem;
  min-width: 15rem;
  flex-direction: row-reverse;
`;

export const DefaultWrapper = styled.div`
  display: flex;
  padding: 0 1rem 1rem 1rem;
  flex-wrap: wrap;
`;

export const FlexDiv = styled.div`
  flex: 1;
`;

export const WideDiv = styled.div`
  width: 100%;
`;

export const TeamIdInput = styled(Typography.Paragraph)`
  padding: 4px 11px;
  margin: 0;
  min-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: #f7f7f7;
`;

export const Text = styled.p`
  margin: 0.5rem 1rem 0.5rem 0;
  font-weight: 500;
  min-width: 10rem;
  font-size: 1.1rem;
`;

export const TextSecondary = styled.p`
  margin: 0.5rem auto 0.5rem 0.5rem;
  min-width: 10rem;
  font-size: 1.1rem;
`;
