import { DashboardOutlined,GroupOutlined,HomeOutlined,FormOutlined,UserAddOutlined   } from '@ant-design/icons';
import { APP_PREFIX_PATH } from 'configs/AppConfig'
import { assign } from 'lodash';
const asisten = localStorage.getItem('asisten')

const dashBoardNavTree = [{
  key: "dashboard",
  path: `${APP_PREFIX_PATH}/dashboard`,
  title: "sidenav.dashboard",
  icon: DashboardOutlined,
  breadcrumb: false,
  isGroupTitle: true,
  submenu: [
    {
      key: "dashboards-default",
      path: `${APP_PREFIX_PATH}/dashboard/default`,
      title: "sidenav.dashboard.default",
      icon: DashboardOutlined,
      breadcrumb: false,
      submenu: [],
    },
    {
      key: "dashboards-group",
      path: `${APP_PREFIX_PATH}/dashboard/group`,
      title: "sidenav.dashboard.group",
      icon: GroupOutlined,
      breadcrumb: true,
      submenu: [],
    },
  

  ]
}]
const dashBoardNavTree2 = [{
  key: "dashboard",
  path: `${APP_PREFIX_PATH}/dashboard`,
  title: "sidenav.dashboard",
  icon: DashboardOutlined,
  breadcrumb: false,
  isGroupTitle: true,
  submenu: [
    {
      key: "dashboards-default",
      path: `${APP_PREFIX_PATH}/dashboard/default`,
      title: "sidenav.dashboard.default",
      icon: DashboardOutlined,
      breadcrumb: false,
      submenu: [],
    },
    {
      key: "dashboards-group",
      path: `${APP_PREFIX_PATH}/dashboard/group`,
      title: "sidenav.dashboard.group",
      icon: GroupOutlined,
      breadcrumb: true,
      submenu: [],
    },

    {
      key: "dashboards-major",
      path: `${APP_PREFIX_PATH}/dashboard/major`,
      title: "sidenav.dashboard.major",
      icon: FormOutlined,
      breadcrumb: true,
      submenu: [],
    },
   
    {
      key: "dashboards-xona",
      path: `${APP_PREFIX_PATH}/dashboard/xona`,
      title: "sidenav.dashboard.xona",
      icon: HomeOutlined,
      breadcrumb: true,
      submenu: [],
    },
    
    {
      key: "dashboards-assisint",
      path: `${APP_PREFIX_PATH}/dashboard/assisint`,
      title: "sidenav.dashboard.assisint",
      icon: UserAddOutlined,
      breadcrumb: true,
      submenu: [],
    },
  ]
}]
let  navigationConfig =[]
if(asisten){
  navigationConfig=[...dashBoardNavTree]
}else{
  navigationConfig=[...dashBoardNavTree2]
}

export default navigationConfig;
