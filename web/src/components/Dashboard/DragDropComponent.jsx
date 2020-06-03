import React, { useContext, useEffect, useState } from 'react';
import { Input, Skeleton, Icon, Tooltip, Modal } from 'antd';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import {
  cardStyles,
  DroppableWrapper,
  getActiveStyle,
  getListStyle,
  Wrapper,
  Container,
  Toolbar,
  CreateIssueButton,
  CheckIcon,
} from './DashboardStyles';
import { ThemeContext } from '../../colors/theme';
import { updateIssue, getIssues, endSprint } from '../../utility/restCalls';
import { displaySimpleNotification } from '../../utility/services';
import DraggableCardsList from './DraggableCardsList';
import CreateIssueModal from './CreateIssueModal';
import { useRef } from 'react';

const id2List = {
  droppable1: 'active',
  droppable2: 'progress',
  droppable3: 'complete',
};

/*
 * Component representing the three drag & drop columns active, progress, and complete
 * Takes inputs from TeamDashboard and UserDashboard components
 */
export default function DragDropComponent({ loading, itemsData, source, newRequest, setNewRequest, type }) {
  const searchbarRef = useRef();
  const sprintName = useRef();
  const [theme] = useContext(ThemeContext);

  const [refresh, setRefresh] = useState(false);
  const [issueModal, setIssueModal] = useState(false);
  const [backupItems, setBackupItems] = useState();
  const [items, setItems] = useState({
    active: [],
    progress: [],
    complete: [],
  });

  useEffect(() => {
    setItems(itemsData);
    setBackupItems(itemsData);
  }, [itemsData, newRequest]);

  useEffect(() => {
    (async () => {
      const {
        data: { activeItems, progressItems, completedItems },
      } = await getIssues(type);
      setBackupItems({ active: activeItems, progress: progressItems, complete: completedItems });
    })().catch((err) => {
      console.log(err);
    });
  }, [refresh, type]);

  const resetSearch = () => {
    searchbarRef.current.input.state.value = '';
    setItems(backupItems);
  };

  const handleSearch = (e) => {
    let userInput = e.target.value.toLowerCase();
    let filteredItems = {};

    filteredItems.active = backupItems.active.filter((item) => {
      return inputExists(item, userInput);
    });

    filteredItems.progress = backupItems.progress.filter((item) => {
      return inputExists(item, userInput);
    });

    filteredItems.complete = backupItems.complete.filter((item) => {
      return inputExists(item, userInput);
    });
    setItems(filteredItems);
  };

  const inputExists = (item, userInput) => {
    return (
      (item.assignee && item.assignee.toLowerCase().includes(userInput)) ||
      (item.description && item.description.toLowerCase().includes(userInput)) ||
      item.title.toLowerCase().includes(userInput) ||
      item.shortDescription.toLowerCase().includes(userInput) ||
      (item.tag.length > 0 && JSON.stringify(item.tag).toLowerCase().includes(userInput))
    );
  };

  const getList = (id) => items[id2List[id]];

  // Reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // Moving items between the lists
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
      setRefresh(!refresh);
    }
  };

  return (
    <Container>
      {issueModal && (
        <CreateIssueModal
          setIssueModal={setIssueModal}
          newRequest={newRequest}
          setNewRequest={setNewRequest}
          resetSearch={resetSearch}
        />
      )}
      <Toolbar type='flex'>
        <Input.Search
          allowClear
          size='large'
          placeholder='Filter issues through deep data search'
          onChange={(e) => handleSearch(e)}
          disabled={loading}
          ref={searchbarRef}
          style={{
            margin: '1.5rem',
            minWidth: '20rem',
            height: '2.7rem',
          }}
        />
        <CreateIssueButton
          type='primary'
          shape='round'
          icon='plus'
          size='large'
          onClick={() => setIssueModal(true)}
          disabled={loading}
        >
          Create Issue
        </CreateIssueButton>
      </Toolbar>
      <Wrapper>
        <DragDropContext onDragEnd={onDragEnd} style={{ height: '50%' }}>
          <Droppable droppableId='droppable1'>
            {(provided, snapshot) => (
              <DroppableWrapper
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver, theme.isLightMode)}
              >
                <div style={cardStyles.titleWrapper}>
                  <h5 style={{ ...cardStyles.title, opacity: loading ? 0.3 : 1 }}>Active</h5>
                </div>
                {loading && (
                  <>
                    <Skeleton active />
                    <Skeleton active />
                  </>
                )}
                <DraggableCardsList items={items.active} source={source} getActiveStyle={getActiveStyle} />
                {provided.placeholder}
              </DroppableWrapper>
            )}
          </Droppable>
          <Droppable droppableId='droppable2'>
            {(provided, snapshot) => (
              <DroppableWrapper
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver, theme.isLightMode)}
              >
                <div style={cardStyles.titleWrapper}>
                  <h5 style={{ ...cardStyles.title, opacity: loading ? 0.3 : 1 }}>In Progress</h5>
                </div>
                {loading && (
                  <>
                    <Skeleton active />
                    <Skeleton active />
                  </>
                )}
                <DraggableCardsList items={items.progress} source={source} getActiveStyle={getActiveStyle} />
                {provided.placeholder}
              </DroppableWrapper>
            )}
          </Droppable>
          <Droppable droppableId='droppable3'>
            {(provided, snapshot) => (
              <DroppableWrapper
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver, theme.isLightMode)}
              >
                <div style={{ ...cardStyles.titleWrapper, alignItems: 'center' }}>
                  <h5 style={{ ...cardStyles.title, opacity: loading ? 0.3 : 1 }}>Completed</h5>
                  {items.complete.length > 0 && (
                    <Tooltip title='Use this button to mark all completed issues as finished.'>
                      <CheckIcon
                        type='check'
                        onClick={() => {
                          Modal.confirm({
                            title: 'Delete all completed issues?',
                            icon: <Icon type='exclamation-circle' />,
                            maskClosable: true,
                            okText: `Confirm Deletion (${items.complete.length} tasks)`,
                            content: (
                              <>
                                <div>
                                  Typically this button is used to mark the end of a{' '}
                                  <a
                                    style={{ color: '#337094', fontWeight: 500 }}
                                    href='https://searchsoftwarequality.techtarget.com/definition/Scrum-sprint'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                  >
                                    sprint/development cycle
                                  </a>
                                  . On confirmation, the issues in this column are marked as complete and{' '}
                                  <span style={{ color: '#B15858', fontWeight: 500 }}>deleted</span>. You may optionally
                                  provide a name for this sprint which will appear in your team logs.
                                </div>
                                <Input
                                  addonBefore='Sprint'
                                  placeholder='(Optional) Name of Sprint'
                                  style={{ margin: '1rem 0' }}
                                  type='text'
                                  autoComplete='nope'
                                  onChange={(e) => (sprintName.current = e.target.value)}
                                />
                              </>
                            ),
                            onOk() {
                              return new Promise(async (resolve) => {
                                try {
                                  await endSprint(items.complete, sprintName.current);
                                  displaySimpleNotification(
                                    'Success',
                                    4,
                                    'bottomRight',
                                    'Issues were successfully marked as completed.',
                                    'smile',
                                    '#108ee9'
                                  );
                                } catch (err) {
                                  // check session
                                  // displayUnknownError
                                } finally {
                                  sprintName.current = '';
                                  resetSearch();
                                  setNewRequest(!newRequest);
                                  resolve();
                                }
                              });
                            },
                            onCancel() {
                              sprintName.current = '';
                            },
                          });
                        }}
                      />
                    </Tooltip>
                  )}
                </div>
                {loading && (
                  <>
                    <Skeleton active />
                    <Skeleton active />
                  </>
                )}
                <DraggableCardsList items={items.complete} source={source} getActiveStyle={getActiveStyle} />
                {provided.placeholder}
              </DroppableWrapper>
            )}
          </Droppable>
        </DragDropContext>
      </Wrapper>
    </Container>
  );
}
