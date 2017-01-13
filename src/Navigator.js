/**
 * @flow
 */

import React, { Component, createElement } from 'react'
import { Navigator, BackAndroid } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
import type { Route } from './reducers/routes'
import { resetTo, pop } from './actions/routes'
import StareEye from './pages/stareEye'


const ROUTES = {
    StareEye,
}

function updateRoutes(oldRoutes: Array<Route>, newRoutes: Array<Route>, navigator: Navigator) {
    if (_.isEqual(newRoutes, navigator.getCurrentRoutes())) {
        return
    }
    if (_.isEqual(oldRoutes, newRoutes)) {
        return
    }
    const baseLength = Math.min(oldRoutes.length, newRoutes.length)
    const oldBase = _.slice(oldRoutes, 0, baseLength)
    const newBase = _.slice(newRoutes, 0, baseLength)
    if (!_.isEqual(oldBase, newBase)) {
        navigator.immediatelyResetRouteStack(newRoutes)
        return
    }
    if (oldRoutes.length > newRoutes.length) {
        navigator.popToRoute(_.last(newRoutes))
        return
    }
    const routeToPush = _.slice(newRoutes, baseLength)
    if (routeToPush.length === 1) {
        navigator.push(routeToPush[0])
    } else {
        navigator.push(_.last(routeToPush))
        setTimeout(() => {
            navigator.immediatelyResetRouteStack(newRoutes)
        }, 1200)
    }
    return
}

type PropType = {
    routes: Array<Route>,
    resetRoutes: (routes:Array<Route>)=>any,
    pop: ()=>any,
}

class JJNavigator extends Component {

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.onBackPressed)
    }

    componentWillReceiveProps(nextProps: PropType) {
        const oldRoutes = this.props.routes
        const newRoutes = nextProps.routes
        updateRoutes(oldRoutes, newRoutes, this.navigator)
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.onBackPressed)
    }

    onBackPressed = () => {
        const { page } = _.last(this.props.routes) || {}
        if (page === 'LoginPage' || page === 'TruthTell') {
            return false
        }

        this.props.pop()
        return true
    }

    props: PropType
    navigator: Navigator

    syncRoutesToRedux() {
        if (this.navigator === undefined) {
            return
        }
        const currentRoutes = this.navigator.getCurrentRoutes()
        if (_.isEqual(currentRoutes, this.props.routes)) {
            return
        }
        this.props.resetRoutes(currentRoutes)
    }

    render() {
        return (
            <Navigator
                ref={(navigator) => { this.navigator = navigator }}
                style={{ flex: 1 }}
                initialRouteStack={this.props.routes}
                renderScene={(route) => createElement(ROUTES[route.page], route)}
                onDidFocus={() => { this.syncRoutesToRedux() }}
                configureScene={(route) => {
          if (route.page === 'TruthTell') {
            return {
              ...Navigator.SceneConfigs.PushFromRight,
              gestures: {},
            }
          }
          return Navigator.SceneConfigs.PushFromRight
        }}
            />
        )
    }
}

function mapToProps({ routes }) {
    return { routes }
}

function mapToAction(dispatch) {
    return {
        resetRoutes: (routes: Array<Route>) => dispatch(resetTo(routes)),
        pop: () => dispatch(pop()),
    }
}

export default connect(mapToProps, mapToAction)(JJNavigator)
