import React, {Component} from 'react'
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    Image,
    TouchableOpacity
} from 'react-native'
const styles = StyleSheet.create({
    position:{
        position:'absolute',
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
                resizeMode='contain'
                source={props.pai}
            />
        </View>
    )
}

export  default Pai