import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card } from './Card';
import axios from 'axios';

let isMounted = false;
let activeItems = []
let progressItems = []
let completedItems = []

// A little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

// Moves an item from one list to another list.
const move = (source, destination, droppableSource, droppableDestination) => {
  let issueId;
  let issueStatus = droppableDestination.droppableId.slice(-1) - 0;
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  issueId = source[droppableSource.index].id;
  source[droppableSource.index].status = issueStatus;
  const [removed] = sourceClone.splice(droppableSource.index, 1)

  destClone.splice(droppableDestination.index, 0, removed)
  const result = {}
  result[droppableSource.droppableId] = sourceClone
  result[droppableDestination.droppableId] = destClone
  result['id'] = issueId;
  result['status'] = issueStatus;
  return result;
}

const grid = 8

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
})

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'white',
  padding: '1rem 2rem',
  width: '50%'
  // borderRadius: '5px',
  // border: '1px solid #ccc'
})

export default class Dashboard extends Component {
  constructor(props) {
    super(props)
    const { active, progress, complete } = props.issue
    if (active !== null || progress !== null || complete !== null) {
      activeItems = active
      progressItems = progress
      completedItems = complete
    }

    this.state = {
      active: activeItems,
      progress: progressItems,
      complete: completedItems
    }
  }

  componentDidMount() {
    isMounted = true
    axios.get('/teamIssue/1', { withCredentials: true })
      .then(res => {
        const { activeItems, progressItems, completedItems } = res.data
        if (isMounted) {
          if (activeItems.length + progressItems.length + completedItems.length > 0 || this.state.active.length + this.state.progress.length + this.state.complete.length > 0)
            this.setState({ active: activeItems, progress: progressItems, complete: completedItems })
        }
      }).catch(() => {
        this.props.checkSession();
      })
  }

  componentWillUnmount() {
    isMounted = false
    // this.props.setIssue(this.state.active, this.state.progress, this.state.complete, false)
  }

  id2List = {
    droppable1: 'active',
    droppable2: 'progress',
    droppable3: 'complete'
  }

  getList = id => this.state[this.id2List[id]]

  onDragEnd = result => {
    const { source, destination } = result
    // dropped outside the list
    if (!destination) {
      return
    }

    if (source.droppableId === destination.droppableId) {
      const active = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      )

      let state = { active }

      if (source.droppableId === 'droppable2') {
        state = { progress: active }
      } else if (source.droppableId === 'droppable3') {
        state = { complete: active }
      }

      this.setState(state)
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      axios.post('/issue', { id: result.id, status: result.status }, { withCredentials: true }).catch(() => {
        console.log(`ERROR - Was not able to update issue ${result.id}`);
      });

      // To identify which states to change and allow 3 way drag and drop
      const identify =
        parseInt(source.droppableId.slice(-1)) +
        parseInt(destination.droppableId.slice(-1))

      if (identify === 3)
        this.setState({
          active: result.droppable1,
          progress: result.droppable2
        })
      else if (identify === 4)
        this.setState({
          active: result.droppable1,
          complete: result.droppable3
        })
      else
        this.setState({
          progress: result.droppable2,
          complete: result.droppable3
        })
    }
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd} style={{ height: '50%' }}>
        <Droppable droppableId="droppable1">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}>
              <div style={styles.titleWrapper}>
                <h5 style={styles.title}>Active</h5>
              </div>
              {this.state.active.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getactivetyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}>
                      <Card
                        data={item}
                        changePage={this.props.changePage}
                      />
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
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getactivetyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}>
                      <Card
                        data={item}
                        changePage={this.props.changePage}
                      />
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
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getactivetyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}>
                      <Card
                        data={item}
                        changePage={this.props.changePage}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}

const styles = {
  titleWrapper: {
    display: 'flex',
    justifyContent: 'center',
    fontSize: '2rem',
    fontFamily: '"Montserrat"'
  },
  title: {
    margin: '1rem',
    color: 'black'
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px',
    fontWeight: 'bold',
    backgroundColor: '#c9dde4'
  },
  cardBody: {
    display: 'flex',
    padding: '16px'
  },
  cardIcon: {
    color: '#6b7080',
    margin: '-0.5rem -0.5rem 0 0',
    fontSize: '1.5rem',
    cursor: 'pointer'
  },
  emptyWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '90%',
    width: '100%'
  },
  emptyImage: {
    height: '10rem',
    paddingBottom: '2rem'
  }
}
