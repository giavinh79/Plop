import React from 'react'
import axios from 'axios'
import { Tooltip, Icon, Popconfirm, Table as ActiveTable, Divider, Tag } from 'antd';
import { layout, subheader } from '../../globalStyles'
import 'antd/dist/antd.css';
// import './style.css'

const tagMap = { bug: 'volcano', database: 'green', frontend: 'blue', backend: 'orange', testing: 'purple', security: 'red', documentation: 'gold', research: 'gray' }
const progressMap = { 1: 'Active', 2: 'In Progress', 3: 'Completed'}

const columns = [
	{
		title: 'Title',
		dataIndex: 'title',
		key: 'title',
		render: text => <a href="/">{text}</a>,
	},
	{
		title: 'Description',
		dataIndex: 'description',
		key: 'description',
	},
	{
		title: 'Date',
		dataIndex: 'date',
		key: 'date',
	},
	{
		title: 'Tags',
		key: 'tag',
		dataIndex: 'tag',
		render: tag => (
			<span>
				{tag.map(tag => {
					let color = tagMap[tag.toLowerCase()]
					if (color == null) color = 'geekblue';
					return (
						<Tag color={color} key={tag} style={{ margin: '4px 8px 4px 0' }}>
							{tag.toUpperCase()}
						</Tag>
					);
				})}
			</span>
		),
    },
    {
		title: 'Status',
		dataIndex: 'status',
        key: 'status',
        render: status => {
            return <p>{progressMap[status]}</p>
        }
	},
	{
		title: 'Action',
		key: 'action',
		render: () => (
			<span>
				<a href="/">Edit</a>
				<Divider type="vertical" />
				<Popconfirm
					title="Are you sure you want to delete this task?"
					// onConfirm={confirm}
					// onCancel={cancel}
					okText="Yes"
					cancelText="No"
				>
					<a href="/">Delete</a>
				</Popconfirm>
                <Divider type="vertical" />
                <Popconfirm
					title="Promote to next stage?"
					// onConfirm={confirm}
					// onCancel={cancel}
					okText="Yes"
					cancelText="No"
				>
					<a href="/">Progress</a>
				</Popconfirm>
			</span>
		),
    },
    {
        title: '',
        key: 'priority',
        dataIndex: 'priority',
        render: priority => {
            return <div style={{display: 'flex', justifyContent: 'center', cursor: 'pointer'}}>
            <Tooltip title={ priority ? 'Major Priority' : 'Minor Priority'} mouseEnterDelay={0.8}>
                { priority ? <div style={{ height: '1rem', width: '1rem', backgroundColor: '#b23f3f', borderRadius: '50%' }}></div>
                : <div style={{ height: '1rem', width: '1rem', backgroundColor: '#40b33f', borderRadius: '50%' }}></div> }
            </Tooltip>
            </div>
        }
    }
];

// let data = [
// 	{
// 		key: '1',
// 		title: 'Create favicon',
// 		description: 'Convert .png to .ico',
//         date: '04/08/2019',
//         status : 'Active',
// 		tags: ['frontend', 'minor'],
// 	},
// 	{
// 		key: '2',
// 		title: 'Google SSO',
// 		description: 'Implement SSO in login screen',
//         date: '04/12/2019',
//         status : 'In Progress',
// 		tags: ['major'],
// 	},
// 	{
// 		key: '3',
// 		title: 'Server load testing',
// 		description: 'Test with some NPM module',
//         date: '04/14/2019',
//         status : 'Active',
// 		tags: ['backend', 'minor'],
// 	},
// ];

const pagination = {
	pageSize: 8,
	hideOnSinglePage: true
}

export default class Active extends React.Component {
	componentDidMount() {
    axios.get('/teamIssue/1', { withCredentials: true })
      .then(res => {
        let activeIssues = [...res.data.activeItems, ...res.data.completedItems, ...res.data.progressItems]
        console.log(activeIssues)
        activeIssues.map((item, index) => {
          item.key = index
          item.date = item.created_at.substring(0, 10)
          return item
        //   item.progress = 
        })

        this.setState({ data: activeIssues })
      })
      .catch(err => {
        console.log(err)
      })
	}

	constructor(props) {
		super(props)
		this.state = {
            data : []
		}
	}

	render() {
		return (
			<div style={layout}>
				<p style={subheader}>Active Issues</p>
				<ActiveTable columns={columns} dataSource={this.state.data} pagination={pagination} style={{ border: '1px solid #ccc', borderRadius: '5px' }} />
			</div>
		);
	}
}

