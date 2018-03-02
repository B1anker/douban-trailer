import { Badge, Card, Col, Icon, Row } from 'antd'
import moment = require('moment')
import React = require('react')
import { Link } from 'react-router-dom'

import 'moment/locale/zh-cn'
(moment as any).default.locale('zh-cn')

interface ContentProps {
  movies: any[]
}

const site = 'https://cdn.b1anker.com'

export default class Content extends React.Component<ContentProps, any> {
  public render () {
    return (
      <div style={{ padding: 10 }}>
        { this.renderContent }
      </div>
    )
  }

  private renderContent () {
    const { movies } = this.props
    return (
      <div style={{ padding: '30px' }}>
        <Row>
          {
            movies.map((it, i) => (
              <Col
                key={i}
                xl={{span: 6}}
                lg={{span: 6}}
                md={{span: 12}}
                sm={{span: 24}}
                style={{marginBottom: '8px'}}
              >
                <Card
                  bordered={false}
                  hoverable={true}
                  style={{ width: '100%' }}
                  actions={[
                    (
                      <Badge>
                        <Icon style={{ marginRight: '2px' }} type='clock-circle' />
                        { moment(it.meta.createdAt).fromNow(true) } 前更新
                      </Badge>
                    ),
                    (
                      <Badge>
                        <Icon style={{ marginRight: '2px' }} type='star' />
                        { it.rate } 分
                      </Badge>
                    )
                  ]}
                  cover={ (<img src={ site + it.posterKey + '?imageMongr2/thumdnail/x1680/crop/1080x1600'} />) }
                >
                  <Card.Meta
                    style={{ height: '202px', overflow: 'hidden' }}
                    title={ <Link to={`/detail/${it._id}`} >{ it.title }</Link> }
                    description={ <Link to={`/detail/${it._id}`} >{ it.summary }</Link> }/>
                </Card>
              </Col>
            ))
          }
        </Row>
      </div>
    )
  }
}
