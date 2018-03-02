import AC from './components/asyncComponent'

export default [
  {
    name: '首页',
    icon: 'home',
    path: '/',
    exact: true,
    component: AC(() => import('./views/home'))
  },
  {
    name: '详情页',
    path: '/detail/:id',
    component: AC(() => import('./views/movie/detail'))
  }
]