import ModalNew from 'react-native-modal'
import React, { Component } from "react";
import { TouchableOpacity, View, Text, FlatList } from 'react-native';
import moment from 'moment';
// import console = require('console');
export default class BookedScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isVisible: false,
            data: [],
        }
        this.data = [];
    }
   

    setModalVisible(visible) {
        this.setState({isVisible: visible});
        if(visible) {
           console.log('VVVVV',this.data)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.isVisible != prevState.isVisible && this.state.isVisible) {
            this.data = [];
            if(this.props.bookTime.length == 0) this.setState({data: []})

            this.props.bookTime.map((e, i) => {
                if(e.endTime != null && e.endTime - moment().valueOf() > 0){
                    this.data.push(e)
                }
                if(i == this.props.bookTime.length - 1) 
                    this.setState({data: this.data})
            })
        }
    }

    render() {
        console.log('booked', this.props.bookTime)
        return (
            <View>
                <ModalNew
                    isVisible={this.state.isVisible}
                    onBackButtonPress={() => this.setState({isVisible: false})}
                    onBackdropPress={() => this.setState({isVisible: false})}
                    animationOut={'fadeOut'}
                    animationIn={'zoomIn'}
                    animationInTiming={500}
                    style={{margin: 0}}
                >
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{width: '80%', height: '70%',backgroundColor: 'white', alignItems: 'center'}}>
                            <View style={{flex: 0.15, alignSelf: 'flex-start', flexDirection: 'row', marginTop: '2%'}}>
                                <View style={{flex: 0.1}} />
                                <Text  style={{fontSize: 30, color: 'black', textDecorationLine: 'underline'}}>HISTORY</Text>
                            </View>
                           <View style={{flex: 0.85}}>
                            {this.state.data.length == 0 ? 
                                <Text>Chưa có lịch đặt trước </Text>
                                :
                                <FlatList
                                    data={this.state.data}
                                    extraData={this.state.reload}
                                    renderItem={({item, index}) => {
                                        return(
                                            <View style={{ backgroundColor: index % 2 == 0 ? '#bdc3c7' : null, paddingVertical: '4%', marginTop: 5}}>
                                                <Text style={{fontSize: 15, fontWeight: '600'}}>{`${moment(item.time).format('DD/MM/YYYY, HH:mm:ss')} -> ${moment(item.endTime).format('DD/MM/YYYY, HH:mm:ss')}`} </Text>
                                            </View>
                                        )
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            }
                            </View>
                        </View>
                        
                    </View>

                </ModalNew>
                <TouchableOpacity
                    onPress={() => {
                    this.setModalVisible(true);
                    }}>
                    <Text style={{color: 'red'}}>Xem lịch đã đặt </Text>
                </TouchableOpacity>
            </View>
        )
    }
}




