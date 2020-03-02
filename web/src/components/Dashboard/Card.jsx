import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

export function Card({ data, changePage, source }) {
  return (
    <>
      <div style={styles.cardTop}>
        <div>{data.title}</div>
        <div>
          <Icon type='info-circle' style={styles.cardIcon} onClick={() => changePage(11, data, source)} />
        </div>
      </div>
      <div style={styles.cardBody}>{data.shortDescription}</div>
    </>
  );
}

const styles = {
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px',
    fontWeight: 'bold',
    backgroundColor: '#c9dde4',
  },
  cardBody: {
    display: 'flex',
    padding: '16px',
  },
  cardIcon: {
    color: '#6b7080',
    margin: '-0.5rem -0.5rem 0 0',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
};

Card.propTypes = {
  title: PropTypes.string,
  shortDescription: PropTypes.string,
};
