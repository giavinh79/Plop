import React from 'react'
import { layout, subheader } from '../../globalStyles'
import 'antd/dist/antd.css'
import { Divider, Tooltip, Icon, Input, Switch } from 'antd'
import MemberSlider from './MemberSlider'

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
                {/* , padding: '1rem' */}
                <div style={{display: 'flex', flexWrap: 'wrap', width: '100%', border: '1px solid #ccc', borderRadius: '10px'}}>
                    <div style={{backgroundColor: 'white', flex: '1', borderBottomLeftRadius: '10px', borderTopLeftRadius: '10px', padding: '1rem'}}>
                        <div style={styles.wrapper}><p style={styles.text}>Room name: </p><Input type='password'/></div>
                        <div style={styles.wrapper}><p style={styles.text}>Room description: </p><Input.TextArea type='password' autosize={{ minRows: 10 }} /></div>
                    </div>
                    {/* <div style={{margin: '1rem 1rem', borderRight: '1px solid #ccc'}}></div> */}
                    <div style={{backgroundColor: 'white', flex: '1', borderTopRightRadius: '10px', borderBottomRightRadius: '10px', padding: '1rem'}}>
                        <div style={styles.wrapper}><p style={styles.text}>Room password: </p><Input.Password autoComplete='new-password' type='password'/></div>
                        <div style={styles.wrapper}>
                            <div style={{flex: 1, padding: '1rem 0'}}>
                                <div><p style={styles.text}>Limit max members: </p><MemberSlider style={{marginRight: '1rem'}}/></div>
                            </div>
                            <div style={{flex: 1, padding: '1rem 0'}}>
                                <div style={styles.wrapperC}>
                                    <Switch />
                                    <p style={styles.textC}>Enable private room <span>
                                        <Tooltip title="Lock room and prevent new members">
                                        <Icon type="question-circle-o" style={{paddingRight: '0.3rem'}}/>
                                    </Tooltip></span></p>
                                </div>
                                <div style={styles.wrapperC}><Switch defaultChecked /><p style={styles.textC}>Enable logs</p></div>
                                <div style={styles.wrapperC}><Switch /><p style={styles.textC}>Enable member approval</p></div>
                            </div>
                        </div>
                        

                    </div>
                {/* <div style={styles.settingWrapper}><p style={{marginRight: '1rem'}}>Room name: </p><Input style={{width:'25%'}} type='password'/></div>
                <div style={styles.settingWrapper}><p style={{marginRight: '1rem'}}>Room description: </p><Input style={{width:'25%'}} type='password'/></div>
                    <div style={styles.settingWrapper}><p style={{marginRight: '1rem'}}>Room password: </p><Input style={{width:'25%'}} type='password'/></div>
                    <div style={styles.settingWrapper}><p style={{marginRight: '1rem'}}>Limit max members: </p><MemberSlider /></div>
                    <div style={styles.settingWrapper}><p style={{marginRight: '1rem'}}>Enable private room: </p>
                        <Tooltip title="Locks member joins and prevents member invites">
                            <Icon type="question-circle-o" />
                        </Tooltip>
                        <Switch />
                    </div>
                    <div style={styles.settingWrapper}><p style={{marginRight: '1rem'}}>Enable logs: </p><Switch defaultChecked /></div>
                    <div style={styles.settingWrapper}><p style={{marginRight: '1rem'}}>Enable admin approval for new members: </p><Switch /></div> */}
                </div>
                {/* <img src="plannedlayout.png" alt="layout"/> */}
            </div>
        );
    }
}

const styles = {
    wrapper : {
        display: 'flex',
        flexWrap: 'wrap'
        // alignItems: 'center'
        // justifyContent: 'space-between'
    },
    wrapperC : {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center'
        // justifyContent: 'space-between'
    },
    text : {
        margin: '0.5rem 1rem 0.5rem 0',
        // color: 'white',
        minWidth: '10rem',
        fontSize: '1.2rem'
    },
    textC : {
        margin: '0.5rem 0rem 0.5rem 1rem',
        // color: 'white',
        minWidth: '10rem',
        fontSize: '1.2rem'
    }
}

// use styled-components and turn wrapperC and textC into a conditional statement with props