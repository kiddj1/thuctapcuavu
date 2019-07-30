import React, { Component } from "react";
import {View, Text, AsyncStorage, ActivityIndicator} from "react-native";
import AnimatedEllipsis from 'react-native-animated-ellipsis';


export default class Authen extends Component {
    constructor(props){
        super(props);
        this. _bootstrapAsync();
    }
    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('uid');
        console.log(userToken);
        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        setTimeout(() => {
            this.props.navigation.navigate(userToken ? 'HomeScreen' : 'Auth');
        },1000)
    };
    render(){
        return(
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2f3640'}}>
                <AnimatedEllipsis minOpacity={0.1} numberOfDots={5} animationDelay={150} style={{fontSize: 50, color: 'white'}}/>
            </View>
        )
    }   
}

