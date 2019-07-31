import React, {Component} from 'react';
import {Modal, Text, TouchableHighlight, View, Alert, TouchableOpacity, Image, FlatList, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import ReviewRoom from './reviewRoom'


export default class TopBooking extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            reload: false,
            data: null,
            onOpenReviewScreen: false,
            indexSelected: null,
        };
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }



    componentDidUpdate(prevProps, prevState, snapshot){
        // if(this.props.data != null && this.props.data != prevProps.data)
        //   this.setState({data: this.props.data})
        // // console.log(this.props)
    //   if(this.modalVisible && this.state.reload != prevState.reload) {
    //       this.setState({reload : !this.state.reload})
    //   }
        
    }
    componentDidMount() {
    }

    //   shouldComponentUpdate(nextProps, nextState){
    //     // console.log(nextProps.data)
    //     // if(nextProps.data.length > 0 && nextProps.data[0].distance > 0){
    //     //   this.setState({reload: !this.state.reload});
    //     // }
    //     // if((this.props.data.length > 0 && nextProps.data[0].distance > 0 && this.props.data[0].distance != nextProps.data[0].distance) || 
    //     // this.state.modalVisible != nextState.modalVisible) {
    //     //   return true
    //     // }
    //     return true
    //     // return false
    //   }


  render() {
    // console.log(this.props.data)
    return (
      <View style={{}}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            this.setModalVisible(!this.state.modalVisible);
          }}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', backgroundColor: 'rgba(80,80,80,0.4)'}}>
            <View style={{width: '100%', height: '100%', backgroundColor: '#EEE5CE'}}>
                <View style={{ flex: 0.1, marginTop: '3%'}}>
                  <View style={{flex: 1, borderColor: '#FFBF3A', backgroundColor: '#FFBF3A', flexDirection: 'row', alignItems: 'center', marginHorizontal: '2%'}}>
                    <View style={{flex: 0.2}} >
                        <TouchableOpacity onPress={() => this.setModalVisible(false)} style={{ justifyContent: 'center', marginLeft: '15%'}}>
                            <IconM name={'arrow-left'} size={28} />
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 0.4}}>
                      <Icon name='md-trophy' size={26} />
                    </View>
                    <View style={{flex: 0.4}}>
                      <Text style={{color: 'white', fontWeight: '600'}}>RANKING</Text>
                    </View>
                  </View>
                </View>
                <View style={{flex: 0.9, marginTop: '3%'}}>
                    <FlatList 
                        data={this.props.data}
                        extraData={this.state.reload}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item, index}) => {
                            // console.log('AAAAA', item)
                            return (
                                <View style={{flex: 1}}>
                                    <View style={{ flexDirection: 'row', paddingBottom: 10, marginHorizontal: '2%'}}>
                                        {index == 0 ?
                                            <View style={{flex: 0.15, backgroundColor: '#FFBF3A', justifyContent: "center"}}>
                                               <Text style={styles.textOrderNumber}>{index + 1}st</Text>
                                            </View>
                                        :
                                        index == 1 ?
                                            <View style={{flex: 0.15, backgroundColor: '#D9D9D9', justifyContent: "center"}}>
                                               <Text style={styles.textOrderNumber}>{index + 1}nd</Text>
                                            </View>
                                        :
                                        index == 2 ?
                                            <View style={{flex: 0.15, justifyContent: "center", backgroundColor: '#D48362'}}>
                                               <Text style={styles.textOrderNumber}>{index + 1}rd</Text>
                                            </View>
                                        :
                                        <View style={{flex: 0.15, justifyContent: "center", backgroundColor: 'rgba(45, 52, 54,1.0)'}}>
                                          <Text style={styles.textOrderNumber}>{index + 1}</Text>
                                        </View>
                                        }

                                       
                                        <View style={{flex: 0.85, flexDirection: 'row', backgroundColor: 'white', alignItems: 'center', paddingVertical: 10, }}>
                                          <View style={{flex: 0.2, marginLeft: '5%'}}>
                                            <Image
                                                source={{uri: item.imgRoom}}
                                                style={{width: 50, height: 50, borderRadius: 25}}
                                            />
                                          </View>
                                          <View style={{flex: 0.6}}>
                                            <Text>{item.name}</Text>
                                          </View>
                                          <View style={{flex: 0.2}}>
                                            <Text style={{textAlign: 'center', color: 'black', fontWeight: '400'}}>{item.bookCount}</Text>
                                            <ReviewRoom item={item} />
                                          </View>
                                        </View>
                                    </View>

                                    {/* <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                                        <View style={{flex: 0.7}} />
                                        <View style={{flex: 0.3, flexDirection: 'row' , justifyContent: 'space-around'}}>
                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                <Text style={{fontSize: 12}}>18 </Text>
                                                <Icon name='md-chatbubbles' size={16} color={'#9b59b6'} />
                                            </View>
                                            <View style={{flexDirection: 'row' , alignItems: 'center'}}>
                                                <Text style={{fontSize: 12}}>18 </Text>
                                                <Icon name='md-star' size={22} color={'#F7DC6F'} />  
                                            </View>
                                        </View>
                                    </View> */}
                                </View>
                            )

                        }}
                    />
                </View>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          onPress={() => {
            this.setModalVisible(true);
          }}>
           <Icon name='md-trophy' size={26} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textOrderNumber: {
    textAlign: 'center',
    color: 'white',
    fontSize: 12,
    fontWeight: '600'
  }
})