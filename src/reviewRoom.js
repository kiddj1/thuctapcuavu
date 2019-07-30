import React, {Component} from 'react';
import {Modal, Text, TouchableHighlight, View, Alert, TouchableOpacity, Image, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
// import console = require('console');



export default class ReviewRoom extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            reload: false,
            data: null,
            like: 0,
        };
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible}, () => {
        });
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

    starRatingRender() {

    }

  render() {
    const {item} = this.props
    if(item.reviews == null) {
        return null
    }

    return (
      <View style={{}}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            this.setModalVisible(!this.state.modalVisible);
          }}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', backgroundColor: 'rgba(80,80,80,0.4)'}}>
            <View style={{width: '100%', height: '100%', backgroundColor: 'white'}}>
                <View style={{ flex: 0.12, justifyContent: 'center', borderBottomWidth: 1, elevation: 4 ,borderBottomColor: 'rgba(236, 240, 241, 0.2)'}}>
                    <View style={{flexDirection: 'row', marginLeft: 10}}>
                        <TouchableOpacity onPress={() => this.setModalVisible(false)} style={{flex: 0.15, justifyContent: 'center', alignItems: 'center'}}>
                            <IconM name={'arrow-left'} size={28} />
                        </TouchableOpacity>
                        <View style={{flex: 0.2}}>
                            <Image
                                source={{uri: item.imgRoom}}
                                style={{width: 40, height: 40}}
                            />
                        </View>
                        <View>
                            <Text style={{fontWeight: '200', color: 'black'}}>{item.name}</Text>
                            <Text>Đánh Giá</Text>
                        </View>
                    </View>
                </View>
                <View style={{flex: 0.88}}>
                    <FlatList 
                        data={item.reviews}
                        extraData={this.state.reload}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item, index}) => {
                            return (
                                <View style={{borderBottomWidth: 0.5}}>
                                    <View style={{paddingBottom: '5%', marginLeft: '4%'}}>
                                        <View style={{ flex: 0.2, flexDirection: 'row', alignItems: 'center', paddingBottom: '5%'}}>
                                            <Image
                                                source={{uri: 'https://png.pngtree.com/element_origin_min_pic/17/09/18/01bcc6c4cb661c2da2febbb8234e09bd.jpg'}}
                                                style={{width: 40, height: 40, borderRadius: 20}}
                                            />
                                            <View style={{flex: 0.05}} />
                                            <Text>{item.user}</Text>
                                        </View>
                                        <View style={{flex: 0.2, flexDirection: 'row', paddingBottom: '5%'}} >
                                            {item.like == 1 ?
                                                <IconM name={'thumb-up'} size={16} color={'green'} />
                                                :
                                                <IconM name={'thumb-down'} size={16} color={'red'} />
                                            }
                                            <View style={{flex: 0.05}} />
                                            <Text>{moment(item.date).format('DD/MM/YYYY')}</Text>
                                        </View>
                                        <View style={{flex: 0.6}}>
                                            <Text ellipsizeMode={'tail'} numberOfLines={6}>{item.text}</Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        }}
                    />
                </View>
            </View>
          </View>
        </Modal>

    
         <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}} onPress={() => {
            this.setModalVisible(true);
          }}>

            <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 12}}> {item.reviews.length} </Text>
                <IconM name='comment-text-multiple-outline' size={16} color={'#9b59b6'} />
            </View>

         </TouchableOpacity> 
      </View>
    );
  }
}