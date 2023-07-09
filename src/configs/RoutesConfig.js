import React from "react";
import { AUTH_PREFIX_PATH, APP_PREFIX_PATH } from "configs/AppConfig";
const asisten = localStorage.getItem('asisten')
export const publicRoutes = [
  {
    key: "login",
    path: `${AUTH_PREFIX_PATH}/login`,
    component: React.lazy(() =>
      import("views/auth-views/authentication/login")
    ),
  },
];
let protectedRoutes=[]
if(asisten){
  protectedRoutes = [
    {
      key: "dashboard.default",
      path: `${APP_PREFIX_PATH}/dashboards/default`,
      component: React.lazy(() => import("views/app-views/dashboards/default")),
    },
    {
      key: "sidenav.dashboard.group",
      path: `${APP_PREFIX_PATH}/dashboard/group`,
      component: React.lazy(() => import("views/app-views/dashboards/group")),
    },
    {
      key: "sidenav.dashboard.group",
      path: `${APP_PREFIX_PATH}/dashboard/group/view/:id`,
      component: React.lazy(() => import("views/app-views/dashboards/group/singleviws")),
    }
  ];
}else{
  protectedRoutes = [
    {
      key: "dashboard.default",
      path: `${APP_PREFIX_PATH}/dashboards/default`,
      component: React.lazy(() => import("views/app-views/dashboards/default")),
    },
    {
      key: "sidenav.dashboard.group",
      path: `${APP_PREFIX_PATH}/dashboard/group`,
      component: React.lazy(() => import("views/app-views/dashboards/group")),
    },
    {
      key: "sidenav.dashboard.group",
      path: `${APP_PREFIX_PATH}/dashboard/group/view/:id`,
      component: React.lazy(() => import("views/app-views/dashboards/group/singleviws")),
    },
  
    {
      key: "sidenav.dashboard.major",
      path: `${APP_PREFIX_PATH}/dashboard/major`,
      component: React.lazy(() => import("views/app-views/dashboards/major")),
    },
    {
      key: "sidenav.dashboard.xona",
      path: `${APP_PREFIX_PATH}/dashboard/xona`,
      component: React.lazy(() => import("views/app-views/dashboards/room")),
    },
    {
      key: "sidenav.dashboard.assisint",
      path: `${APP_PREFIX_PATH}/dashboard/assisint`,
      component: React.lazy(() => import("views/app-views/dashboards/assisint")),
    },
  
  ];
}

export default protectedRoutes