import React, { useEffect, useState } from 'react';
import { Avatar, Card, Icon, Input, Popconfirm, Row, Tooltip } from 'antd';
import { layout } from '../../globalStyles';
import GridLayout, { WidthProvider } from 'react-grid-layout';
import NoteModal from './NoteModal';
import IconButton from './IconButton';
import 'antd/dist/antd.css';
import './grid-styles.css';
import './resizable-styles.css';

const ReactGridLayout = WidthProvider(GridLayout);
const { Meta } = Card;
const { Search } = Input;

const exampleData = [
  {
    uuid: '5',
    title: 'Frontend',
    description:
      "Fix 'Notes' section so that users can create, edit and delete notes successfully. In addition, notes need to have their layouts successfully saved everytime it's edited and the layouts need to be optimized per note (dynamic minimum heights, widths...)",
    image:
      'https://images.ctfassets.net/2y9b3o528xhq/5YhXXuS0hIw6JV3nJr3GgP/682bf2a70a98c3e466f26c2c2a812d65/front-end-web-developer-nanodegree--nd001.jpg',
  },
  {
    uuid: '2',
    title: 'Backend',
    description:
      'For GymTrack implement an Express REST API that allows interfacing between the client and the MongoDB database. User authentication and authorization handled by Google FIrebase.',
  },
  {
    uuid: '1',
    title: 'Next side project',
    description:
      'Technologies for next project: React.js, Redux Toolkit, Gatsby.js landing page for SEO and speed, and TypeScript.',
  },
];

export default function Notes() {
  const [data, setData] = useState(exampleData);
  const [displayModal, setDisplayModal] = useState(false);
  const [editingItem, setEditingItem] = useState(false);
  const [layoutData, setLayoutData] = useState(null);
  const [layoutChanged, setLayoutChanged] = useState(false);

  const handleFilter = (e) => {
    let userInput = e.target.value.toLowerCase();
    setData(
      exampleData.map((item) => {
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

  const handleDelete = (note) => {
    setData(
      data.filter((item) => {
        return item.uuid !== note.uuid;
      })
    );
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

  const handleSave = (note) => {
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

  const handleLayout = (layout) => {
    if (layoutData == null) {
      setLayoutData(layout);
    } else {
      setLayoutChanged(true);
    }
  };

  const generateLayout = () => {
    return exampleData.map((item, i) => {
      //   console.log(item);
      //   const y = Math.ceil(Math.random() * 3) + 1; //_.result(p, 'y') ||
      return {
        minW: 3,
        minH: 2,
        x: 0,
        y: 0,
        w: 4,
        h: 2,
        i: i.toString(),
      };
    });
  };

  //   function generateLayout() {
  //     return _.map(new Array(exampleData), function(item, i) {
  //       const y = _.result(p, "y") || Math.ceil(Math.random() * 4) + 1;
  //       return {
  //         x: (i * 2) % 12,
  //         y: Math.floor(i / 6) * y,
  //         w: 2,
  //         h: y,
  //         i: i.toString()
  //       };
  //     });
  //   }

  return (
    <>
      {displayModal && <NoteModal setDisplayModal={setDisplayModal} />}
      <div style={layout}>
        <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>Team Notes (incomplete)</p>
        <Row type='flex' style={{ alignItems: 'center', marginBottom: '1rem', flexWrap: 'nowrap' }}>
          <Search
            allowClear
            size='large'
            placeholder='Highlight note by text'
            onChange={(e) => handleFilter(e)}
            style={{
              height: '2.7rem',
            }}
          />
          <IconButton
            title='Save layout changes'
            icon='save'
            functionToExecute={setDisplayModal}
            disabled={!layoutChanged}
          />
          <IconButton
            title='Add new note'
            icon='plus'
            functionToExecute={() => setDisplayModal(true)}
            disabled={false}
          />
        </Row>
        <ReactGridLayout
          layout={generateLayout()}
          cols={12}
          rowHeight={150}
          width={1000}
          style={{ border: '1px solid #e8e8e8', borderRadius: '10px' }} //padding: '1rem',
          isDraggable={!editingItem}
          onLayoutChange={(layout) => handleLayout(layout)}
        >
          {data.map((item, index) => {
            return (
              <Card
                key={index}
                bodyStyle={{ flex: 1, backgroundColor: item.highlighted ? '#424f5d' : 'white', overflowY: 'overlay' }}
                //   cover={<img alt='card image' src={item.image} />}
                actions={[
                  <Tooltip title={item.edit ? 'Save' : 'Edit note'}>
                    <Icon
                      type={item.edit ? 'save' : 'edit'}
                      key='edit'
                      style={{ maxWidth: '1rem' }}
                      onClick={item.edit ? () => handleSave(item) : () => handleEdit(item)}
                    />
                  </Tooltip>,
                  <Popconfirm title='Delete note?' onConfirm={() => handleDelete(item)} okText='Yes' cancelText='No'>
                    <Icon type='delete' key='delete' style={{ maxWidth: '1rem' }} />
                  </Popconfirm>,
                ]}
                style={{ pointerEvents: editingItem && !item.edit ? 'none' : 'auto' }}
              >
                <Meta
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
                      <span style={(item.highlighted && { color: '#d4d4d4' }) || {}}>{item.description}</span>
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
