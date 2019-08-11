import React from 'react'
import { Card, Icon } from 'antd'

export default function Homepage() {
    const exampleRooms = [
        '12345', '14321', '13425'
    ]

    return (
        <div style={styles.formContainer}>
            <Card title="Make a room" style={{ margin: '1rem', width: 300 }}>
                <p>Create</p>
                <Icon type="plus-circle" style={{ fontSize: '2rem', color: '#5bb35b' }} />
            </Card>
            { exampleRooms.map((room, index) => {
                return <Card title='Room' key={index} style={{ margin: '1rem', width: 300 }}>
                    <a href="/">Enter room {room}</a>
                </Card>
            })}
        </div>
    )
}

const styles = {
    formContainer : {
        display: 'flex',
        flexWrap: 'wrap',
        width:'100%',
        backgroundImage: 'url(\'images/wallpaper.png\')',
        backgroundPosition: '0 0'
    }
  }