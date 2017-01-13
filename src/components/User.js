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
    wordCenter:{
        alignItems:'center',
    },
    authorImg:{
        width:50,
        height:55,
    },
    ImgWH:{
        width:20,
        height:25,
        marginLeft:5,
        marginTop:20,
    },
    wordStyle:{
        fontSize:20,
        fontWeight:'bold',
        color:'white',
        textAlign:'center',
    },
    author:{
        textAlign:'center',
        fontSize:10,
        fontWeight:'600'
    },
    photo:{
        width:75,
        alignItems:'center',
        flexDirection:'row',
    },
    outWord1:{
        borderRadius:10,
        borderWidth:2,
        borderColor:'#ccc',
        backgroundColor:'#ccc',
        opacity:0.5,
        width:70,
    }
})

const User = (props:{
    userName:string,
    residue:number,
    integral:number,
}) =>{
    return (
        <View style={styles.wordCenter}>
            <View style={styles.photo}>
                <Image
                    style={styles.authorImg}
                    source={require('../../resources/tencentlogo.png')}
                />
                <Image
                    style={styles.ImgWH}
                    source={require('../../resources/pai/pai_back.png')}
                >
                    <Text style={styles.wordStyle}>{props.residue}</Text>
                </Image>
            </View>
            <View
                style={styles.outWord1}
            >
                <Text
                    style={styles.author}
                    numberOfLines={1}
                >{props.userName || '游客'}</Text>
            </View>
            <View
                style={[styles.outWord1,{marginTop:3}]}
            >
                <Text
                    style={styles.author}
                    numberOfLines={1}
                >{props.integral || 0}</Text>
            </View>
        </View>
    )
}

export default User
