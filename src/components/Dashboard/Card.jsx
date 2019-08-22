import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'antd'

export function Card(props) {
  return (
    <>
      <div style={styles.cardTop}>
        <div>{props.data.title}</div>
        <div>
          <Icon
            type="info-circle"
            style={styles.cardIcon}
            onClick={() => props.changePage(11, props.data)}
          />
        </div>
      </div>
      <div style={styles.cardBody}>{props.data.content}</div>
    </>
  )
}

const styles = {
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px',
    fontWeight: 'bold',
    backgroundColor: '#c9dde4'
  },
  cardBody: {
    display: 'flex',
    padding: '16px'
  },
  cardIcon: {
    color: '#6b7080',
    margin: '-0.5rem -0.5rem 0 0',
    fontSize: '1.5rem',
    cursor: 'pointer'
  }
}

Card.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string
}
