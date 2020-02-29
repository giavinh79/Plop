import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { layout, subheader } from '../../globalStyles';
import 'antd/dist/antd.css';
import { Button, Typography, Tooltip, Icon, Input, Skeleton, Switch } from 'antd';
import MemberSlider from './MemberSlider';
import { displaySimpleNotification } from '../../utility/services';
import { API_ENDPOINT } from '../../utility/constants';

const { Paragraph } = Typography;

export default function Settings() {
  const [state, setState] = useState({
    name: '',
    description: '',
    decryptPass: '',
    id: 'default',
    maxMembers: '4',
    adminApproval: false,
    private: false,
  });

  useEffect(() => {
    (async function() {
      const res = await axios.post(`${API_ENDPOINT}/roomInfo`);
      res.data.private = !!res.data.private;
      res.data.adminApproval = !!res.data.adaminApproval;
      setState(res.data);
    })().catch(err => {
      displaySimpleNotification('Error', 4, 'bottomRight', `Unable to retrieve team info. (${err})`, 'warning', 'red');
    });
  }, []);

  return (
    <div style={layout}>
      <p style={{ ...subheader, opacity: state.id === 'default' ? 0.3 : 1 }}>Team Settings</p>
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
          {state.id === 'default' ? (
            <>
              <Skeleton active />
              <Skeleton active />
            </>
          ) : (
            <>
              <div style={styles.wrapper}>
                <p style={styles.text}>Team name: </p>
                <Input type='text' value={state.name} />
              </div>
              <div style={styles.wrapper}>
                <p style={styles.text}>Team description: </p>
                <Input.TextArea type='text' value={state.description} autosize={{ minRows: 10 }} />
              </div>
            </>
          )}
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
          {state.id === 'default' ? (
            <>
              <Skeleton active />
              <Skeleton active />
            </>
          ) : (
            <>
              <div style={styles.wrapper}>
                <p style={styles.text}>Team password: </p>
                <Input.Password value={state.decryptPass} autoComplete='new-password' type='password' />
              </div>
              <div style={styles.wrapper}>
                <div style={{ flex: 1, padding: '0.5rem 0' }}>
                  <div style={styles.wrapperC}>
                    <p style={styles.text}>Team ID: </p>
                    <Paragraph
                      copyable={{ text: state.id || 'default' }}
                      style={{ margin: 0, maxWidth: '10rem', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {state.id}
                    </Paragraph>
                  </div>
                  <div>
                    <p style={styles.text}>Limit max members: </p>
                    <MemberSlider style={{ marginRight: '1rem' }} />
                  </div>
                  <div>
                    <p style={styles.text}>Repository Link: </p>
                    <a href='https://github.com' target='_blank' rel='noopener noreferrer'>
                      https://github.com
                    </a>
                  </div>
                </div>
                <div style={{ flex: 1, padding: '0.5rem 0' }}>
                  <div style={styles.wrapperC}>
                    <Switch defaultChecked={state.private} />
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
                    <Switch defaultChecked={state.adminApproval} />
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
            </>
          )}
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

const styles = {
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    paddingBottom: '1rem',
  },
  wrapperC: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingBottom: '0.5rem',
  },
  text: {
    margin: '0.5rem 1rem 0.5rem 0',
    fontWeight: 500,
    minWidth: '10rem',
    fontSize: '1.1rem',
  },
  textC: {
    margin: '0.5rem 0rem 0.5rem 1rem',
    minWidth: '10rem',
    fontSize: '1.1rem',
  },
};

// use styled-components and turn wrapperC and textC into a conditional statement with props
