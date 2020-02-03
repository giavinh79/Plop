import React from 'react';
import axios from 'axios';
import { layout, subheader } from '../../globalStyles';
import 'antd/dist/antd.css';
import { Button, Typography, Tooltip, Icon, Input, Switch } from 'antd';
import MemberSlider from './MemberSlider';

const { Paragraph } = Typography;

export default class Settings extends React.Component {
  componentDidMount() {
    axios
      .post('/roomInfo', { withCredentials: true })
      .then(res => {
        // should just change this in the DB maybe
        res.data.private = !!res.data.private;
        res.data.adminApproval = !!res.data.adaminApproval;
        console.log(res);
        this.setState(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      decryptPass: '',
      id: 0,
      maxMembers: '4',
      adminApproval: false,
      private: false,
    };
  }

  render() {
    return (
      <div style={layout}>
        <p style={subheader}>Team Settings</p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: '10px',
            color: '#757575',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              flex: '1',
              borderBottomLeftRadius: '10px',
              borderTopLeftRadius: '10px',
              padding: '1rem',
            }}
          >
            <div style={styles.wrapper}>
              <p style={styles.text}>Team name: </p>
              <Input type='text' value={this.state.name} />
            </div>
            <div style={styles.wrapper}>
              <p style={styles.text}>Team description: </p>
              <Input.TextArea type='text' value={this.state.description} autosize={{ minRows: 10 }} />
            </div>
          </div>
          <div
            style={{
              backgroundColor: 'white',
              flex: '1',
              borderTopRightRadius: '10px',
              borderBottomRightRadius: '10px',
              padding: '1rem',
            }}
          >
            <div style={styles.wrapper}>
              <p style={styles.text}>Team password: </p>
              <Input.Password value={this.state.decryptPass} autoComplete='new-password' type='password' />
            </div>
            <div style={styles.wrapper}>
              <div style={{ flex: 1, padding: '0.5rem 0' }}>
                <div style={styles.wrapperC}>
                  <p style={styles.text}>Team ID: </p>
                  <Paragraph copyable={{ text: '42jf1k23ll18d92' }} style={{ margin: 0 }}>
                    42jf1k23ll18d92
                  </Paragraph>
                </div>
                <div>
                  <p style={styles.text}>Limit max members: </p>
                  <MemberSlider style={{ marginRight: '1rem' }} />
                </div>
                <div>
                  <p style={styles.text}>Repository Link: </p>
                  <a href='https://github.com' target='_blank' rel='noopener'>
                    https://github.com
                  </a>
                </div>
              </div>
              <div style={{ flex: 1, padding: '0.5rem 0' }}>
                <div style={styles.wrapperC}>
                  <Switch defaultChecked={this.state.private} />
                  <p style={styles.textC}>
                    Enable private team{' '}
                    <span>
                      <Tooltip title='Lock room and prevent new members'>
                        <Icon type='question-circle-o' style={{ paddingRight: '0.3rem' }} />
                      </Tooltip>
                    </span>
                  </p>
                </div>
                <div style={styles.wrapperC}>
                  <Switch defaultChecked={true} />
                  <p style={styles.textC}>
                    Enable logs{' '}
                    <span>
                      <Tooltip title='Preserve team history at cost of slightly slower request calls'>
                        <Icon type='question-circle-o' style={{ paddingRight: '0.3rem' }} />
                      </Tooltip>
                    </span>
                  </p>
                </div>
                <div style={styles.wrapperC}>
                  <Switch defaultChecked={this.state.adminApproval} />
                  <p style={styles.textC}>
                    Enable member approval{' '}
                    <span>
                      <Tooltip title='New members will need to be approved by team owner in order to join'>
                        <Icon type='question-circle-o' style={{ paddingRight: '0.3rem' }} />
                      </Tooltip>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 0 1rem 1rem' }}>
          <Button
            key='submit'
            type='primary'
            onClick={() => {
              console.log('Clicked Save');
            }}
          >
            Save
          </Button>
          ,
        </div>
      </div>
    );
  }
}

const styles = {
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',

    paddingBottom: '1rem',
    // alignItems: 'center'
    // justifyContent: 'space-between'
  },
  wrapperC: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingBottom: '0.5rem',
    // justifyContent: 'space-between'
  },
  text: {
    margin: '0.5rem 1rem 0.5rem 0',
    fontWeight: 500,
    minWidth: '10rem',
    fontSize: '1.1rem',
  },
  textC: {
    margin: '0.5rem 0rem 0.5rem 1rem',
    // color: 'white',
    minWidth: '10rem',
    fontSize: '1.1rem',
  },
};

// use styled-components and turn wrapperC and textC into a conditional statement with props
