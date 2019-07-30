
global.Buffer = global.Buffer || require('buffer').Buffer
import React, { Component } from "react";
import {View, Text, TextInput, Button, StyleSheet, KeyboardAvoidingView, Image, TouchableOpacity, findNodeHandle, AsyncStorage, Alert, TouchableWithoutFeedback} from "react-native";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import firebase from 'react-native-firebase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { showMessage, hideMessage } from "react-native-flash-message";
import ModalNew from 'react-native-modal'
import { Sae, Hoshi } from 'react-native-textinput-effects';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import FlashMessage from "react-native-flash-message";

const PouchDB = require('pouchdb-react-native').default
const Movie = new PouchDB('Moive');


export default class LoginScreen extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props){
        super(props);
        // console.log(PouchDB);
        this.state = {
            email: '',
            password: '',
            spinner: false,
            isRegister: false,
            emailReg: '',
            passwordReg: '',
        }

    }

    _signInAsync = async () => {
        
        const { email, password } = this.state
        if(email == "" || password == "") {
            showMessage({
                message: "Error",
                description: `${email == "" ? "Email " : "" }${password == "" ? "Password" : ""} cannot be blank`,
                type: "danger",
                color: "white", // text color
                duration: 5000,
            })
            this.emailInput.focus()
            return
            
        }
        this.setState({spinner: !this.state.spinner}, () => {
            firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((value) => this.setState({spinner: !this.state.spinner}, () => {
                let email = value.user._user.email;
                AsyncStorage.setItem('uid', value.user._user.uid);
                AsyncStorage.setItem('email', email.slice(0, email.indexOf('@')));
                // console.log(email.slice(0, email.indexOf('@')))
                // console.log(value.user._user.email.indexOf('@'))
                
                // AsyncStorage.setItem('userName', value.user._user.uid);
                // console.log(value.user._user.uid);
                this.props.navigation.navigate('HomeScreen');
                
            }))
            .catch(error => {
                this.setState({spinner: false})
                showMessage({
                    message: "Error",
                    description: "Username or password is incorrect",
                    type: "danger",
                    color: "white", // text color
                    duration: 5000,
                })
            })
        
        })
    }

    register() {
        firebase.auth().createUserWithEmailAndPassword(
            this.state.emailReg,
            this.state.passwordReg
        ).then((value) =>{
            // this.refs.myLocalFlashMessage.showMessage({
            //     message: "You have successfully registered",
            //     type: "success",
            //     color: "white", // text color
            // });

            this.setState({isRegister: false}, () => {
                setTimeout(() => {
                    showMessage({
                        message: "You have successfully registered",
                        type: "success",
                        color: "white", // text color
                    })
                },200)
               
            }) 
        
        }).catch((err) => {
            // console.log(err.message)
            if(err.message.indexOf('already in use') > 0) {
                this.refs.myLocalFlashMessage.showMessage({
                    message: "The email address is already in use by another account",
                    type: "danger",
                    color: "white", // text color
                });
                console.log('The email address is already in use by another account')
            }
            if(err.message.indexOf('formatted') > 0){
                this.refs.myLocalFlashMessage.showMessage({
                    message: "Email address is not valid.",
                    type: "danger",
                    color: "white", // text color
                });
                console.log('Email address is not valid.')
            }
        })      
    }
    _showPouchDb = () => {
        Movie.get('mydoc',{revs_info: true}).then(function(doc) {
            console.log(doc);
          }).catch(function (err) {
            console.log(err);
        });
    }
    
    _createData = () => {
        Movie.get('mydoc').then(function(doc) {
            return Movie.put({
                _id: 'mydoc',
                title: 'Heroes1',
                _rev: doc._rev,
            }).then(function (response) {
                // handle response
            }).catch(function (err) {
                console.log(err);
            });
        });
    }

    _scrollToInput = (reactNode) => {
        // Add a 'scroll' ref to your ScrollView
        this.scroll.props.scrollToFocusedInput(reactNode)
    }
    render(){
        return(
            <View style={{flex: 1, backgroundColor: '#2f3640'}}> 
                <ModalNew
                    isVisible={this.state.isRegister}
                    onBackdropPress={() => this.setState({ isRegister: false })}
                    onBackButtonPress={() => this.setState({ isRegister: false })}
                    backdropColor={'transparent'}
                    animationOut={'fadeOut'}
                    animationIn={'zoomIn'}
                    animationInTiming={500}
                    style={{margin: 0}}
                    >
                        
                    <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{backgroundColor: 'white', width: 400, height: 400}}>
                            <View style={{flex: 0.2, justifyContent: "center"}}>
                                <View style={{flexDirection: 'row', alignItems: "center", marginHorizontal: '5%'}}>
                                    <View style={{flex: 0.8}}>
                                        <Text style={{fontSize: 20, color: "black", marginLeft: '10%'}}>REGISTER</Text>
                                    </View>
                                    <View style={{flex: 0.2}}>
                                        <TouchableWithoutFeedback onPress={() => this.setState({ isRegister: false })}>
                                            <IconM name={'close-box-outline'} size={30} color={'black'} />
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                            </View>
                            <View style={{flex: 0.6, marginHorizontal: '10%'}}>
                                <Hoshi
                                    label={'Email'}
                                    onChangeText={(text) => { this.setState({emailReg: text}) }}
                                    // this is used as active border color
                                    borderColor={'black'}
                                    // active border height
                                    borderHeight={3}
                                    inputPadding={16}
                                    // this is used to set backgroundColor of label mask.
                                    // please pass the backgroundColor of your TextInput container.
                                />

                                <Hoshi
                                    label={'Password'}
                                    onChangeText={(text) => { this.setState({passwordReg: text}) }}
                                    // this is used as active border color
                                    borderColor={'#b76c94'}
                                    // active border height
                                    borderHeight={3}
                                    inputPadding={16}
                                    // this is used to set backgroundColor of label mask.
                                    // please pass the backgroundColor of your TextInput container.
                                />

                                <Hoshi
                                    label={'Username'}
                                    // this is used as active border color
                                    borderColor={'#b76c94'}
                                    // active border height
                                    borderHeight={3}
                                    inputPadding={16}
                                    // this is used to set backgroundColor of label mask.
                                    // please pass the backgroundColor of your TextInput container.
                                />
                            </View>
                            <View style={{flex: 0.2}}>

                                <TouchableOpacity onPress={() => this.register()} style={{backgroundColor: 'black', marginHorizontal: '10%', alignItems: 'center', padding: 10}}>
                                    <Text style={{color: 'white', fontSize: 18}}>Register</Text>
                                </TouchableOpacity>
                                
                            </View>
                        </View>
                    </View>
                    <FlashMessage ref="myLocalFlashMessage" position='top' />  
                </ModalNew>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}
                />
                <View style={{flex: 0.1}}></View>
                <View style={{flex: 0.3, alignItems: 'center'}}>
                    <Image
                        source={{uri: 'https://www.w3schools.com/w3images/avatar2.png'}}
                        style={styles.profile}
                    />
                    <Text style={{fontSize: 20, marginTop: 5, color: "white"}}>Brandon TruongVu</Text>
                </View>
                <View style={{flex: 0.25, marginTop: '5%'}}>
                    <TextInput
                        style={styles.typeForm}
                        onChangeText={(text) => this.setState({email: text})}
                        placeholder={'Email'}
                        allowFontScaling={false}
                        value={this.state.email}
                        placeholderTextColor='white'
                        ref={(emailInput) => { this.emailInput = emailInput; }}
                        // onFocus={(event) => {
                        //     // `bind` the function if you're using ES6 classes
                        //     this._scrollToInput(findNodeHandle(event.target))
                        // }}
                    />
                    <TextInput
                        style={[styles.typeForm, {marginTop: "10%"}]}
                        onChangeText={(text) => this.setState({password: text})}
                        placeholder={'Password'}
                        allowFontScaling={false}
                        value={this.state.password}
                        placeholderTextColor='white'
                        // onFocus={(event) => {
                        //     // `bind` the function if you're using ES6 classes
                        //     this._scrollToInput(findNodeHandle(event.target))
                        // }}
                    />
                </View>
                <View style={{flex: 0.35, marginHorizontal: '10%'}}>
                    <TouchableOpacity style={{backgroundColor: 'transparent', borderRadius: 20, alignItems: 'center', height: '20%', justifyContent: 'center', borderWidth: 1, borderColor: '#bdc3c7', marginTop: 20}} onPress={this._signInAsync}>
                        <Text style={{fontWeight: 'bold', fontSize: 16, color: 'white'}}>Continue</Text>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', marginTop: '4%'}}>
                        <View style={{flex: 0.9}}></View>
                        <TouchableOpacity onPress={() => this.setState({isRegister: true})}>
                            <Text style={{fontWeight: 'bold', fontSize: 16, color: 'white', textDecorationLine: 'underline'}}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }   
}

const styles = StyleSheet.create({
    profile: {
        backgroundColor: '#273c75', 
        width: 150, 
        height: 150, 
        borderRadius: 75, 
        borderColor: 'white', 
        borderWidth: 1,  
        
    },
    typeForm: {
        backgroundColor: 'rgba(255,255,255, 0.2)',
        borderRadius: 20,
        marginHorizontal: "10%", 
        height: '30%', 
        textAlign: 'center',
        fontSize: 16,
    },
    typeFormReg: {
        backgroundColor: 'black',
        borderRadius: 20,
        marginHorizontal: "10%", 
        height: '30%', 
        textAlign: 'center',
        fontSize: 16,
    },
})
