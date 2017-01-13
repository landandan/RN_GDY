import devTools from 'remote-redux-devtools'
import { createStore, compose } from 'redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import { Platform, AsyncStorage } from 'react-native'
import reducer from './reducers/index'
import middleWare from './utils/middleware'
//import { markUpdateSuccess } from './utils/update'
export default async function(onComplete: () => void) {
    const devEnhancer = devTools({
        name: Platform.OS,
        hostname: 'localhost',
        port: 5678,
    })
    const productionEnhancer = compose(middleWare, autoRehydrate())
    const fn='__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'
    let devMac= window[fn] ? window[fn]():devEnhancer
    //devMac 和enhancer 二选一,如果使用和enhancer,  package.json 里面postinstall 脚本块需要替换成postinstall-devTools
    // const enhancer = __DEV__ ? compose(productionEnhancer, devEnhancer) : productionEnhancer
    const enhancer = __DEV__ ? compose(productionEnhancer, devMac /* enhancer */) : productionEnhancer
    const store = createStore(
        reducer,
        undefined,
        enhancer,
    );

    const onStoreInit = () => {
        //markUpdateSuccess()
        onComplete(store)
    }

    if (__DEV__) {
        const persistor = persistStore(store, {
            storage: AsyncStorage,
            blacklist: ['loading'],
        }, onStoreInit)
        global.ErrorUtils.setGlobalHandler((err) => {
            persistor.purge()
            throw err
        })
    }
}