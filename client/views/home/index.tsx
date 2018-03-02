import {
  Menu
} from 'antd'
import React = require('react')
import Layout from '../../layouts/default'
import { request } from '../../lib'
import Content from './content'

interface HomeState {
  movies: null | any[],
  years: string[],
  type: any,
  year: number | string,
  selectedKey: string
}

export default class Home extends React.Component<any, HomeState> {
  constructor (props) {
    super(props)
    this.state = {
      years: ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'],
      type: this.props.match.params.type,
      year: this.props.match.params.year,
      movies: [],
      selectedKey: ''
    }
  }

  public componentDidMount () {
    this.getAllMovies()
  }

  public render () {
    const { years, selectedKey } = this.state
    return (
      <Layout {...this.props}>
        <div className='flex-rot full'>
          <Menu
            defaultSelectedKeys={[selectedKey]}
            mode='inline'
            style={{ height: '100%', overflowY: 'scroll', maxWidth: 230 }}
            onSelect={this.selectItem}
            className='align-self-start'
          >
            {
              years.map((y, i) => {
                <Menu.Item key={i}>
                  <a href={`/year/${y}`}>{ y } 年上映</a>
                </Menu.Item>
              })
            }
          </Menu>
          <div className='flex-1 scroll-y align-self-start'>
            { this.renderContent() }
          </div>
        </div>
      </Layout>
    )
 }

  private renderContent = () => {
    const { movies } = this.state
    if (!movies || !movies.length) {
      return null
    }
    return (
      <Content
        movies={ movies } />
    )
  }

  private getAllMovies = () => {
    request((window as any).__LOADING__)({
      method: 'get',
      url: `/api/v0/movies?type=${this.state.type || ''}&year=${this.state.year || ''}`
    }).then((res) => {
      this.setState({
        movies: res
      })
    }).catch((err) => {
      this.setState({
        movies: []
      })
    })
  }

  private selectItem = ({ key }) => {
    this.setState({
      selectedKey: key
    })
  }
}