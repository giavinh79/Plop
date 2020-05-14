import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, Icon, Input, Popconfirm, Row, Tooltip } from 'antd';
import { layout } from '../../globalStyles';
import GridLayout, { WidthProvider } from 'react-grid-layout';
import NoteModal from './NoteModal';
import IconButton from './IconButton';
import { getNotes, updateLayout, getRoomAdminTiers } from '../../utility/restCalls';
import NoteHelpModal from './NoteHelpModal';
import moment from 'moment';
import 'antd/dist/antd.css';
import './grid-styles.css';
import './resizable-styles.css';
import { displaySimpleNotification } from '../../utility/services';

const ReactGridLayout = WidthProvider(GridLayout);

// Function that converts markdown links into clickable tags
const parsedDescription = (description) => {
  try {
    const test = description.match(/\[.*?\]\(.*?\)/g);
    let elementArray = [];
    let count = 0;
    let index, linkTag, link;

    for (let item of test) {
      index = description.indexOf(item);
      elementArray.push(description.substring(0, index));
      description = description.substring(index, description.length);

      linkTag = description.substring(item.indexOf('[') + 1, item.indexOf(']'));
      link = description.substring(description.indexOf('(') + 1, description.indexOf(')'));
      elementArray.push(
        <a href={link} target='_blank' rel='noopener noreferrer' key={count}>
          {linkTag}
        </a>
      );
      description = description.substring(item.length, description.length);
      count++;
    }
    return elementArray;
  } catch (err) {
    return description;
  }
};

export default function Notes() {
  const [data, setData] = useState([]);
  const [displayModal, setDisplayModal] = useState(false);
  const [displayHelpModal, setDisplayHelpModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(false);
  const [layoutData, setLayoutData] = useState([]);
  const [date, setDate] = useState(null); // date when notes were received
  const [adminTier, setAdminTier] = useState(1);

  useEffect(() => {
    (async () => {
      const {
        data: { notes, notes_layout, last_modified },
      } = await getNotes();
      let {
        data: { administration_level },
      } = await getRoomAdminTiers();

      setLoading(false);
      setDate(moment(last_modified, 'YYYYMMDDhhmmss'));
      setData(notes);
      setLayoutData(notes_layout);
      setAdminTier(administration_level);
    })().catch((err) => {
      displaySimpleNotification('Session expired', 5, 'bottomRight', 'You need to login again.', 'warning', '#108ee9');
    });
  }, []);

  const handleCreate = (item) => {
    setData((data) => [...data, item]);
  };

  const handleFilter = (e) => {
    let userInput = e.target.value.toLowerCase();
    setData(
      data.map((item) => {
        if (
          userInput.length > 0 &&
          (item.description.toLowerCase().includes(userInput) || item.title.toLowerCase().includes(userInput))
        ) {
          item.highlighted = true;
        } else {
          item.highlighted = false;
        }
        return item;
      })
    );
  };

  const handleCancel = (note) => {
    setEditingItem(false);
    setData(
      data.map((item) => {
        if (item.uuid === note.uuid) {
          item = note;
        }
        item.edit = false;
        return item;
      })
    );
  };

  const handleDelete = async (note) => {
    let updatedData = data.filter((item) => {
      return item.uuid !== note.uuid;
    });

    setData(updatedData);
    if (data.length > 0 && !loading && layoutData.length > 0) await updateLayout(updatedData, layoutData, date);
  };

  const handleEdit = (note) => {
    setData(
      data.map((item) => {
        if (item.uuid === note.uuid) {
          item.edit = true;
          setEditingItem(true);
        } else {
          item.edit = false;
        }
        return item;
      })
    );
  };

  const handleSave = async (note) => {
    setEditingItem(false);
    setData(
      data.map((item) => {
        if (item.uuid === note.uuid) {
          item = note;
        }
        item.edit = false;
        return item;
      })
    );
    try {
      if (data.length > 0 && !loading && layoutData.length > 0) await updateLayout(data, layoutData, date);
    } catch (err) {
      if (err.response.data === 'ERROR_NEW_NOTE_CHANGES') {
        displaySimpleNotification(
          'Error',
          10,
          'bottomRight',
          'There have been new changes and the page must be refreshed to save changes.',
          'warning',
          'red'
        );
      }
    }
  };

  const handleLayout = async (layout) => {
    let newLayout = layout.map((item) => {
      if (item.minH == null) {
        item.minW = 3;
        item.minH = 2;
        item.w = 4;
        item.h = 2;
      }
      return item;
    });
    setLayoutData(newLayout);
    try {
      if (data.length > 0 && !loading && layout.length > 0) await updateLayout(data, newLayout, date);
    } catch (err) {
      if (err.response.data === 'ERROR_NEW_NOTE_CHANGES') {
        displaySimpleNotification(
          'Error',
          10,
          'bottomRight',
          'There have been new changes and the page must be refreshed to save changes.',
          'warning',
          'red'
        );
      }
    }
  };

  return (
    <>
      {displayHelpModal && <NoteHelpModal setDisplayHelpModal={setDisplayHelpModal} />}
      {displayModal && <NoteModal data={data} handleCreate={handleCreate} setDisplayModal={setDisplayModal} />}
      <div style={layout}>
        <Row type='flex' style={{ alignItems: 'center' }}>
          <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>Team Notes</p>
          {loading && (
            <Icon
              type='loading'
              spin
              style={{
                color: '#6ca1d8',
                fontSize: '1.4rem',
                margin: '0 0 1rem 0.7rem',
              }}
            />
          )}
        </Row>
        <Row type='flex' style={{ alignItems: 'center', marginBottom: '1rem', flexWrap: 'nowrap' }}>
          <Input.Search
            allowClear
            size='large'
            placeholder='Highlight note by text'
            onChange={(e) => handleFilter(e)}
            style={{
              height: '2.7rem',
            }}
          />
          <Button icon='tool' type='primary' style={{ height: '2.7rem', margin: '0 1rem' }} disabled>
            Modify Layout Parameters
          </Button>
          <Button
            icon='question-circle'
            type='primary'
            style={{ height: '2.7rem', marginRight: '1rem' }}
            onClick={() => setDisplayHelpModal(true)}
          >
            Info
          </Button>
          <IconButton
            title='Add new note'
            icon='plus'
            functionToExecute={() => setDisplayModal(true)}
            disabled={editingItem || adminTier < 3}
            loading={loading}
            nomargin={true}
            style={{ margin: 0 }}
          />
        </Row>
        <ReactGridLayout
          layout={layoutData}
          cols={12}
          rowHeight={150}
          width={1000}
          style={{ border: '1px solid #e8e8e8', borderRadius: '10px', minHeight: '15rem' }}
          isDraggable={!editingItem}
          onLayoutChange={(layout) => handleLayout(layout)}
        >
          {data.map((item, index) => {
            return (
              <Card
                key={index}
                bodyStyle={{ flex: 1, backgroundColor: item.highlighted ? '#424f5d' : 'white', overflowY: 'overlay' }}
                actions={[
                  <Tooltip title={item.edit ? 'Save' : 'Edit note'}>
                    <Icon
                      type={item.edit ? 'save' : 'edit'}
                      key='edit'
                      style={{ maxWidth: '1rem' }}
                      onClick={item.edit ? () => handleSave(item) : () => handleEdit(item)}
                      disabled={adminTier < 3}
                    />
                  </Tooltip>,
                  item.edit ? (
                    <Icon type='close' key='cancel' style={{ maxWidth: '1rem' }} onClick={() => handleCancel(item)} />
                  ) : (
                    <Popconfirm
                      title='Delete note?'
                      onConfirm={() => handleDelete(item)}
                      okText='Yes'
                      cancelText='No'
                      disabled={adminTier < 3}
                    >
                      <Icon type='delete' key='delete' style={{ maxWidth: '1rem' }} disabled={adminTier < 3} />
                    </Popconfirm>
                  ),
                ]}
                style={{ pointerEvents: (editingItem && !item.edit) || adminTier < 3 ? 'none' : 'auto' }}
              >
                <Card.Meta
                  avatar={<Avatar icon='bulb' style={{ backgroundColor: '#dab632', color: 'white' }} />}
                  title={
                    item.edit ? (
                      <Input
                        defaultValue={item.title}
                        onChange={(e) => {
                          item.title = e.target.value;
                        }}
                      />
                    ) : (
                      <span style={(item.highlighted && { color: 'white' }) || {}}>{item.title}</span>
                    )
                  }
                  description={
                    item.edit ? (
                      <Input.TextArea
                        defaultValue={item.description}
                        autosize={true}
                        style={{ resize: 'none' }}
                        onChange={(e) => {
                          item.description = e.target.value;
                        }}
                      />
                    ) : (
                      <pre
                        style={{
                          color: item.highlighted ? '#d4d4d4' : '',
                          whiteSpace: 'pre-wrap',
                          fontFamily:
                            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica",
                        }}
                      >
                        {parsedDescription(item.description)}
                      </pre>
                    )
                  }
                />
              </Card>
            );
          })}
        </ReactGridLayout>
      </div>
    </>
  );
}
