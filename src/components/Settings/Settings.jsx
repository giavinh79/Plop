import React from 'react'
import { layout, subheader } from '../../globalStyles'
import 'antd/dist/antd.css'
import { Typography, Tooltip, Icon, Input, Switch } from 'antd'
import MemberSlider from './MemberSlider'

const { Paragraph } = Typography

export default class Settings extends React.Component {
  componentDidMount() {
    // API Call here
  }

  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    return (
      <div style={layout}>
        <p style={subheader}>Team Settings</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', border: '1px solid #ccc', borderRadius: '10px', color: '#757575' }}>
          <div style={{ backgroundColor: 'white', flex: '1', borderBottomLeftRadius: '10px', borderTopLeftRadius: '10px', padding: '1rem' }}>
            <div style={styles.wrapper}><p style={styles.text}>Room name: </p><Input type='password' /></div>
            <div style={styles.wrapper}><p style={styles.text}>Room description: </p><Input.TextArea type='text' autosize={{ minRows: 10 }} /></div>
          </div>
          <div style={{ backgroundColor: 'white', flex: '1', borderTopRightRadius: '10px', borderBottomRightRadius: '10px', padding: '1rem' }}>
            <div style={styles.wrapper}><p style={styles.text}>Room password: </p><Input.Password autoComplete='new-password' type='password' /></div>
            <div style={styles.wrapper}>
              <div style={{ flex: 1, padding: '1rem 0' }}>
                <div style={styles.wrapperC}><p style={styles.text}>Room ID: </p><Paragraph copyable={{ text: '42jf1k23ll18d92' }} style={{ margin: 0 }}>42jf1k23ll18d92</Paragraph></div>
                <div><p style={styles.text}>Limit max members: </p><MemberSlider style={{ marginRight: '1rem' }} /></div>
              </div>
              <div style={{ flex: 1, padding: '1rem 0' }}>
                <div style={styles.wrapperC}>
                  <Switch />
                  <p style={styles.textC}>Enable private room <span>
                    <Tooltip title="Lock room and prevent new members">
                      <Icon type="question-circle-o" style={{ paddingRight: '0.3rem' }} />
                    </Tooltip></span></p>
                </div>
                <div style={styles.wrapperC}><Switch defaultChecked /><p style={styles.textC}>Enable logs</p></div>
                <div style={styles.wrapperC}><Switch /><p style={styles.textC}>Enable member approval</p></div>
              </div>
            </div>
          </div>
        </div>
        {/* <img src="plannedlayout.png" alt="layout"/> */}
      </div>
    );
  }
}

const styles = {
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap'
    // alignItems: 'center'
    // justifyContent: 'space-between'
  },
  wrapperC: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center'
    // justifyContent: 'space-between'
  },
  text: {
    margin: '0.5rem 1rem 0.5rem 0',
    fontWeight: 500,
    minWidth: '10rem',
    fontSize: '1.1rem'
  },
  textC: {
    margin: '0.5rem 0rem 0.5rem 1rem',
    // color: 'white',
    minWidth: '10rem',
    fontSize: '1.1rem'
  }
}

// use styled-components and turn wrapperC and textC into a conditional statement with props