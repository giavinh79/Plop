import React from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card } from './Card';
import styles from './DashboardStyles';

/*
 * Component representing the three drag & drop columns active, progress, and complete
 * Takes inputs from TeamDashboard and UserDashboard components
 */
export default function DragDropComponent({ changePage, items, setItems }) {
  const getActiveStyle = (isDragging, draggableStyle) => ({
    display: 'flex',
    flexDirection: 'column',
    userSelect: 'none',
    margin: `0 0 8px 0`,
    background: isDragging ? '#eaeaea' : 'white',
    border: '1px solid #ccc',
    borderRadius: '5px',
    ...draggableStyle,
  });

  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'white',
    padding: '1rem 2rem',
    width: '50%',
  });

  const getList = id => items[id2List[id]];

  const id2List = {
    droppable1: 'active',
    droppable2: 'progress',
    droppable3: 'complete',
  };

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

  const onDragEnd = result => {
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

      setItems(...items, state);
    } else {
      const result = move(getList(source.droppableId), getList(destination.droppableId), source, destination);

      axios.post('/issue', { id: result.id, status: result.status }, { withCredentials: true }).catch(() => {
        console.log(`ERROR - Was not able to update issue ${result.id}`);
      });

      // To identify which states to change and allow 3 way drag and drop
      const identify = parseInt(source.droppableId.slice(-1)) + parseInt(destination.droppableId.slice(-1));

      if (identify === 3) setItems({ ...items, active: result.droppable1, progress: result.droppable2 });
      else if (identify === 4) setItems({ ...items, active: result.droppable1, complete: result.droppable3 });
      else setItems({ ...items, progress: result.droppable2, complete: result.droppable3 });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} style={{ height: '50%' }}>
      <Droppable droppableId='droppable1'>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
            <div style={styles.titleWrapper}>
              <h5 style={styles.title}>Active</h5>
            </div>
            {items.active.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getActiveStyle(snapshot.isDragging, provided.draggableProps.style)}
                  >
                    <Card data={item} changePage={changePage} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Droppable droppableId='droppable2'>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
            <div style={styles.titleWrapper}>
              <h5 style={styles.title}>In Progress</h5>
            </div>
            {items.progress.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getActiveStyle(snapshot.isDragging, provided.draggableProps.style)}
                  >
                    <Card data={item} changePage={changePage} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Droppable droppableId='droppable3'>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
            <div style={styles.titleWrapper}>
              <h5 style={styles.title}>Completed</h5>
            </div>
            {items.complete.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getActiveStyle(snapshot.isDragging, provided.draggableProps.style)}
                  >
                    <Card data={item} changePage={changePage} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
