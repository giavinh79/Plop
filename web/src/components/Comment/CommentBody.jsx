import React from 'react';
import { Comment, Icon, Input, List, Tooltip } from 'antd';
import moment from 'moment';

export default function CommentBody() {
  const data = [
    {
      actions: [<span key='comment-list-reply-to-0'>Reply</span>],
      author: 'Han Solo',
      avatar: 'images/avatars/monster2.svg',
      content: (
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta, optio quis aut eveniet enim praesentium error
          incidunt officia, culpa, alias accusantium. Doloremque sunt dolorem dolore nesciunt error, saepe quasi illum!
        </p>
      ),
      datetime: (
        <Tooltip
          title={moment()
            .subtract(1, 'days')
            .format('YYYY-MM-DD HH:mm:ss')}
        >
          <span>
            {moment()
              .subtract(1, 'days')
              .fromNow()}
          </span>
        </Tooltip>
      ),
    },
    {
      actions: [<span key='comment-list-reply-to-0'>Reply</span>],
      author: 'San Holo',
      avatar: 'images/avatars/monster1.svg',
      content: (
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Esse architecto perferendis culpa debitis laborum?
          Animi, dolorem rerum minus eaque consequatur, commodi, quas magnam asperiores fuga necessitatibus esse
          molestiae beatae harum?
        </p>
      ),
      datetime: (
        <Tooltip
          title={moment()
            .subtract(2, 'days')
            .format('YYYY-MM-DD HH:mm:ss')}
        >
          <span>
            {moment()
              .subtract(2, 'days')
              .fromNow()}
          </span>
        </Tooltip>
      ),
    },
  ];

  return (
    // <div>
    <div style={{ margin: '0 2rem', padding: '0 1rem 3rem 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Comment here</h3>
        <Input style={{ maxWidth: '50rem', margin: '1rem' }} />
        <Icon type='enter' style={{ cursor: 'pointer' }} />
      </div>
      <List
        className='comment-list'
        itemLayout='horizontal'
        dataSource={data}
        renderItem={item => (
          <li>
            <Comment
              actions={item.actions}
              author={item.author}
              avatar={item.avatar}
              content={item.content}
              datetime={item.datetime}
            />
          </li>
        )}
      />
    </div>
    // </div>
  );
}
