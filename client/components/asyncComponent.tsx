import React = require('react')

interface AsyncComponentState {
  Child: any
}

export default (loadComponent, placeholder = '拼命加载中') => {
  return class AsyncComponent extends React.Component<any, AsyncComponentState> {
    private unmount: boolean = false

    constructor (props) {
      super(props)
      this.state = {
        Child: null
      }
    }

    public componentWillUnmount () {
      this.unmount = true
    }

    public async componentDidMount () {
      const { default: Child } = await loadComponent()

      if (this.unmount) {
        return
      }

      this.setState({
        Child
      })
    }

    public render () {
      const { Child } = this.state
      if (Child) {
        return (<Child {...this.props} />)
      }
      return placeholder
    }
  }
}