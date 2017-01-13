/**
 * @flow
 */
import _ from 'lodash'
import { Alert, Platform } from 'react-native'

function alert(title: string, message?: string|null, buttons?: Array<Object>) {
  if (Platform.OS === 'ios') {
    Alert.alert(message || title, null, buttons || [{ text: '确定' }])
  } else {
    const androidButtons = buttons ? _(buttons).reverse().value() : buttons
    Alert.alert(message ? title : '', message || title, androidButtons || [{ text: '确定' }])
  }
}

export default {
  alert,
}
