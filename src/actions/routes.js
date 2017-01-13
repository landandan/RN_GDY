/**
 * @flow
 */

import type { Route } from '../reducers/routes'
import type { Action } from './type'

export function pushRoute(route:Route | Array<Route>):Action {
  return {
    type: 'PUSH_ROUTE',
    route,
  }
}

export function pop(route:?Route):Action {
  if (route) {
    return {
      type: 'POP_TO_ROUTE',
      route,
    }
  }
  return {
    type: 'POP_ROUTE',
  }
}

export function resetTo(routes:Array<Route>):Action {
  return {
    type: 'RESET_ROUTES_TO',
    routes,
  }
}
