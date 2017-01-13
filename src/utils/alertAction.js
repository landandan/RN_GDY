/**
 * @flow
 */
import Alert from './Alert'

export default function (errorMsg:string, bottons:Array<Object>) {
  return new Promise((success) => {
    Alert.alert(
      '提示', errorMsg, bottons.map((obj) => ({
        ...obj,
        text: obj.text,
        onPress: () => success(obj.onPress),
      }
      ))
    )
  })
}
