import React from 'react'
import { Comment, Tooltip, List } from 'antd'
import moment from 'moment'

export default class CommentBody extends React.Component {
  render() {
    const data = [
      {
        actions: [<span key="comment-list-reply-to-0">Reply</span>],
        author: 'Han Solo',
        avatar: 'images/avatars/monster2.svg',
        content: (
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta, optio quis aut eveniet enim praesentium error incidunt officia, culpa, alias accusantium. Doloremque sunt dolorem dolore nesciunt error, saepe quasi illum!
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
        actions: [<span key="comment-list-reply-to-0">Reply</span>],
        author: 'San Holo',
        avatar: 'images/avatars/monster1.svg',
        content: (
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Esse architecto perferendis culpa debitis laborum? Animi, dolorem rerum minus eaque consequatur, commodi, quas magnam asperiores fuga necessitatibus esse molestiae beatae harum?
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
      <div style={{ border: '1px solid #ccc', maxWidth: '80rem', margin: '2rem', padding: '1rem', borderRadius: '10px' }}>
        {/* <h2>Comments - </h2> */}
        <List
          className="comment-list"
          header={<h3>Comments</h3>}
          itemLayout="horizontal"
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
        />,
      </div>
    )
  }
}
