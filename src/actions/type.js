/**
 * @flow
 */

import type { Route } from '../reducers/routes'

export type Action = { type: 'PUSH_ROUTE', route: Route | Array<Route> }
  | { type: 'POP_ROUTE' }
  | { type: 'POP_TO_ROUTE', route: Route }
  | { type: 'RESET_ROUTES_TO', routes: Array<Route>}
  | { type: 'LOGINPAGE/USERNAME/', path: 'login/username' | '' }
  | { type: 'registerPage/setNextAvailableTime', payload: string }
  | { type: 'homePage/reset' }

/* eslint-disable no-use-before-define */
export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any
export type GetState = () => Object
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any
export type PromiseAction = Promise<Action>
/* eslint-enable */

