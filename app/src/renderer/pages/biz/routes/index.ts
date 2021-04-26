import Demo from '../views/demo'
export interface RouteModel {
    path: string,
    component: React.FunctionComponent,
    auth: boolean,
    childRoutes?: RouteModel[]
}

export const routeConfig: RouteModel[] = [
    {
        path: "/",
        component: Demo,
        auth: false  // false表示不需要登录即可访问
    }

]