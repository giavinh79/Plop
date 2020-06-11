import React, { useState } from 'react';
import { Avatar, Card, Icon, Input, Popconfirm, Tooltip } from 'antd';
import GridLayout, { WidthProvider } from 'react-grid-layout';
import ColorModal from './ColorModal';
import './grid-styles.css';
import './resizable-styles.css';

const ReactGridLayout = WidthProvider(GridLayout);

function NotesGrid({
  adminTier,
  data,
  editingItem,
  handleCancel,
  handleDelete,
  handleColorEdit,
  handleEdit,
  handleLayout,
  handleSave,
  layoutData,
  parsedDescription,
}) {
  const [colorModal, setColorModal] = useState(null);

  return (
    <>
      {colorModal && (
        <ColorModal data={colorModal} handleColorEdit={handleColorEdit} setColorModal={setColorModal} items={data} />
      )}
      <ReactGridLayout
        layout={layoutData}
        cols={12}
        rowHeight={150}
        width={1000}
        style={{ border: '1px solid #e8e8e8', borderRadius: '10px', minHeight: '15rem', minWidth: '50rem' }}
        isDraggable={!editingItem}
        onLayoutChange={(layout) => handleLayout(layout)}
        bodyStyle={{ backgroundColor: 'red' }}
      >
        {data.map((item, index) => {
          return (
            <Card
              key={index}
              bodyStyle={{
                flex: 1,
                backgroundColor: item.backgroundColor,
                overflowY: 'overlay',
                border: item.highlighted ? '2px solid rgba(81, 203, 238, 1)' : '',
                boxShadow: item.highlighted ? '0 0 5px rgba(81, 203, 238, 1)' : '',
              }}
              actions={[
                <Tooltip title={item.edit ? 'Save' : 'Edit text'}>
                  <Icon
                    type={item.edit ? 'save' : 'edit'}
                    key='edit'
                    style={{ maxWidth: '1rem' }}
                    onClick={item.edit ? () => handleSave(item) : () => handleEdit(item)}
                    disabled={adminTier < 3}
                  />
                </Tooltip>,
                <Icon type='bg-colors' disabled={adminTier < 3} onClick={() => setColorModal(item)} />,
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
                    <span style={{ fontSize: '1.1rem', color: item.titleColor || 'rgba(0,0,0,.85)' }}>
                      {item.title}
                    </span>
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
                        color: item.contentColor || 'rgba(0,0,0,.60)',
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
    </>
  );
}

export default React.memo(NotesGrid);
