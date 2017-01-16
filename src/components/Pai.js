import React, {Component} from 'react'
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native'
const { height, width } = Dimensions.get('window')

const styles = StyleSheet.create({
    position:{
        position:'absolute',
        width:90*115/140,
        height:height/3*115/140,
    },
    imageStyle:{
        width:90*115/140,
        height:height/3*120/140,
    }
})

const Pai = (props:{
    pai:string,
    style:Object,
}) => {
    return (
        <View
            style={[styles.position,props.style]}
        >
            <Image
                style={styles.imageStyle}
                resizeMode='stretch'
                source={props.pai}
            />
        </View>
    )
}

export  default Pai