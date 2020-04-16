import styled from 'styled-components';

export const cardStyles = {
  titleWrapper: {
    display: 'flex',
    justifyContent: 'center',
    fontSize: '2rem',
    fontFamily: '"Montserrat"',
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
  @media (max-width: 850px) {
    flex-direction: column;
  }
`;

export const getActiveStyle = (isDragging, draggableStyle) => ({
  display: 'flex',
  flexDirection: 'column',
  userSelect: 'none',
  margin: `0 0 8px 0`,
  background: isDragging ? '#eaeaea' : 'white',
  // border: '1px solid #ccc',
  boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 4px',
  // borderRadius: '5px',
  ...draggableStyle,
});

export const getListStyle = (isDraggingOver, isLightMode) => ({
  background: isDraggingOver ? 'lightblue' : !isLightMode ? '#F2F7FC' : 'white',
  padding: '1rem 2rem',
});
