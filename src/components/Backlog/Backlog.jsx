import React from 'react'
import axios from 'axios'
import { Popconfirm, Table as BacklogTable, Divider, Tag } from 'antd';
import { layout, subheader } from '../../globalStyles'
import 'antd/dist/antd.css';
import './style.css'

const tagMap = { bug: 'volcano', database: 'green', frontend: 'blue', backend: 'orange', testing: 'purple', security: 'red', documentation: 'gold', research: 'gray' }

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
						<Tag color={color} key={tag}>
							{tag.toUpperCase()}
						</Tag>
					);
				})}
			</span>
		),
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
					title="Make task active (dashboard)?"
					// onConfirm={confirm}
					// onCancel={cancel}
					okText="Yes"
					cancelText="No"
				>
					<a href="/">Activate</a>
				</Popconfirm>
			</span>
		),
	},
];

// let data = [
	// {
	// 	key: '1',
	// 	title: 'Create favicon',
	// 	description: 'Convert .png to .ico',
	// 	date: '04/08/2019',
	// 	tags: ['frontend', 'minor'],
	// },
	// {
	// 	key: '2',
	// 	title: 'Google SSO',
	// 	description: 'Implement SSO in login screen',
	// 	date: '04/12/2019',
	// 	tags: ['major'],
	// },
	// {
	// 	key: '3',
	// 	title: 'Server load testing',
	// 	description: 'Test with some NPM module',
	// 	date: '04/14/2019',
	// 	tags: ['backend', 'minor'],
	// },
// ];

const pagination = {
	pageSize: 8,
	hideOnSinglePage: true
}

export default class Backlog extends React.Component {
	componentDidMount() {
    axios.get('/teamIssue/0', { withCredentials: true })
      .then(res => {
        res.data.map((item, index) => {
          item.key = index
          item.date = item.created_at.substring(0, 10)
          return item
        })
        this.setState({ data: res.data })
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
				<p style={subheader}>Backlog</p>
				<BacklogTable columns={columns} dataSource={this.state.data} pagination={pagination} style={{ border: '1px solid #ccc', borderRadius: '5px' }} />
			</div>
		);
	}
}

