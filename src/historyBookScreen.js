import React, {Component} from 'react';
import {Modal, Text, TouchableHighlight, View, Alert, TouchableOpacity, Image, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';


export default class ModalExample extends Component {
  state = {
    modalVisible: false,
    reload: false,
    data: [],
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(this.props.data != null && this.props.data != prevProps.data)
      this.setState({data: this.props.data})
    // console.log(this.props)
    
  }

  shouldComponentUpdate(nextProps, nextState){
    // console.log(nextProps.data)
    // if(nextProps.data.length > 0 && nextProps.data[0].distance > 0){
    //   this.setState({reload: !this.state.reload});
    // }
    // if((this.props.data.length > 0 && nextProps.data[0].distance > 0 && this.props.data[0].distance != nextProps.data[0].distance) || 
    // this.state.modalVisible != nextState.modalVisible) {
    //   return true
    // }
    return true
    // return false
  }


  render() {
    console.log(this.props.data)
    return (
      <View style={{}}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            this.setModalVisible(!this.state.modalVisible);
          }}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', backgroundColor: 'rgba(80,80,80,0.4)'}}>
            <View style={{width: '90%', height: '80%', backgroundColor: 'white', borderRadius: 10}}>
                <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center', marginTop: '3%'}}>
                  <View style={{borderWidth: 1, padding: 5, borderRadius: 5, borderColor: '#2d3436'}}>
                    <Text style={{textAlign: 'center', color: 'black', fontWeight: '600'}}>Book History</Text>
                  </View>
                </View>
                <View style={{flex: 0.9}}>
                  <FlatList
                    data={this.state.data.historyBooking}
                    extraData={this.state.reload}
                    renderItem={({item}) =>  {
                        return (
                        <View style={{borderWidth: 0.5, marginTop: 10, flexDirection: 'row', marginHorizontal: 10, paddingVertical: 10, borderColor: '#EEE', backgroundColor: 'rgba(41, 128, 185, 0.2)'}}>
                          <Image
                              source={{uri: item.imgRoom}}
                              style={{width: 80, height: 80, marginLeft: 10}}
                          />
                          <View style={{flex: 1, marginLeft: 10}}>
                              <View style={{flexDirection: 'row'}}>
                                <Icon name='ios-time' size={18} color={'black'} />
                                <Text style={{marginLeft: 5, fontSize: 12}}>{`${moment(item.time).format('DD/MM/YYYY, hh:mm:ss')}`}</Text>
                              </View>
                              <Text>{item.name}</Text>
                              <View style={{flexDirection: 'row', marginTop: 5}}>
                                <Icon name='md-person' size={16} color={'black'} />
                                <Text style={{fontSize: 12}}> 12</Text>
                                <Icon name='md-easel' size={16} color={'#9b59b6'} style={{marginLeft: 10}} />
                                <Icon name='md-cafe' size={16} color={'#9b59b6'} style={{marginLeft: 10}} />
                              </View>
                          </View>
                        </View> 
                        )
                    
                  
                    }}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          onPress={() => {
            this.setModalVisible(true);
          }}>
           <Text style={{color: 'black', fontSize: 16}}>Your meeting start soon!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}