import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Icon, Tag } from 'antd';
import { CardHeader, CardBody } from './CardStyles';
import { compareDates } from '../../utility/services';

export function Card({ data }) {
  const [toIssue, setToIssue] = useState(false);
  const { id, deadline, title, shortDescription } = data;

  return (
    <>
      {toIssue && (
        <Redirect
          push
          to={{
            pathname: `/dashboard/issue/${id}`,
            data,
          }}
        />
      )}
      <CardHeader overdue={deadline && compareDates(deadline) ? 1 : 0}>
        <div>{title}</div>
        <div>
          <Icon type='info-circle' style={styles.cardIcon} onClick={() => setToIssue(true)} />
        </div>
      </CardHeader>
      <CardBody>
        <p>
          {deadline && compareDates(deadline) && (
            <Tag color='red' style={{ position: 'relative', bottom: 0, right: 0, maxHeight: '24px' }}>
              overdue
            </Tag>
          )}
          {shortDescription}
        </p>
      </CardBody>
    </>
  );
}

Card.propTypes = {
  title: PropTypes.string,
  shortDescription: PropTypes.string,
};

const styles = {
  cardIcon: {
    color: '#f3f3f3',
    margin: '-0.5rem -0.5rem 0 0',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
};
