import React, { useEffect, useState } from 'react';
import { Comment, Icon, Input, List, Skeleton, Spin, Tooltip } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { API_ENDPOINT } from '../../constants';
import { displaySimpleNotification } from '../../utility/services';

export default function CommentBody({ id }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);

  useEffect(() => {
    (async () => {
      const comments = await axios.get(`${API_ENDPOINT}/comments/${id}`);
      setLoadingComments(false);
      let dataSource = [];
      for (let item of comments.data) {
        dataSource.unshift({
          // actions: [<span key='comment-list-reply-to-0'>Reply</span>],
          author: item.author,
          avatar: `/images/avatars/monster${item.avatar}.svg`,
          content: <p>{item.content}</p>,
          datetime: (
            <Tooltip title={moment(item.time).format('YYYY-MM-DD HH:mm:ss')}>
              <span>{moment(item.time).fromNow()}</span>
            </Tooltip>
          ),
        });
      }
      setComments(dataSource);
    })().catch((err) => {
      console.log(err);
    });
  }, [id]);

  const handleComment = async () => {
    if (comment.trim() === '') return;

    try {
      setLoadingUserInfo(true);
      const {
        data: { avatar, email, date },
      } = await axios.get(`${API_ENDPOINT}/user/info`);
      setLoadingUserInfo(false);

      const commentObject = {
        // actions: [<span key='comment-list-reply-to-0'>Reply</span>],
        author: email,
        avatar: `/images/avatars/monster${avatar}.svg`,
        content: <p>{comment}</p>,
        datetime: (
          <Tooltip title={moment(date).format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment(date).fromNow()}</span>
          </Tooltip>
        ),
      };

      await axios.post(`${API_ENDPOINT}/comment`, {
        id: id,
        comment: { author: email, avatar: avatar, content: comment, time: date },
      });
      setComments([commentObject, ...comments]);
      setComment('');
    } catch (err) {
      displaySimpleNotification('Error', 4, 'bottomRight', `Unable to post comment. (${err})`, 'warning', '#108ee9');
    }
  };

  return (
    <div style={{ margin: '0 2rem', padding: '0 1rem 3rem 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Comment here</h3>
        <Input
          style={{ maxWidth: '50rem', margin: '1rem' }}
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />
        <Icon type='enter' style={{ cursor: 'pointer', paddingRight: '1rem' }} onClick={handleComment} />
        {loadingUserInfo && <Spin />}
      </div>

      {loadingComments ? (
        <Skeleton active avatar />
      ) : (
        <List
          className='comment-list'
          itemLayout='horizontal'
          dataSource={comments}
          renderItem={(item) => (
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
      )}
    </div>
  );
}
