/**
 * @flow
 */

import _ from 'lodash'
import type { Action } from '../actions/type'

export type Route = {page: string}

const initialRoute = { page: 'LoginPage' }

export default function route(routes: Array<Route> = [initialRoute], action: Action): Array<Route> {
  if (action.type === 'PUSH_ROUTE') {
    const newRoutes = Array.isArray(action.route) ? action.route : [action.route]
    return [...routes, ...newRoutes]
  }
  if (action.type === 'POP_ROUTE') {
    return routes.slice(0, routes.length - 1)
  }
  if (action.type === 'POP_TO_ROUTE') {
    const index = _.findIndex(routes, _.curry(_.isEqual)(action.route))
    return routes.slice(0, index + 1)
  }
  if (action.type === 'RESET_ROUTES_TO') {
    return action.routes
  }
  return routes
}
