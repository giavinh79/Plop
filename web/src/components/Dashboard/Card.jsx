import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Icon } from 'antd';
import { CardHeader, CardBody } from './CardStyles';

export function Card({ data }) {
  const [toIssue, setToIssue] = useState(false);
  const { id, title, shortDescription } = data;

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
      <CardHeader>
        <div>{title}</div>
        <div>
          <Icon type='info-circle' style={styles.cardIcon} onClick={() => setToIssue(true)} />
        </div>
      </CardHeader>
      <CardBody>{shortDescription}</CardBody>
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
