import React, { Component } from 'react'
import { View, AppState, Text, StyleSheet, } from 'react-native'
import { Provider } from 'react-redux'
import createStore from './store'
import JJNavigator from './Navigator'

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})

class App extends Component {
    constructor(p) {
        super(p)
        this.state = {
            store: null,
        }
    }
    state: {
        store?: any,
    }
    componentDidMount() {
        createStore((store) => {
            this.setState({
                store,
            })
        })
        AppState.addEventListener('change', this.handleAppChange)
    }

    handleAppChange = (currentAppState: string) => {
        if (currentAppState === 'active') {
            alert('有更新哦！！！')
        }
    }

    componentWillUnMount() {
        AppState.removeEventListener('change', this.handleAppChange)
    }
    render() {
        if (this.state.store === null) {
            return null
        }
        return (
            <Provider store={this.state.store}>
                <View style={styles.container}>
                    <JJNavigator/>
                </View>
            </Provider>

        )
    }
}

export default App