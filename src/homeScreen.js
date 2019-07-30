import React, { Component } from "react";
import {View, Text, AsyncStorage, ImageBackground, FlatList, StyleSheet, Image, TouchableOpacity, Modal, TextInput, Keyboard} from "react-native";
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import * as firebaseDB from './lib/firebaseDB'
import * as arr from './lib/replaceArr'
import moment from 'moment';
import HistoryBookScreen from './historyBookScreen';
import TopBooking from './topBooking';
import ServicecInclude from './serviceIncludeScreen';
import { showMessage, hideMessage } from "react-native-flash-message";
import { TouchableNativeFeedback } from "react-native-gesture-handler";

export default class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            row: ['aaa','bbbb','cccc'],
            dataRoom: [
                {title: 'Paris Meeting Room', location: 'Room 203 - Floor 2', time: 'abc', bookingPerson: 'MRVUK', img: null },
                {title: 'Easy Meeting Room', location: 'Room 303 - Floor 3', time: 'abc', bookingPerson: 'null', img: null }
            ],
            data: [],
            hours: null,
            minutes: null,
            countDownArrayTimeOut: [],
            countDownArray: [],
            reload: false,
            flagStartCountDown: false,
            userData: null,
            modalVisible: false,
            text: '',
            thumpUp: 'thumb-up-outline',
            colorThumpUp: null,
            colorThumpDown: null,
            thumpDown: 'thumb-down-outline',
            popUpOnTime: false,
            stateTextPopUp: '',
            keyboardDidShow: false,
            email: '',
        }
        this.countDownArray = [];
        this.reloadTimeOut = null;
        this.hours = 0;
        this.minutes = 0;
        this.flagStartCountDown = false;
        this.startCountDownTimeout = null;
        this.isLoadData = false;
        this.lastClearIntervalId = null;
        this.noData = 0;
        this.isDataChange = false;
        this.userData = null;
        this.userToken = null;
        this.likeState = null;
        this.disLikeState = null;
        this.popUpAppeared = [];
        this.onTime = false;
        this.idRoomReview = null;
        this.channel = null;
        this.notification = null;
    }

    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }
    
    componentWillUnmount () {
        clearInterval(this.startCountDownTimeout)
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow () {
        // alert('Keyboard Shown');
        // console.log(this)
        this.setState({keyboardDidShow: true})
    }
    
    _keyboardDidHide () {
        // alert('Keyboard Hidden');
        this.setState({keyboardDidShow: false})
    }

    signOut () {
        AsyncStorage.removeItem('uid');
        AsyncStorage.removeItem('email');
        this.props.navigation.navigate('SignIn')
    }

    _loadData () {
        let instance = this;
        

        setTimeout(() => {
            firebaseDB.readData({
                onFetchData: function (data) {

                    let filterData = Object.values(data).filter((e, i) => {
                        if(e.hasOwnProperty('uid')) {
                            if(instance.userToken != null && instance.userToken == e.uid ) {
                                instance.userData = e
                            }
                            return false
                        }
                        return true
                    })
                    instance.setState({data: instance.state.data.concat(filterData.sort((a, b) => 
                        b.bookCount - a.bookCount 
                        ))
                    },() => {
                        instance.countDownMeeting(filterData)
                        instance.isLoadData = true;
                    })
                   
                }
            });
        }, 500)
    }

    _bootstrapAsync = async () => {
        // const userToken = await AsyncStorage.getItem('userToken');
        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        this.props.navigation.navigate('Auth');
    };


    

    countDownMeeting(data) {
        console.log('ADSADSADSA', data)
        let bookTime = []
        let sort = []
        data.map((e, i) => {
            sort = []
            e.bookTime.map((eB,iB) => {
                // console.log(eB)
                if(eB.endTime > moment().valueOf()){
                    sort.push(eB)
                }
                if(iB == e.bookTime.length - 1) {
                    if(sort.length > 0) {
                        sort.sort(function (a, b) {
                            return a.endTime - b.endTime
                        });  
                        let abc = {
                            ...sort[0],
                            id: e.id,
                            name: e.name,
                            imgRoom: e.imgRoom,
                        }
                        bookTime.push(abc)
                    }
                }
            })
            
            if(i == data.length -1) {
                console.log(bookTime)
                bookTime.map((e, i) => {
                    if(e.hasOwnProperty('time')  && (e.time - moment().valueOf() > 0 || e.endTime - moment().valueOf() > 0 ) ){
                        console.log('VUVU')
                        this.noData += 1;
                        this.idInterval = setInterval(() =>{
                            if(this.state.flagStartCountDown){
                                let distance = e.time - moment().valueOf();
                                let distanceEndTime = e.endTime - moment().valueOf();
                                let hours 
                                let minutes
                                let seconds
                                const countDown = (distance) => {
                                    hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                                    minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
                                    seconds = Math.floor((distance % (1000 * 60)) / 1000)
                                }
                                countDown(distance < 0 ? distanceEndTime : distance)
                                let idRoom = e.id
                                const indexCountDown = this.countDownArray.findIndex(e1 => e1.idRoom === idRoom)
                                const indexPopUpAppeared = this.popUpAppeared.findIndex(e1 => e1 == idRoom)
                                console.log(`${e.id}`, indexCountDown)
        
                                if(distance < 0 && distanceEndTime > 0 && indexPopUpAppeared == -1) {
                                    this.popUpAppeared.push(e.id);
                                    this.onTime = true;
                                    this.idRoomReview = idRoom;
                                    this.nameRoomReview = e.name;
                                    this.imgRoomReview = e.imgRoom;
                                    firebase.notifications().displayNotification(this.notification)
                                    this.setState({popUpOnTime: true, stateTextPopUp: 'Đã tới giờ họp'});
                                }
        
                                if((distance < 0 && distanceEndTime < 0) && indexCountDown != -1  ){
                                    this.onTime = false;
                                    this.idRoomReview = idRoom;
                                    this.nameRoomReview = e.name;
                                    this.imgRoomReview = e.imgRoom;
                                    clearInterval(this.countDownArray[indexCountDown].idTimeOut);
                                    this.lastClearIntervalId = this.countDownArray[indexCountDown].idTimeOut;
                                    this.setState({popUpOnTime: true, stateTextPopUp: 'Đã hết giờ họp'}); 
                                }else {
                                    if (indexCountDown == -1) {
                                        this.countDownArray.push({hours, minutes, seconds, idRoom: idRoom, idTimeOut: this.idInterval, distance: distance, name: e.name })
                                    }else{
                                        this.countDownArray[indexCountDown].distance = distance
                                        this.countDownArray[indexCountDown].hours = hours
                                        this.countDownArray[indexCountDown].minutes = minutes
                                        this.countDownArray[indexCountDown].seconds = seconds
                                    }
                                 
                                }
                            }
                        }, 1000)
                    
                    }
                    if(bookTime.length - 1 === i) {
                        if(this.noData > 0){
                            if(this.startCountDownTimeout != null)
                                clearInterval(this.startCountDownTimeout)
                            this.startCountDownTimeout = setInterval(() => {
                                
                                let isCountDownEndAll = false;
                                if(this.noData == this.countDownArray.length && this.lastClearIntervalId == this.countDownArray[this.countDownArray.length - 1].idTimeOut){
                                    clearInterval(this.startCountDownTimeout)
                                    isCountDownEndAll = true
                                }
                                
        
                                this.setState({reload: !this.state.reload, flagStartCountDown: !isCountDownEndAll ? true : false })
                            }, 950)
                        }
                    }
                })

            } // khi tim duoc phong thoi gian gan nhat
            
        })
            
        // if(e.hasOwnProperty('bookTime') &&  e.bookTime.length > 0 && (e.bookTime[0].time - moment().valueOf() > 0 || e.bookTime[0].endTime - moment().valueOf() > 0 ) ){
        //     this.noData += 1;
        //     this.idInterval = setInterval(() =>{
        //         if(this.state.flagStartCountDown){
        //             let distance = e.bookTime[0].time - moment().valueOf();
        //             let distanceEndTime = e.bookTime[0].endTime - moment().valueOf();
        //             let hours 
        //             let minutes
        //             let seconds
        //             const countDown = (distance) => {
        //                 hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        //                 minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        //                 seconds = Math.floor((distance % (1000 * 60)) / 1000)
        //             }
        //             countDown(distance < 0 ? distanceEndTime : distance)
        //             let idRoom = e.id
        //             const indexCountDown = this.countDownArray.findIndex(e1 => e1.idRoom === idRoom)
        //             const indexPopUpAppeared = this.popUpAppeared.findIndex(e1 => e1 == idRoom)
        //             console.log(`${e.id}`, indexCountDown)

        //             if(distance < 0 && distanceEndTime > 0 && indexPopUpAppeared == -1) {
        //                 this.popUpAppeared.push(e.id);
        //                 this.onTime = true;
        //                 this.idRoomReview = idRoom;
        //                 this.nameRoomReview = e.name;
        //                 this.imgRoomReview = e.imgRoom;
        //                 firebase.notifications().displayNotification(this.notification)
        //                 this.setState({popUpOnTime: true, stateTextPopUp: 'Đã tới giờ họp'});
        //             }

        //             if((distance < 0 && distanceEndTime < 0) && indexCountDown != -1  ){
        //                 this.onTime = false;
        //                 this.idRoomReview = idRoom;
        //                 this.nameRoomReview = e.name;
        //                 this.imgRoomReview = e.imgRoom;
        //                 clearInterval(this.countDownArray[indexCountDown].idTimeOut);
        //                 this.lastClearIntervalId = this.countDownArray[indexCountDown].idTimeOut;
        //                 this.setState({popUpOnTime: true, stateTextPopUp: 'Đã hết giờ họp'}); 
        //             }else {
        //                 if (indexCountDown == -1) {
        //                     this.countDownArray.push({hours, minutes, seconds, idRoom: idRoom, idTimeOut: this.idInterval, distance: distance, name: e.name })
        //                 }else{
        //                     this.countDownArray[indexCountDown].distance = distance
        //                     this.countDownArray[indexCountDown].hours = hours
        //                     this.countDownArray[indexCountDown].minutes = minutes
        //                     this.countDownArray[indexCountDown].seconds = seconds
        //                 }
                     
        //             }
        //         }
        //     }, 1000)
        
        // }
        // if(data.length - 1 === i) {
        //     if(this.noData > 0){
        //         if(this.startCountDownTimeout != null)
        //             clearInterval(this.startCountDownTimeout)
        //         this.startCountDownTimeout = setInterval(() => {
                    
        //             let isCountDownEndAll = false;
        //             if(this.noData == this.countDownArray.length && this.lastClearIntervalId == this.countDownArray[this.countDownArray.length - 1].idTimeOut){
        //                 clearInterval(this.startCountDownTimeout)
        //                 isCountDownEndAll = true
        //             }
                    

        //             this.setState({reload: !this.state.reload, flagStartCountDown: !isCountDownEndAll ? true : false })
        //         }, 950)
        //     }
        // }

                // if(!this.isFirstCountDown){
                //     this.startCountDownTimeout = setInterval(() => {
                        
                //         let isCountDownEndAll = false;
                //         this.isFirstCountDown = true;
                        
                //         if(this.noData && this.lastClearIntervalId == null)
                //             clearInterval(this.startCountDownTimeout)
                //         // console.log(this.clearIntervalCount == this.countDownArray.length);
                        
                //         // if( (this.lastClearIntervalId == null && this.state.flagStartCountDown  ) && (this.lastClearIntervalId != null  && this.state.flagStartCountDown)){
                //         //     clearInterval(this.startCountDownTimeout)
                //         //     isCountDownEndAll = true;   
                //         // }
                //         this.setState({reload: !this.state.reload, flagStartCountDown: !isCountDownEndAll ? true : false })
                //     }, 950)
                // }
                // this.countDownArray.map((e, i) => {
                //     if(e.)
                // })
            
        
    }


    async componentDidMount() {
        this.userToken = await AsyncStorage.getItem('uid');
        this.setState({ email: await AsyncStorage.getItem('email')})
        console.log('uuu', this.userToken)
        this._loadData();
        // this.setModalVisible(true);
        
        let instance = this;
        let data =
        [
            {
                id: 'parisroom',
                capacity : '10',
                timeFrom: '8:00',
                timeTo: '19:00',
                name: 'Paris Room',
                bookUser: '',
                timeStart: '',
                location: '',
                floor: '1',
                roomNumber: '102',
                service: [''],
            },
            {
                id: 'nhatrangroom',
                capacity : '10',
                timeFrom: '7:00',
                timeTo: '20:00',
                name: 'Nha Trang Room',
                bookUser: '',
                location: '',
                floor: '2',
                roomNumber: '202',
                service: [''],
            },
            {
                id: 'easyroom',
                capacity : '6',
                timeFrom: '7:00',
                timeTo: '20:00',
                name: 'Easy Meeting Room',
                bookUser: '',
                location: '',
                floor: '3',
                roomNumber: '308',
                service: [''],
            },
            {
                id: 'vungtauroom',
                capacity : '10',
                timeFrom: '7:00',
                timeTo: '20:00',
                name: 'Vung Tau Room',
                bookUser: '',
                location: '',
                floor: '3',
                roomNumber: '309',
                service: [''],
            },
            {
                id: 'hcmroom',
                capacity : '15',
                timeFrom: '7:00',
                timeTo: '20:00',
                name: 'HCM Room',
                bookUser: '',
                location: '',
                floor: '6',
                roomNumber: '606',
                service: [''],
            },
            {
                id: 'hcm1room',
                capacity : '12',
                timeFrom: '7:00',
                timeTo: '20:00',
                name: 'HCM1 Room',
                bookUser: '',
                location: '',
                floor: '11',
                roomNumber: '1104',
                service: [''],
            }
        ]
        firebaseDB.readDataChange({
            onChange: function (data) {
                console.log('datachange', data)

                if(data != null && data.hasOwnProperty('uid')) {
                    // instance.userData = data
                    instance.setState({userData: data})
                    // console.log("VU DEP TRAI")
                }

                if(instance.isLoadData && !data.hasOwnProperty('uid')){
                    // const indexDataChange = instance.state.data.findIndex(e => e.id === data.id);
                    // instance.state.data.splice(indexDataChange, 1);
                    // instance.setState({data: [data].concat(instance.state.data)})

                    console.log('isLoadData ????????')
                    let indexIdTimeOut;
                    if(instance.countDownArray.length > 0)
                        indexIdTimeOut = instance.countDownArray.findIndex(e => e.idRoom === data.id)
                    // console.log('indexIdTimeOut ReadData', indexIdTimeOut)
                    if(indexIdTimeOut != null && indexIdTimeOut != -1){
                        clearInterval(instance.countDownArray[indexIdTimeOut].idTimeOut)
                        instance.countDownArray.splice(indexIdTimeOut, 1)
                    }

                    instance.state.data.some((e, i) => {
                        if(e.id == data.id) {
                            instance.setState({data: arr.replaceAt(instance.state.data, i, data) })
                            return true;
                        }
                    })

                    // this.isFirstCountDown = false;
                    this.isDataChange = true;
                    instance.countDownMeeting([data])   
                }

            },
        },this.userToken);

        //Create id channel
        this.channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
        .setDescription('My apps test channel');

        // Create the channel
        firebase.notifications().android.createChannel(this.channel);

        // Content of notify
        this.notification = new firebase.notifications.Notification().setNotificationId('notificationId')
        .setTitle('Thông báo')
        .setBody('Đã tới giờ họp')
        .setData({
            key1: 'value1',
            key2: 'value2',
        });

        this.notification.android.setChannelId('test-channel').android.setSmallIcon('ic_launcher');

        // setTimeout(() => {
        //     firebase.notifications().displayNotification(notification)
        // }, 2000)
        // const date = new Date();
        // date.setMinutes(date.getMinutes() + 1);

        // firebase.notifications().scheduleNotification(notification, {
        //     fireDate: date.getTime(),
        // })
        // const { currentUser } = firebase.auth()
        // console.log(currentUser);
    }
    renderItem = ({item, index}) => {    
        return (
            <View style={{flex: 1, marginTop: 10}}>
                <View style={styles.timeline}>
                    <View style={styles.line}>
                        {/* <View style={{backgroundColor: 'white', height: 10, width: 10, borderRadius: 5}}></View> */}
                        <View style={{flex: 1, width: 2, backgroundColor: 'white'}}></View>
                        {/* <View style={{backgroundColor: 'white', height: 10, width: 10, borderRadius: 5}}></View> */}
                    </View>
                    
                </View> 
                <View style={styles.dot} />
                <View style={{ marginLeft: 10, backgroundColor: 'white', marginRight: 10}}>
                    <View style={{backgroundColor: 'white', }}>

                    </View>
                </View>
                <View style={styles.dot} />
                {/* {index == this.state.row.length - 1 && <View style={styles.dot} />} */}
            </View>
        )
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     // if(nextState.hours !== this.state.hours || nextState.minutes !== this.state.minutes) 
    //     //     return true

    //     // return false

    //     return true
    // }

    setModalVisible(visible) {
        this.setState({modalVisible: visible, text: ''});
    }

    sendComment(id) {
        
        let reviewsOfRoom = null;

        let reviewData = {
            text: this.state.text,
            like: this.likeState ? 1 : 0,
            dislike: !this.likeState ? 1 : 0,
            id: this.idRoomReview,
            date: moment().valueOf(),
            user: this.state.email,
            totalTime: 0,
        }

        this.state.data.some((e, i) => {
            if(e.id == reviewData.id) {
                reviewsOfRoom = e.reviews
                return true;
            }
        })

        if(!this.likeState && !this.disLikeState) {
            alert('Vui lòng đánh giá trước khi gửi')
            return
        }
        
        this.setModalVisible(false)
        firebaseDB.sendComment([reviewData].concat(reviewsOfRoom), this.idRoomReview)

    }

    likeOrDisLike(something) {
        const thumpUpO = {thumpUp: this.state.thumpUp + '-outline', colorThumpUp: null}
        const thumbDownO = {thumpDown: this.state.thumpDown + '-outline', colorThumpDown: null}
        const thumpUp = {thumpUp: this.state.thumpUp.replace('-outline',''), colorThumpUp: 'green'}
        const thumpDown = {thumpDown: this.state.thumpDown.replace('-outline',''), colorThumpDown: 'red'}
        if(something == 'like'){
            if(this.likeState){
                this.likeState = false;
                this.setState(thumpUpO)
                return;
            }else{
                this.likeState = true;
                this.setState(thumpUp)
                if(this.disLikeState) {
                    this.disLikeState = false;
                    this.setState(thumbDownO)
                }
            }

        }else{
            if(this.disLikeState){
                this.disLikeState = false;
                this.setState(thumbDownO)
                return;
            }else{
                this.disLikeState = true;
                this.setState(thumpDown)
                if(this.likeState) {
                    this.likeState = false;
                    this.setState(thumpUpO)
                }
            }
        }
    }

    acceptRoom() {
        if(!this.onTime) {
            this.setModalVisible(true)
        }else {
            showMessage({
                message: "Successfully",
                description: "Đã nhận phòng",
                type: "success",
                icon: "success"
                // backgroundColor: "rgba(46, 204, 113, 0.8)", // background color
                // color: "#606060", // text color
            });
        }

        this.setState({popUpOnTime: false});
       
    }   

    rejectRoom(id) {
        let bookTime = []
        if(this.onTime) {
            showMessage({
                message: "Successfully",
                description: "Đã trả phòng",
                type: "danger",
                // backgroundColor: "rgba(46, 204, 113, 0.8)", // background color
                // color: "#606060", // text color
            });
        }

        // this.state.data.some((e, i) => {
        //     if(e. == this.idRoomReview) {
        //         bookTime = e.bookTime
        //         return true;
        //     }
        // })

        // firebaseDB.rejectRoom()
        this.setState({popUpOnTime: false});
    }

    render(){
        console.log('rerender')
        // const indexCountDownMeeting = this.countDownArray.findIndex
        // const isCountDown = this.countDownArray.length > 0 ;
        let indexMeetingSoon;
        if(this.countDownArray.length > 0){
            indexMeetingSoon = [...this.countDownArray];
        
            indexMeetingSoon.sort(function(a, b) {
                return a.distance - b.distance;
            });
        }
            // console.log(indexMeetingSoon)
        
        
        return(
            <ImageBackground source={require('../resource/img/AzurLane.jpg')} style={{width: '100%', height: '100%'}}>

                <View style={{flex: 1}}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            // Alert.alert('Modal has been closed.');
                            this.setModalVisible(!this.state.modalVisible);
                        }}>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', backgroundColor: 'rgba(80,80,80,0.4)'}}>
                                <View style={{width: '90%', height: '60%', backgroundColor: 'white'}}>
                                    <View style={{flex: 0.3, marginTop: '4%'}}> 
                                        <Text style={{textAlign: 'center', fontWeight: '500', fontSize: 20, color: 'black'}}>Bạn có hài lòng về phòng họp này? </Text>
                                        <Text style={{textAlign: 'center',fontSize:  16}}>Hãy để lại nhận xét nhé ! </Text>
                                        {!this.state.keyboardDidShow ?
                                            <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 10}}>
                                                <TouchableOpacity onPress={() => this.likeOrDisLike('like')}>
                                                    <IconM name={this.state.thumpUp} size={40} color={this.state.colorThumpUp} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => this.likeOrDisLike('dislike')} >
                                                    <IconM name={this.state.thumpDown} size={40} color={this.state.colorThumpDown}  />
                                                </TouchableOpacity>
                                            </View>
                                            :
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-around'}}>
                                                <TouchableOpacity onPress={() => this.likeOrDisLike('like')}>
                                                    <IconM name={this.state.thumpUp} size={20} color={this.state.colorThumpUp} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => this.likeOrDisLike('dislike')} >
                                                    <IconM name={this.state.thumpDown} size={20} color={this.state.colorThumpDown}  />
                                                </TouchableOpacity>
                                            </View>
                                        
                                        }
                        
                                    </View>
                                    <View style={{
                                            backgroundColor: '#E6EEF2',
                                            marginHorizontal: '5%',
                                            flex: 0.55,
                                            marginTop: '5%'
                                            }}
                                        >
                                        <TextInput 
                                            textAlignVertical={'top'}
                                            multiline = {true}
                                            numberOfLines = {4}
                                            placeholder="Nhập nhận xét của bạn ở đây"
                                            onChangeText={(text) => this.setState({text})}
                                            value={this.state.text}
                                        />
                                    </View>
                                    <View style={{flex: 0.15, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                                            <View style={{flex: 0.2}}></View>
                                            <TouchableOpacity onPress={() => this.setModalVisible(false)}>
                                            <Text style={{color: '#E66996', fontWeight: '600'}}>CANCEL</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => this.sendComment()}>
                                                <Text style={{color: '#E66996', fontWeight: '600'}}>SEND COMMENT</Text>
                                            </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                    </Modal>
                    <View style={{flex: 0.1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                       
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>Hi, {this.state.email} </Text>
                     
                        <TouchableOpacity onPress={() => this.signOut() } >
                            <IconM name='logout-variant' size={25} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.header_item_status}>
                        <View style={{backgroundColor: 'red' , borderRadius: 15, width: 30 ,height: 30, justifyContent: 'center', marginLeft: 10}}>
                            <Text style={{textAlign: 'center', color: 'white'}}>2</Text>
                        </View>
                        <View style={{flex: 0.8, marginLeft: 30, justifyContent: 'center'}}>
                            <HistoryBookScreen data={this.state.userData}></HistoryBookScreen>
                        </View>
                        <View style={{flex: 0.2}}>
                            <Text style={{fontSize: 19, fontWeight: 'bold'}}>{`${this.countDownArray.length > 0 ? indexMeetingSoon[0].hours : 0 }:${ this.countDownArray.length > 0 ? indexMeetingSoon[0].minutes : 0}`}</Text>
                        </View>
                    </View>
                    <View style={{flex: 0.08, backgroundColor: 'white', marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                        <View style={{marginLeft: 20, flex: 0.8}}>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Fri, Jul 5, 2019</Text>
                        </View>

                        <TopBooking data={this.state.data}/>
                        <View style={{marginRight: 10}}>
                            <Icon name='md-calendar' size={26} />
                        </View>
                        
                    </View>
                    <View style={{flex: 0.74, top: 10, marginLeft: 10}}>
                        {/* <View style={{flex: 0.05, marginLeft: 5}}><Text>8:00 AM</Text></View>
                        <View style={{flexDirection: 'row', flex: 0.95}}>
                            <View style={{flex: 0.05, backgroundColor: 'red', alignItems: 'center'}}>
                                <View style={{backgroundColor: 'white', height: 10, width: 10, borderRadius: 5}}></View>
                                <View style={{flex: 0.95, width: 2, backgroundColor: 'white'}}></View>
                                <View style={{backgroundColor: 'white', height: 10, width: 10, borderRadius: 5}}></View>
                            </View>
                            <View style={{flex: 0.95, marginLeft: 10}}>
                                <Text>ABCD</Text>
                            </View>
                        </View> */} 
                        <FlatList
                            data={this.state.data}
                            extraData={this.state.reload}
                            renderItem={({item, index}) => {
                                const findIndexTimeCountDown = this.countDownArray.length > 0 ? this.countDownArray.findIndex(e => e.idRoom === item.id) : -1
                                const hours = findIndexTimeCountDown != -1 ? this.countDownArray[findIndexTimeCountDown].hours : 0;
                                const minutes = findIndexTimeCountDown != -1 ? this.countDownArray[findIndexTimeCountDown].minutes : 0;
                                const seconds = findIndexTimeCountDown != -1 ? this.countDownArray[findIndexTimeCountDown].seconds : 0;
                                return (
                                <View style={{flex: 1, marginTop: 10}}>
                                    <View style={styles.timeline}>
                                        <View style={styles.line}>
                                            {/* <View style={{backgroundColor: 'white', height: 10, width: 10, borderRadius: 5}}></View> */}
                                            <View style={{flex: 1, width: 1, backgroundColor: 'white', opacity: 0.5}}></View>
                                            {/* <View style={{backgroundColor: 'white', height: 10, width: 10, borderRadius: 5}}></View> */}
                                        </View>
                                        
                                    </View> 
                                    <View style={styles.dot} />
                                    <View style={{marginLeft: 15, marginRight: 10}}>
                                        <View style={{backgroundColor: 'white', paddingVertical: 10, flexDirection: 'row',  borderRadius: 3 }}>
                                            <View style={{flex: 0.25}}>
                                                <Image
                                                    source={{uri: item.imgRoom}}
                                                    style={{width: 80, height: 80, marginLeft: 10}}
                                                />
                                            </View>
                                            <View style={{marginLeft: 15, flex: 0.45}}>
                                                <Text style={{fontSize: 18, color: 'black'}}>{item.name}</Text>
                                                <Text style={{color: 'purple'}}>{`Room ${item.roomNumber}`} - {`Floor ${item.floor}`}</Text>
                                                <View style={{flexDirection: 'row'}}>
                                                    <View style={{flex: 0.35, flexDirection: 'row', justifyContent: 'space-between'}}>
                                                        <IconM name={'circle'} size={20} color={'#2ecc71'}/>
                                                        <Text>{`${hours}:${minutes}:${seconds}`}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <TouchableOpacity style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center'}} onPress={() => this.props.navigation.navigate('BookingScreen', {dataRoom: item, dataUser: this.userData  }) }>
                                                <View style={{borderWidth: 0.5, height: '50%', width: '50%', justifyContent: 'center', alignItems: 'center', borderRadius: 10}}>
                                                    <Text>Book</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    
                                    <View style={styles.dot} />
                                    {/* {index == this.state.row.length - 1 && <View style={styles.dot} />} */}
                                </View>
                                )
                            }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </View>
                {this.state.popUpOnTime &&
                    <View style={{backgroundColor: 'rgba(236, 240, 241, 0.9)', position: 'absolute', width: '70%', height: '20%' ,alignSelf: 'center', bottom: '5%', padding: 10}}>
                        <View style={{ flex: 1}}>
                            <View style={{flexDirection: 'row', flex: 0.5}}>
                                <Image
                                    source={{uri: this.imgRoomReview}}
                                    style={{width: 40, height: 40}}
                                />
                                <View style={{}}>
                                    <Text style={{color: 'black'}}> {this.nameRoomReview}</Text>
                                    <Text style={{color: 'red'}}> {this.state.stateTextPopUp}</Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', flex: 0.5, justifyContent: 'space-around'}} >
                                <TouchableOpacity onPress={() => this.acceptRoom()} style={{flex: 0.5, backgroundColor : 'rgba(46, 204, 113,1.0)', alignItems : 'center', justifyContent: 'center'}}>
                                    <Text>{!this.onTime ? 'Đánh giá' : 'Nhận phòng'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.rejectRoom()} style={{flex: 0.5, backgroundColor: 'rgba(231, 76, 60,1.0)', alignItems : 'center', justifyContent: 'center'}}>
                                    <Text>{!this.onTime ? 'Không' : 'Trả phòng' }</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                }
            </ImageBackground>
        )
    }

}
const styles = StyleSheet.create({
    line: {
        position: 'absolute',
        top: 0,
        left: 4,
        width: 4,
        bottom: 0,
    },
    timeline: {
        position: 'absolute',
        top: 10,
        bottom: 0,
        left: 0,
        width: 30,
        justifyContent: 'center', // center the dot
        alignItems: 'center',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    header_item_status: {
        flex: 0.08, 
        flexDirection: 'row', 
        backgroundColor: 'white', 
        marginHorizontal: 20, 
        alignItems: 'center',  
        borderRadius: 5,
    }
});
// import React, { Component } from 'react';
// import {
//   AppRegistry,
//   StyleSheet,
//   Text,
//   View,
//   ListView,
// } from 'react-native';

// export default class timeline extends Component {
//   constructor() {
//     super();

//     this.renderRow = this.renderRow.bind(this);

//     const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
//     this.state = {
//       dataSource: ds.cloneWithRows([
//         'row 1',
//         'row 2',
//         'row 3'
//     ]),
//     };
//   }

//   renderRow(rowData, section, row) {
//     const total = this.state.dataSource.getRowCount();
//     const topLineStyle = row == 0 ? [styles.topLine, styles.hiddenLine] : styles.topLine;
//     const bottomLineStyle = row == total - 1 ? [styles.bottomLine, styles.hiddenLine] : styles.bottomLine;
//     console.log(total);
//     console.log(row)
//     return (
//       <View style={styles.row}>
//         <View style={styles.timeline}>
//           <View style={styles.line}>
//             <View style={topLineStyle} />
//             <View style={bottomLineStyle} />
//           </View>
//           <View style={styles.dot} />
//         </View>
//         <View style={styles.content}>
//           <Text>{rowData}</Text>
//         </View>
//       </View>
//     );
//   }

//   render() {
//     return (
//       <View style={styles.container}>
//         <ListView style={styles.listView}
//           dataSource={this.state.dataSource}
//           renderRow={this.renderRow}
//         />
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listView: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   row: {
//     padding: 4,
//     paddingLeft: 0,
//   },
//   content: {
//     marginLeft: 40,
//   },
//   timeline: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     left: 0,
//     width: 40,
//     justifyContent: 'center', // center the dot
//     alignItems: 'center',
//   },
//   line: {
//     position: 'absolute',
//     top: 0,
//     left: 18,
//     width: 4,
//     bottom: 0,
//   },
//   topLine: {
//     flex: 1,
//     width: 4,
//     backgroundColor: 'black',
//   },
//   bottomLine: {
//     flex: 1,
//     width: 4,
//     backgroundColor: 'black',
//   },
//   hiddenLine: {
//     width: 0,
//   },
//   dot: {
//     width: 16,
//     height: 16,
//     borderRadius: 8,
//     backgroundColor: 'black',
//   },
// });