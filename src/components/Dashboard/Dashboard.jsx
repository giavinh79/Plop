import React, { Component } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Card } from './Card'

const activeItems = [
    {
        id: '1',
        title: 'Complete frontend',
        content: 'Fix styling on homepage'
    },
    {
        id: '2',
        title: 'Create backend',
        content: 'Setup REST API'
    },
    {
        id: '3',
        title: 'Add Socket.IO',
        content: 'Install and configure for dashboard page'
    }
];

const progressItems = [
    // {
    //     id: 'item 4',
    //     title: 'item 4',
    // },
    // {
    //     id: 'item 5',
    //     title: 'item 5',
    // },
    // {
    //     id: 'item 6',
    //     title: 'item 6',
    // }
];

const completedItems = [
    // {
    //     id: 'item 4',
    //     title: 'item 4',
    // },
    // {
    //     id: 'item 5',
    //     title: 'item 5',
    // },
    // {
    //     id: 'item 6',
    //     title: 'item 6',
    // }
];

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;
    return result;
};

const grid = 8;

const getactivetyle = (isDragging, draggableStyle) => ({
    display: 'flex',
    flexDirection: 'column',
    userSelect: 'none',
    // padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    background: isDragging ? '#eaeaea' : 'white',
    border: '1px solid #ccc',
    borderRadius: '5px',
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'white',
    padding: '1rem 2rem',
    width: '50%',
    // borderRadius: '5px',
    // border: '1px solid #ccc'
});

export default class Dashboard extends Component {
    state = {
        active: activeItems,
        progress: progressItems,
        complete: completedItems
    };

    /**
     * A semi-generic way to handle multiple lists. Matches
     * the IDs of the droppable container to the names of the
     * source arrays stored in the state.
     */
    id2List = {
        droppable: 'active',
        droppable2: 'progress',
        droppable3: 'complete'
    };

    getList = id => this.state[this.id2List[id]];

    onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const active = reorder(
                this.getList(source.droppableId),
                source.index,
                destination.index
            );

            let state = { active };

            if (source.droppableId === 'droppable2') {
                state = { progress: active };
            }

            this.setState(state);
        } else {
            const result = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );

            this.setState({
                active: result.droppable,
                progress: result.droppable2
            });
        }
    };

    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd} style={{height:'50%'}}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            <div style={styles.titleWrapper}>
                                <h5 style={styles.title}>Active</h5>
                            </div>
                            {this.state.active.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getactivetyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}>
                                            <Card content={item.content} title={item.title}/>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                <Droppable droppableId="droppable2">
                    {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}>
                                <div style={styles.titleWrapper}>
                                    <h5 style={styles.title}>In Progress</h5>
                                </div>
                                {this.state.progress.map((item, index) => (
                                    <Draggable
                                        key={item.id}
                                        draggableId={item.id}
                                        index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getactivetyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}>
                                                <Card content={item.content} title={item.title}/>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                    )}
                </Droppable>
                <Droppable droppableId="droppable3">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            <div style={styles.titleWrapper}>
                                <h5 style={styles.title}>Completed</h5>
                            </div>
                            {this.state.complete.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getactivetyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}>
                                            <Card content={item.content} title={item.title}/>
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
}

const styles = {
    titleWrapper : {
        display: 'flex',
        justifyContent: 'center',
        fontSize: '2rem',
        fontFamily: '"Montserrat"'
    },
    title : {
        margin:'1rem',
        color: 'black'
    },
    cardTop : {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '16px',
        fontWeight: 'bold',
        backgroundColor: '#c9dde4'
    },
    cardBody : {
        display: 'flex',
        padding: '16px'
    },
    cardIcon : {
        color: '#6b7080',
        margin: '-0.5rem -0.5rem 0 0',
        fontSize: '1.5rem',
        cursor: 'pointer'
    }
}