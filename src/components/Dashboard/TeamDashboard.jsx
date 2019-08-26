import React, { Component } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Card } from './Card'
import { Empty } from 'antd'
import axios from 'axios'

let isMounted;
let activeItems = []
let progressItems = []
let completedItems = []

// if result is > 0, second item (itemOne) comes before, for future filtering
// activeItems.sort((itemOne, itemTwo) => itemTwo.priority - itemOne.priority)

// A little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

// Moves an item from one list to another list.
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  const [removed] = sourceClone.splice(droppableSource.index, 1)

  destClone.splice(droppableDestination.index, 0, removed)

  const result = {}
  result[droppableSource.droppableId] = sourceClone
  result[droppableDestination.droppableId] = destClone
  return result
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

// const filterItems = (obj, activeItems, progressItems, completedItems) => {
//   const activeItemsFiltered = activeItems.filter(item => {
//     return item.assignee === localStorage.getItem('email')
//   })

//   const progressItemsFiltered = progressItems.filter(item => {
//     return item.assignee === localStorage.getItem('email')
//   })

//   const completedItemsFiltered = completedItems.filter(item => {
//     return item.assignee === localStorage.getItem('email')
//   })

//   if (activeItemsFiltered.length === activeItems.length && progressItemsFiltered.length === progressItems.length && completedItemsFiltered.length === completedItems.length) {
//     return
//   }

//   activeItemsFiltered.length +
//     progressItemsFiltered.length +
//     completedItemsFiltered.length === 0
//     ? obj.setState({ empty: true })
//     : obj.setState({
//       active: activeItemsFiltered,
//       progress: progressItemsFiltered,
//       complete: completedItemsFiltered,
//       empty: false
//     })
// }

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
      complete: completedItems,
      empty: false,
    }
  }

  componentDidMount() {
    isMounted = true
    axios.get('/teamIssue/1', { withCredentials: true })
      .then(res => {
        const { activeItems, progressItems, completedItems } = res.data
        if (isMounted) {
          if (activeItems.length === 0 && progressItems.length === 0 && completedItems.length === 0)
            this.setState({ empty: true })
          else
            this.setState({ active: activeItems, progress: progressItems, complete: completedItems })
        }
      }).catch()
  }

  componentWillReceiveProps() {
    // Refresh
    axios.get('/teamIssue/1', { withCredentials: true })
      .then(res => {
        const { activeItems, progressItems, completedItems } = res.data
        if (activeItems.length === 0 && progressItems.length === 0 && completedItems.length === 0)
          this.setState({ empty: true })
        else
          this.setState({ active: activeItems, progress: progressItems, complete: completedItems })
      }).catch()
  }

  componentWillUnmount() {
    isMounted = false
    this.props.setIssue(this.state.active, this.state.progress, this.state.complete, false)
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
      }

      if (source.droppableId === 'droppable3') {
        state = { complete: active }
      }

      this.setState(state)
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      )

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
    return !this.state.empty ? (
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
                        data={{ shortDescription: item.shortDescription, title: item.title, id: item.id }}
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
                        data={{ shortDescription: item.shortDescription, title: item.title, id: item.id }}
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
                        data={{ shortDescription: item.shortDescription, title: item.title, id: item.id }}
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
    ) : (
        <div style={styles.emptyWrapper}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span style={{ fontSize: '3rem' }}>No issues found</span>
            }
            imageStyle={styles.emptyImage}
          />
        </div>
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
