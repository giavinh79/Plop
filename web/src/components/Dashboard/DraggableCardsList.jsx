import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Card from './Card';

function DraggableCardsList({ items, source, getActiveStyle }) {
  return items.map((item, index) => (
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
  ));
}

export default React.memo(DraggableCardsList);
