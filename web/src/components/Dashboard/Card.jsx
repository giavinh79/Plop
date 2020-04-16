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

/* New card design
 * cardTop header color: #5885b1
 * boxShadow to entire card: rgba(0, 0, 0, 0.3) 0px 1px 4px
 * border-radius: 0
 * color: white
 * no border anymore
 */

/* Old card design
 * border-radius: 5px
 * header color: #c9dde4
 * border: 1px solid #ccc
 * color: black
 */

const styles = {
  cardTop: {
    display: 'flex',
    color: '#f3f3f3',
    justifyContent: 'space-between',
    padding: '16px',
    fontWeight: 'bold',
    backgroundColor: '#5885b1',
  },
  cardBody: {
    display: 'flex',
    padding: '16px',
    minHeight: '5rem',
    wordBreak: 'break-word',
  },
  cardIcon: {
    // color: '#6b7080',
    color: '#f3f3f3',
    margin: '-0.5rem -0.5rem 0 0',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
};

Card.propTypes = {
  title: PropTypes.string,
  shortDescription: PropTypes.string,
};
