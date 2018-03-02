import React = require('react')

import 'antd/dist/antd.css'
import {
  Route,
  Switch
} from 'react-router-dom'
import './assets/common.sass'
import routes from './routes'

export default () => (
  <Switch>
    {
      routes.map(({ name, path, exact = true, component }) => {
        return <Route path={path} exact={exact} component={component} key={name}/>
      })
    }
  </Switch>
)