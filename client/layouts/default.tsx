import {
  Menu,
  Spin
} from 'antd'
import React = require('react')
import { Link } from 'react-router-dom'
import navRoutes from '../nav'


interface LayoutDefaultState {
  loading: boolean,
  tip: string
}

const getMenuContent = ({ path, name }) => (
  <a href={ path || '/' } style={{ color: '#fff2e8' }}>
    { name }
  </a>
)

export default class Layout extends React.Component<any, LayoutDefaultState> {
  private matchRouteName = this.props.match ? navRoutes.find(e => e.name === this.props.match.params.type) ? navRoutes.find(e => e.name === this.props.match.params.type).name : '全部' : navRoutes[0].name

  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      tip: '请稍等'
    }
  }

  public componentDidMount () {
    (window as any).__LOADING__ = this.toggleLoading
  }

  public componentWillUnmount () {
    (window as any).__LOADING__ = null
  }

  public render () {
    const { children } = this.props
    const { loading, tip } = this.state
    return (
      <div className='flex-colume' style={{ width: '100%', height: '100%' }}>
        <Menu
          style={{ fontSize: 13.5, backgroundColor: '#000' }}
          mode='horizontal'
          defaultSelectedKeys={[this.matchRouteName]}
          >
          <Menu.Item
            style={{
              marginLeft: 24,
              marginRight: 30,
              fontSize: 18,
              textAlign: 'center',
              color: '#fff !important',
              float: 'left'
            }}
          >
            <a href={'/'} className='hover-scale logo-text' style={{ color: '#fff2e8' }}>预告片</a>
          </Menu.Item>
          {
            navRoutes.map((e, i) => {
              <Menu.Item key={e.name}>
                {
                  getMenuContent({...e})
                }
              </Menu.Item>
            })
          }
        </Menu>
        <Spin
          spinning={loading}
          tip={tip}
          wrapperClassName='content-spin full'
          >

          { children }
        </Spin>
      </div>
    )
  }

  private toggleLoading = (status: boolean = false, tip: string = '请稍等') => {
    this.setState({
      tip,
      loading: status
    })
  }
}