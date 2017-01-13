import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import { pushRoute } from '../actions/routes'
import SquartButton from "../components/SquartButton"
import User from "../components/User";
import Pai from "../components/Pai";

const { height, width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
  },
  imgStyle: {
    width: null,
    height: null,
    paddingHorizontal: 20
  },
  zuowei: {
    justifyContent: 'space-between'
  },
  cols1: {
    height: height / 3,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cols2: {
    height: height / 3,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  titleCenter: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  residue: {
    textAlign: 'center',
    fontSize: 20,
    color: 'orange',
    fontWeight: 'bold',
  },
  titleText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  juShu: {
    textAlign: 'center',
    fontSize: 16,
    color: 'orange'
  },
  beiShu: {
    textAlign: 'center',
    fontSize: 16,
    color: 'orange'
  }
})
class StareEye extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          resizeMode="contain"
          style={styles.imgStyle}
          source={require('../../resources/game.jpg')}
        >
          <View style={styles.zuowei}>
            <View style={styles.cols1}>
              <User
                userName={'老朱'}
                residue={5}
                integral={-50}
              />
              <User
                userName={'蛋蛋'}
                residue={4}
                integral={-190}
              />
              <View style={styles.titleCenter}>
                <View
                  style={{width:140,}}
                >
                  <Text style={styles.residue}>剩余扑克：{26}</Text>
                </View>
                <View
                  style={styles.titleText}
                >
                  <View>
                    <Text style={styles.juShu}>局数：{2}</Text>
                  </View>
                  <View>
                    <Text style={styles.beiShu}>倍数：{4}</Text>
                  </View>
                </View>
              </View>
              <User
                userName={'二狗松'}
                residue={5}
                integral={-1000}
              />
              <User
                userName={'金爷'}
                residue={5}
                integral={1000}
              />
            </View>
            <View style={styles.cols2}>
              <User
                userName={'大黄'}
                residue={5}
                integral={-500}
              />
              <User
                userName={'老黄'}
                residue={4}
                integral={-1000}
              />
            </View>
            <View style={styles.cols1}>
              <User
                userName={'小虎'}
                residue={5}
                integral={100}
              />
              <View style={[styles.wordCenter,{width:200,height:140}]}>
                <Pai
                  pai={require('../../resources/pai/pai_01_1.png')}
                  style={{left:0,top:0,}}
                />
                <Pai
                  pai={require('../../resources/pai/pai_01_1.png')}
                  style={{left:30,borderLeftColor:'#ccc',borderLeftWidth:1,}}
                />
                <Pai
                  pai={require('../../resources/pai/pai_01_1.png')}
                  style={{left:60,borderLeftColor:'#ccc',borderLeftWidth:1}}
                />
                <Pai
                  pai={require('../../resources/pai/pai_01_1.png')}
                  style={{left:90,borderLeftColor:'#ccc',borderLeftWidth:1}}
                />
                <Pai
                  pai={require('../../resources/pai/pai_02_1.png')}
                  style={{left:120,borderLeftColor:'#ccc',borderLeftWidth:1}}
                />
              </View>
              <View style={[styles.wordCenter,{height:140,width:160}]}>
                <SquartButton
                  style={{
                                        left:20,
                                        bottom:10,
                                    }}
                  word='托管'
                />
                <SquartButton
                  style={{
                                        right:10,
                                        top:10,
                                    }}
                  word='不出'
                />
                <SquartButton
                  style={{
                                        left:45,
                                        top:30,
                                    }}
                  word='提示'
                />
                <SquartButton
                  style={{
                                        right:10,
                                        bottom:10,
                                        width:60,
                                        height:60
                                    }}
                  style1={{
                                        lineHeight:50
                                    }}
                  word='出牌'
                />
              </View>
            </View>
          </View>

        </Image>
      </View>
    )
  }
}

function mapProps(props) {
  return {}
}
function mapAction(dispatch) {
  return {}
}
export default connect(null, null)(StareEye)