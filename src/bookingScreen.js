import React, { Component } from "react";
import {View, Text, AsyncStorage, ImageBackground, Image, StyleSheet, TouchableOpacity, Picker, Button, TouchableWithoutFeedback} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import  moment from 'moment';
import * as firebaseDB from './lib/firebaseDB';
import ServicecInclude from './serviceIncludeScreen';
import DateTimePicker from "react-native-modal-datetime-picker";
import { database } from "react-native-firebase";
import BookedScreen from './bookedScreen';
import { isForOfStatement } from "@babel/types";


export default class BookingScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            hour: null,
            uid: null,
            cateringPicked: null,
            projectorPicked: null,
            isStartDateTimePickerVisible: false,
            isEndDateTimePickerVisible: false,
            startTimePicked: null,
            endTimePicked: null,
            dataRoom: null,
        }
        this.time = null;
        this.d = null;
        this.updateDataUserPrevious = [];
        this.startTimeMili = null;
        this.endTimeMili = null;
        this.endTimeLockBooking = null;
    }

    showStartTimePicker = () => {
        this.setState({ isStartDateTimePickerVisible: true });
    };
    
    hideStartTimePicker = () => {
        this.setState({ isStartDateTimePickerVisible: false });
    };

    showEndTimePicker = () => {
        if(this.startTimeMili != null)
            this.setState({ isEndDateTimePickerVisible: true });
        else
            alert('Please pick start time first')
    };
    
    hideEndTimePicker = () => {
        this.setState({ isEndDateTimePickerVisible: false });
    };

    handleDatePicked(date) {
        // let abc = moment(date).format('LL');
        const bookTime = this.props.navigation.state.params.dataRoom.bookTime;
        let invalid = false;
        let valid = false;
        let checkTime = null;
        let checkExistRoomBooking = [];
        // let a = moment(date)
        // a.set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0});
        // console.log(a.valueOf())
        // console.log('ABCDSCSACS', moment(a).valueOf())
        // console.log("A date has been picked: ", moment(date).format('DD/MM/YYYY, h:mm:ss A'));
        // let b = moment(date).format('DD/MM/YYYY')
        
        // if(endTimePicked)
        
        if( (moment().valueOf() - (600 * 1000)) > moment(date).valueOf() ) {
            alert('Vui lòng chọn giờ phù hợp !')
            invalid = true;
        }else {
      
            bookTime.map((e, i) => {
                if(e.endTime > moment().valueOf()) {
                    checkExistRoomBooking.push(e)
                }
            })
            
            if(checkExistRoomBooking.length > 0) {
                let a = moment(date)
                a.set({'second': 0, 'millisecond': 0});

                checkExistRoomBooking.some((e, i) => {
                    if(e.cancel == 'true') return
                    let startTime = moment(e.time)
                    let endTime = moment(e.endTime) 
                    startTime.set({'second': 0, 'millisecond': 0})
                    if(this.state.isStartDateTimePickerVisible) {
                        // when startTime greater than endTime or equal endTime
                        if(a >= endTime)  
                            return true
                        
                        // when startTime less than startTime of Existing room 
                        if((a.valueOf() + (1800 * 1000)) > startTime.valueOf() ) {
                            alert('Không còn trống giờ này')
                            invalid = true
                            return true
                        }
                    }else {
                        //check when endTime > endTime of Existing room
                        if(a.valueOf() > endTime.valueOf()) {
                            return true
                        }

                        if(moment(date).valueOf() <= this.startTimeMili ){
                            alert('endTime must be greater than startTime')
                            invalid = true
                            return true
                        }

                        // check endTime must be (less than or equal) startTime of Existing room 
                        if(a.valueOf() > startTime.valueOf() ) {
                            alert('Không còn trống giờ này')
                            invalid = true
                            return true
                        }
                    }
                })

                // // console.log('VI', a.valueOf())
                // checkTime = bookTime.some((e, i) => {
                //     let b = moment(e.time)
                //     b.set({'second': 0, 'millisecond': 0});
                //     if((a.valueOf() + (1800 * 1000)) <= b.valueOf() ) {
                //         // alert('Không còn trống giờ này1')
                //         return true
                //     }
                //     if(moment(date).valueOf() <= (e.endTime - (1800 * 1000)) ){
                //         alert('Không còn trống giờ này')
                //         invalid = true
                //         return true
                //     }
                // })
            }
        }
   
        // if(checkTime) return

        // console.log(moment(date).format('DD/MM/YYYY')) 
        if(this.state.isStartDateTimePickerVisible){
            if(!invalid){
                this.startTimeMili = moment(date).valueOf()
                this.endTimeLockBooking = moment(date)
                this.endTimeLockBooking.set({'hour': 23, 'minute': 30, 'second': 0, 'millisecond': 0});
                this.setState({startTimePicked: moment(date).format('DD/MM/YYYY, HH:mm:ss'), endTimePicked: null})
            }
            this.hideStartTimePicker();
        }else{
            if(!invalid){
                this.endTimeMili = moment(date).valueOf()
                // let endTimeLockBooking = moment(date)
                // endTimeLockBooking.set({'hour': 20, 'minute': 30, 'second': 0, 'millisecond': 0});
                // if(this.endTimeLockBooking.valueOf() < this.endTimeMili) {
                //     alert('Phòng họp chỉ hoạt động trước 22h30 ')
                // }else {
                //     this.setState({endTimePicked: moment(date).format('DD/MM/YYYY, HH:mm:ss')})
                // }
                this.setState({endTimePicked: moment(date).format('DD/MM/YYYY, HH:mm:ss')})
            }

           
            this.hideEndTimePicker();
        }
        
        
    };

    bookThisRoom(data, dataUser) {
        let service = []
        if(this.state.startTimePicked == null || this.state.endTimePicked == null){
            alert('Chọn giờ để book phòng họp này')
            return;
        }
        console.log(dataUser)
        // let time = moment().add(15, 'minutes').valueOf() 
        // this.updateDataUserPrevious = dataUser;
        // if(this.updateDataUserPrevious == null || this.updateDataUserPrevious.length == 0) {
        //     this.updateDataUserPrevious = {
        //         historyBooking: [{
        //             time: moment().add(15, 'minutes').valueOf(),
        //             idRoom: data.id
        //         }],
        //         uid: this.state.uid,
        //     }
        // }else{
        //     this.updateDataUserPrevious = {
        //         historyBooking: [{
        //             time: moment().add(15, 'minutes').valueOf(),
        //             idRoom: data.id
        //         },].concat(dataUser)
        //     }
        // }

        if(this.state.projectorPicked != null){
            service.push(this.state.projectorPicked)
        }
        if(this.state.cateringPicked != null){
            service.push(this.state.cateringPicked)
        }
        

        let userObjectProperty = {
            startTime: this.startTimeMili,
            endTime: this.endTimeMili,
            idRoom: data.id,
            imgRoom: data.imgRoom,
            name: data.name,
        }

        let dataUserBooking = {
            historyBooking: dataUser == null ? 
            [userObjectProperty] 
            : 
            [userObjectProperty].concat(dataUser.historyBooking),
            uid: this.state.uid,
        }

        //BookTime data
        let dataBookTime = {
            time: this.startTimeMili, 
            uidUser: this.state.uid, 
            endTime: this.endTimeMili, 
            service: service, 
            idBooking: moment().unix(), 
            cancel: 'false',
        }
        
        let bookRoom = {
            time:  data.bookTime === null ? [dataBookTime] : [dataBookTime].concat(data.bookTime),
            uid: this.state.uid,
            content: '',
            id: data.id,
            bookCount: data.bookCount == null ? 1 : data.bookCount + 1,
        }
        firebaseDB.updateData(bookRoom, dataUserBooking)
        this.props.navigation.goBack()
    }

    componentWillUnmount(){
        // clearInterval(this.time)
    }

    async componentDidMount(){
        const userToken = await AsyncStorage.getItem('uid');
        this.setState({uid: userToken})

        // this.time = setInterval(() => {
        //     this.setState({hour: moment().add(15, 'minutes').format('hh:mm A')})
        // },1000)
    }

    componentDidUpdate(prevProps, prevState) {

    }
    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.hour != nextState.hour || this.state.projectorPicked != nextState.projectorPicked 
            || this.state.isStartDateTimePickerVisible != nextState.isStartDateTimePickerVisible
            || this.state.isEndDateTimePickerVisible != nextState.isEndDateTimePickerVisible
            || this.state.startTimePicked != nextState.startTimePicked
            || this.state.endTimePicked != nextState.endTimePicked
            || this.props.navigation.state != nextProps.navigation.state
            ) return true

        return false
    }

    servicePicked(data) {
        console.log(data)
       this.setState({projectorPicked: data[0], cateringPicked: data[1]})

    }

    render(){
        console.log('rerender')
        const item = this.props.navigation.state.params.dataRoom;
        const dataUser = this.props.navigation.state.params.dataUser;
        return(
            <ImageBackground source={require('../resource/img/AzurLane.jpg')} style={{width: '100%', height: '100%'}}>
                <View style={{flex: 1}}>
                    <View style={{flex: 0.08, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                        
                        <TouchableWithoutFeedback  onPress={() => this.props.navigation.goBack()}>
                            <View style={{flex: 0.2, alignItems: 'center'}}>
                                <Icon name='md-arrow-dropleft' size={26} />
                            </View>
                        </TouchableWithoutFeedback>
                   
                        <View style={{flex: 0.6, alignItems: 'center'}}>
                            <Text>{item.name}</Text>
                       </View>
                       <View style={{flex: 0.2, alignItems: 'center'}}>
                            <Icon name='md-bookmark' size={26} />
                       </View>
                    </View>
                    <View style={{flex: 0.3}}>
                        <Image
                            source={{uri: item.imgRoom}}
                            style={{width: '100%', height: '100%'}}
                        />
                        <View style={{position: 'absolute', bottom: '20%', left: 10}}>
                            <View style={{backgroundColor: '#2c3e50', position: 'absolute', height: '100%', width: '100%', opacity: 0.6 }} />
                            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18, marginHorizontal: 10 }}>{item.name}</Text>
                            <Text style={{color: 'white', marginHorizontal: 10}}>Room 203 - Floor 2</Text>
                        </View>
                    </View>
                    <View style={{flex:0.2, backgroundColor: 'white', borderBottomWidth: 0.5, borderBottomColor: 'rgba(140, 140, 140, 0.5)'}}>
                        <View style={{ marginTop: 10, marginLeft: 12}}>
                            <Text style={{color: '#8e44ad', fontWeight: 'bold', fontSize: 16}}>Reservation info</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Icon name='md-timer' size={26} color={'#9b59b6'} />
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{marginLeft: 10}}>{this.state.startTimePicked == null ? 'Please pick start time' : this.state.startTimePicked}</Text>
                                </View>
                                {/* <Button title="Pick" onPress={this.showStartTimePicker} style={{marginLeft: 5}} /> */}
                                <TouchableOpacity onPress={() => this.showStartTimePicker()}>
                                    <IconM name='plus-circle-outline' size={26} color={'#9b59b6'} />
                                </TouchableOpacity>
                                <DateTimePicker
                                    mode={'datetime'}
                                    date={new Date()}
                                    isVisible={this.state.isStartDateTimePickerVisible}
                                    onConfirm={this.handleDatePicked.bind(this)}
                                    onCancel={this.hideStartTimePicker}
                                />
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center', paddingTop: 10}}>
                                <Icon name='md-clock' size={26} color={'#9b59b6'} />
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{marginLeft: 10}}>{this.state.endTimePicked == null ? 'Please pick end time': this.state.endTimePicked}</Text>
                                </View>
                                {/* <Button title="Pick" onPress={this.showEndTimePicker} style={{marginLeft: 5}} /> */}
                                <TouchableOpacity onPress={() => this.showEndTimePicker()}>
                                    <IconM name='plus-circle-outline' size={26} color={'#9b59b6'} />
                                </TouchableOpacity>
                                <DateTimePicker
                                    mode={'datetime'}
                                    date={moment(this.startTimeMili).add(30, 'm').toDate()}
                                    isVisible={this.state.isEndDateTimePickerVisible}
                                    onConfirm={this.handleDatePicked.bind(this)}
                                    onCancel={this.hideEndTimePicker}
                                />
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{flex: 0.9}}></View>
                                <BookedScreen bookTime={item.bookTime} />
                            </View>
                        </View>
                    </View>
                    <View style={{flex:0.26, backgroundColor: 'white', borderBottomWidth: 0.5, borderBottomColor: 'rgba(140, 140, 140, 0.5)',}}>
                        <View style={{ marginTop: 10, marginLeft: 12}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{color: '#8e44ad', fontWeight: 'bold', fontSize: 16}}>Services included</Text>
                                <ServicecInclude servicePicked={this.servicePicked.bind(this)} />
                            </View>
                            
                            <View style={{ justifyContent: 'center'}}>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                                    <View style={{ backgroundColor: 'rgba(140, 140, 140, 0.5)', height: 50, width: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 25}}>
                                        <Icon name='md-cafe' size={26} color={'#9b59b6'} />
                                    </View>
                                    <Text style={{marginLeft: 15, fontSize: 16}}>Catering : {this.state.cateringPicked != null ? this.state.cateringPicked.catering : ''}</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                                    <View style={{ backgroundColor: 'rgba(140, 140, 140, 0.5)', height: 50, width: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 25}}>
                                        <Icon name='md-easel' size={26} color={'#9b59b6'} />
                                    </View>
                                    <Text style={{marginLeft: 15, fontSize: 16}}>Projector {this.state.projectorPicked != null ? `: ${this.state.projectorPicked.projector}` : ''}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{flex: 0.16, backgroundColor: 'white'}}>
                        <View style={{marginLeft: 10, marginTop: 10}}>
                            <Text style={{fontSize: 18, color: 'rgba(140, 140, 140, 0.5)'}}>Information</Text>
                        </View>
                        <TouchableOpacity style={{backgroundColor: '#9b59b6', marginHorizontal: 20, height: '50%', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginTop: 10}} onPress={() => this.bookThisRoom(item, dataUser)}>
                            <Text style={{color: 'white'}}>Book this Room</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        )
    }   
}

const styles = StyleSheet.create({

})