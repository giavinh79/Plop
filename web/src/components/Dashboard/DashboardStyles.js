import styled from 'styled-components';
import { Button, Icon, Row } from 'antd';

export const cardStyles = {
  titleWrapper: {
    display: 'flex',
    justifyContent: 'center',
    fontSize: '2rem',
    fontFamily: '"Montserrat"',
    fontDisplay: 'fallback',
  },
  title: {
    margin: '1rem',
    color: 'black',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px',
    fontWeight: 'bold',
    backgroundColor: '#c9dde4',
  },
  cardBody: {
    display: 'flex',
    padding: '16px',
  },
  cardIcon: {
    color: '#6b7080',
    margin: '-0.5rem -0.5rem 0 0',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
  emptyWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '90%',
    width: '100%',
  },
  emptyImage: {
    height: '10rem',
    paddingBottom: '2rem',
  },
};

export const DroppableWrapper = styled.div`
  width: 50%;
  @media (max-width: 850px) {
    width: 100%;
  }
`;

export const SearchWrapper = styled.div`
  display: flex;
  position: fixed;
  max-width: 40rem;
  min-width: 20rem;
  width: 100%;
  padding: 2rem;
  bottom: 0;
`;

export const Wrapper = styled.div`
  display: inherit;
  width: inherit;
  height: 100%;

  @media (max-width: 850px) {
    flex-direction: column;
  }
`;

export const CheckIcon = styled(Icon)`
  cursor: pointer;
  padding: 0.5rem;
  background-color: #15b335d4;
  color: white !important;
  font-size: 1.5rem;
  border-radius: 20px;

  &:hover {
    -webkit-transform: scale(1.1);
    -ms-transform: scale(1.1);
    transform: scale(1.1);
  }
`;

export const CreateIssueButton = styled(Button)`
  margin-right: 2rem;
  font-weight: 500;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14),
    0px 1px 18px 0px rgba(0, 0, 0, 0.12) !important;
`;

export const Toolbar = styled(Row)`
  flex-wrap: nowrap !important;
  justify-content: flex-end;
  align-items: center;
  background-color: ${({ theme }) => theme.home.filterBgColor};
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: inherit;
  border-left: ${({ theme }) => theme.home.leftBorder};
`;

export const getActiveStyle = (isDragging, draggableStyle) => ({
  display: 'flex',
  flexDirection: 'column',
  userSelect: 'none',
  margin: `0 0 8px 0`,
  background: isDragging ? '#eaeaea' : 'white',
  boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 4px',
  ...draggableStyle,
});

export const getListStyle = (isDraggingOver, theme) => ({
  background: isDraggingOver ? 'lightblue' : theme.home.backgroundColor,
  padding: '1rem 2rem',
});
