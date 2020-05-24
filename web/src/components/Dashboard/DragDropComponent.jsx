import React, { useContext, useEffect, useState } from 'react';
import { Skeleton } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card } from './Card';
import { cardStyles, DroppableWrapper, getActiveStyle, getListStyle, Wrapper } from './DashboardStyles';
import { ThemeContext } from '../../colors/theme';
import { updateIssue } from '../../utility/restCalls';
import { displaySimpleNotification } from '../../utility/services';

/*
 * Component representing the three drag & drop columns active, progress, and complete
 * Takes inputs from TeamDashboard and UserDashboard components
 */
export default function DragDropComponent({ loading, itemsData, source }) {
  const [items, setItems] = useState({
    active: [],
    progress: [],
    complete: [],
  });

  useEffect(() => {
    setItems(itemsData);
  }, [itemsData]);

  const [theme] = useContext(ThemeContext);

  const id2List = {
    droppable1: 'active',
    droppable2: 'progress',
    droppable3: 'complete',
  };

  const getList = (id) => items[id2List[id]];

  // A little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // Moves an item from one list to another list.
  const move = (source, destination, droppableSource, droppableDestination) => {
    let issueId;
    let issueStatus = droppableDestination.droppableId.slice(-1) - 0;
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    issueId = source[droppableSource.index].id;
    source[droppableSource.index].status = issueStatus;
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);
    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;
    result['id'] = issueId;
    result['status'] = issueStatus;
    return result;
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const active = reorder(getList(source.droppableId), source.index, destination.index);

      let state = { active };

      if (source.droppableId === 'droppable2') {
        state = { progress: active };
      } else if (source.droppableId === 'droppable3') {
        state = { complete: active };
      }

      setItems({ ...items, state });
    } else {
      const result = move(getList(source.droppableId), getList(destination.droppableId), source, destination);

      updateIssue(result.id, result.status).catch(() => {
        displaySimpleNotification(
          'Error',
          4,
          'bottomRight',
          'Issue progress was not saved. You may not have sufficient permissions.',
          'warning',
          'red'
        );
      });

      // To identify which states to change and allow 3 way drag and drop
      const identify = parseInt(source.droppableId.slice(-1)) + parseInt(destination.droppableId.slice(-1));

      if (identify === 3) setItems({ ...items, active: result.droppable1, progress: result.droppable2 });
      else if (identify === 4) setItems({ ...items, active: result.droppable1, complete: result.droppable3 });
      else setItems({ ...items, progress: result.droppable2, complete: result.droppable3 });
    }
  };

  return (
    <Wrapper>
      <DragDropContext onDragEnd={onDragEnd} style={{ height: '50%' }}>
        <Droppable droppableId='droppable1'>
          {(provided, snapshot) => (
            <DroppableWrapper ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver, theme.isLightMode)}>
              <div style={cardStyles.titleWrapper}>
                <h5 style={{ ...cardStyles.title, opacity: loading ? 0.3 : 1 }}>Active</h5>
              </div>
              {loading && (
                <>
                  <Skeleton active />
                  <Skeleton active />
                </>
              )}

              {items.active.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getActiveStyle(snapshot.isDragging, provided.draggableProps.style)}
                    >
                      <Card data={item} source={source} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </DroppableWrapper>
          )}
        </Droppable>
        <Droppable droppableId='droppable2'>
          {(provided, snapshot) => (
            <DroppableWrapper ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver, theme.isLightMode)}>
              <div style={cardStyles.titleWrapper}>
                <h5 style={{ ...cardStyles.title, opacity: loading ? 0.3 : 1 }}>In Progress</h5>
              </div>
              {loading && (
                <>
                  <Skeleton active />
                  <Skeleton active />
                </>
              )}
              {items.progress.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getActiveStyle(snapshot.isDragging, provided.draggableProps.style)}
                    >
                      <Card data={item} source={source} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </DroppableWrapper>
          )}
        </Droppable>
        <Droppable droppableId='droppable3'>
          {(provided, snapshot) => (
            <DroppableWrapper ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver, theme.isLightMode)}>
              <div style={cardStyles.titleWrapper}>
                <h5 style={{ ...cardStyles.title, opacity: loading ? 0.3 : 1 }}>Completed</h5>
              </div>
              {loading && (
                <>
                  <Skeleton active />
                  <Skeleton active />
                </>
              )}
              {items.complete.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getActiveStyle(snapshot.isDragging, provided.draggableProps.style)}
                    >
                      <Card data={item} source={source} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </DroppableWrapper>
          )}
        </Droppable>
      </DragDropContext>
      {/* <div
        style={{
          position: 'fixed',
          width: '100%',
          display: 'flex',
          bottom: 0,
          right: '7rem',
          width: '50%',
          maxWidth: '40rem',
          minWidth: '20rem',
        }}
      >
        <Search
          allowClear
          size='large'
          placeholder='Filter issues through data search'
          onSearch={value => console.log(value)}
          disabled
          style={{
            height: '2.7rem',
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}
        />
      </div> */}
    </Wrapper>
  );
}
