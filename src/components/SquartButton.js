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
    borderStyle:{
        width:50,
        height:50,
        borderRadius:50,
        backgroundColor:'white',
        borderWidth:2,
        alignItems:'center',
        position:'absolute',
    },
    wordStyle:{
        width:50,
        height:50,
        backgroundColor:'transparent',
        textAlign:'center',
        lineHeight:40,
    }
})

const SquratButton = (props:{
    word:string,
    style: Object,
    style1?:Object,
}) =>{
    return (
        <TouchableOpacity
            style={[styles.borderStyle,props.style]}
        >
            <Text style={[styles.wordStyle,props.style1]}>{props.word}</Text>
        </TouchableOpacity>
    )
}
export default SquratButton

