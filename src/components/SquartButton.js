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
    borderStyle:{
        width:height/3/140*50,
        height:height/3/140*50,
        borderRadius:height/3/140*50,
        backgroundColor:'white',
        borderWidth:2,
        alignItems:'center',
        position:'absolute',
    },
    wordStyle:{
        width:height/3/140*50,
        height:height/3/140*50,
        backgroundColor:'transparent',
        textAlign:'center',
        lineHeight:height/3/140*40,
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

