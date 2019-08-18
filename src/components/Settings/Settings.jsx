import React from 'react'
import { layout, subheader } from '../../globalStyles'
import 'antd/dist/antd.css'
import { Tooltip, Icon, Input, Switch } from 'antd'
import MemberSlider from './MemberSlider';

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
                <div style={{width: '100%', padding: '1rem', border: '1px solid #ccc', borderRadius: '10px'}}>
                <div style={styles.settingWrapper}><p style={{marginRight: '1rem'}}>Room name: </p><Input style={{width:'25%'}} type='password'/></div>
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
                    <div style={styles.settingWrapper}><p style={{marginRight: '1rem'}}>Enable admin approval for new members: </p><Switch /></div>
                </div>
                <img src="plannedlayout.png" alt="layout"/>
            </div>
        );
    }
}

const styles = {
    settingWrapper : {
        display: 'flex',
        // justifyContent: 'space-between'
    }
}
