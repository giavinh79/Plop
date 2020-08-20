import React, { useCallback, useContext, useEffect, useState, useRef } from 'react';
import { Button, Icon, Input, Row } from 'antd';
import { Layout } from '../../globalStyles';
import NoteModal from './NoteModal';
import IconButton from './IconButton';
import { getNotes, updateLayout, getRoomAdminTiers } from '../../utility/restCalls';
import NoteHelpModal from './NoteHelpModal';
import moment from 'moment';
import { displaySimpleNotification } from '../../utility/services';
import NotesGrid from './NotesGrid';
import { ThemeContext } from '../../colors/theme';
import Ws from '@adonisjs/websocket-client';
import { WEB_SOCKET } from '../../constants';

export default function Notes() {
  const ws = useRef(Ws(WEB_SOCKET));
  const chat = useRef();

  const [theme] = useContext(ThemeContext);

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

      setDate(last_modified);
      setData(notes);
      setLayoutData(notes_layout);
      setAdminTier(administration_level);

      ws.current.connect();

      ws.current.on('open', () => {
        chat.current = ws.current.subscribe(`room-notes:${JSON.parse(localStorage.getItem('currentTeam')).id}`);

        chat.current.on('message', (message) => {
          setData(message.data);
          setLayoutData(message.newLayout);
        });
      });

      setLoading(false);
    })().catch((err) => {
      console.log(err);
      displaySimpleNotification('Session expired', 5, 'bottomRight', 'You need to login again.', 'warning', '#108ee9');
    });
  }, []);

  // Function that converts markdown links into clickable tags
  const parsedDescription = useCallback((description) => {
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
  }, []);

  const handleCreate = useCallback((item) => {
    setData((data) => [...data, item]);
  }, []);

  const handleFilter = useCallback(
    (e) => {
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
    },
    [data]
  );

  const handleCancel = useCallback(
    (note) => {
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
    },
    [data]
  );

  // Used by ColorModal component
  const handleColorEdit = useCallback(
    async (id, color, save) => {
      let updatedData = data.map((item) => {
        if (item.id === id) {
          return Object.assign({}, item, color);
        }
        return item;
      });

      setData(updatedData);
      if (data.length > 0 && save && !loading && updatedData.length > 0) {
        await updateLayout(updatedData, layoutData, moment(new Date()).format('YYYYMMDDhhmmss'), date);
        chat.current.emit('message', { data: updatedData, newLayout: layoutData });
      }
    },
    [data, date, layoutData, loading]
  );

  const handleDelete = useCallback(
    async (note) => {
      let updatedData = data.filter((item) => {
        return item.uuid !== note.uuid;
      });

      setData(updatedData);
      if (data.length > 0 && !loading && layoutData.length > 0) {
        await updateLayout(updatedData, layoutData, moment(new Date()).format('YYYYMMDDhhmmss'), date);
        chat.current.emit('message', { data: updatedData, newLayout: layoutData });
      }
    },
    [data, layoutData, loading, date]
  );

  const handleEdit = useCallback(
    (note) => {
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
    },
    [data]
  );

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
      if (data.length > 0 && !loading && layoutData.length > 0) {
        await updateLayout(data, layoutData, moment(new Date()).format('YYYYMMDDhhmmss'), date);
        chat.current.emit('message', { data, newLayout: layoutData });
      }
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
    try {
      if (data.length > 0 && !loading && layout.length > 0) {
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
        await updateLayout(data, newLayout, moment(new Date()).format('YYYYMMDDhhmmss'), date);
        chat.current.emit('message', { data, newLayout });
      }
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
      <Layout theme={theme}>
        <Row type='flex' style={{ alignItems: 'center' }}>
          <p
            style={{
              opacity: loading ? 0.3 : 1,
              color: theme.isLightMode ? '' : 'white',
              fontSize: '2rem',
              marginBottom: '1rem',
            }}
          >
            Team Notes
          </p>
          {loading && (
            <Icon
              type='loading'
              spin
              style={{
                color: '#6ca1d8',
                fontSize: '1.4rem',
                margin: '0 0 1rem 1rem',
              }}
            />
          )}
        </Row>
        <Row
          type='flex'
          style={{ alignItems: 'center', justifyContent: 'flex-end', marginBottom: '1rem', flexWrap: 'nowrap' }}
        >
          <Input.Search
            allowClear
            size='large'
            placeholder='Highlight note by text'
            disabled={loading}
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
        <NotesGrid
          adminTier={adminTier}
          data={data}
          editingItem={editingItem}
          handleCancel={handleCancel}
          handleDelete={handleDelete}
          handleColorEdit={handleColorEdit}
          handleEdit={handleEdit}
          handleLayout={handleLayout}
          handleSave={handleSave}
          layoutData={layoutData}
          parsedDescription={parsedDescription}
        />
      </Layout>
    </>
  );
}
