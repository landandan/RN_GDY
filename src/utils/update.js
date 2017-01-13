/**
 * @flow
 */
import { Platform } from 'react-native'
import { packageVersion, currentVersion } from 'react-native-update-with-pod'
import md5 from 'md5'
//import { updateInfoURL } from './constants'
import { HybridDevice } from './native-utils'
import Alert from '../utils/Alert'
//import { APIDeps } from './APIRequest'
import { versionCheck, EQUAL, GREATER_THEN, LESS_THEN } from './versionCheck'


const HotUpdate = require('react-native').NativeModules.HotUpdate

/*
 {
  "ios": {
    "binary": "2.6.6",
    "url": "http://www.baidu.com",
    "patch": "http://127.0.0.1:8080/ios_2_6_7.ppk"
  },
  "android": {
    "binary": "1.6.2",
    "url": "http://www.baidu.com"
    "patch": "http://127.0.0.1:8080/android_2_6_7.ppk"
  }
 }
*/

// const downloadUpdateInfo = async () => {
//   const response = await fetch(updateInfoURL(APIDeps.deviceInfo.env || 'SIT'))
//   const updatePayload = await response.json()
//   return updatePayload[Platform.OS]
// }

const downloadAndInstall = async (url) => {
  const hash = md5(url)
  await HotUpdate.downloadUpdate({
    updateUrl: url,
    hashName: hash,
  })
  HotUpdate.reloadUpdate({ hashName: hash })
}

function asyncAlert(message) {
  return new Promise(success => {
    Alert.alert(message, null, [{ text: '确定', onPress: success }])
  })
}

export function markUpdateSuccess() {
  HotUpdate.markSuccess()
}

export async function checkBinaryVersionAction() {
  const updateInfo = await downloadUpdateInfo()
  const { binary, url } = updateInfo || {}

  if (versionCheck(packageVersion, binary) && url) {
    if (Platform.OS === 'android') {
      HybridDevice.updateSysVersion(url)
    } else {
      Alert.alert('版本更新', '有新版啦', [{
        text: '更新',
        onPress: () => HybridDevice.updateSysVersion(url),
      }])
    }
  } else {
    Alert.alert('版本已是最新')
  }

  return []
}

export default async function(interactive: boolean = false) {
  if (__DEV__) {
    return
  }

  const updateInfo = await downloadUpdateInfo()
  if (interactive) {
    await asyncAlert(JSON.stringify({
      packageVersion,
      currentVersion,
      updateInfo,
    }))
  }

  const { binary, url, patch } = updateInfo || {}


  const result = versionCheck(packageVersion, binary)

  if (result === GREATER_THEN) {
    return
  }

  if (result === LESS_THEN && url) {
    if (Platform.OS === 'android') {
      HybridDevice.updateSysVersion(url)
    } else {
      Alert.alert('版本更新', '有新版啦', [{
        text: '更新',
        onPress: () => HybridDevice.updateSysVersion(url),
      }])
    }
    return
  }

  if (result === EQUAL && patch && (currentVersion !== md5(patch))) {
    if (interactive) {
      await asyncAlert('发现RN更新')
    }
    await downloadAndInstall(patch)
    if (interactive) {
      Alert.alert('版本更新成功', null)
    }
    if (Platform.OS === 'android') {
      HybridDevice.restartApp()
    }
    return
  }
}
