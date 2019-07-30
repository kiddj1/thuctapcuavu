import React, {Component} from 'react';
import {Modal, Text, TouchableHighlight, View, Alert, TouchableOpacity, Image, FlatList, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';

export default class ServiceInclude extends Component {

  constructor(props) {
    super(props)
    this.previousAcceptOption = null;
  }
  state = {
    modalVisible: false,
    reload: false,
    cafePress: false,
    projectorPress: true,
    switchOptionCoffee: 0,
    optionCoffee: ['Milk Coffee', 'Pure Coffee'],
    optionProjector: [
      {data: '50 inch', picked: true}, {data: '70 inch', picked: false}, {data: '100 inch', picked: false}
    ],
    previousAcceptOption: null,
    optionCatering: [{data: ['Milk Coffee', 'Pure Coffee'], picked: false},{data: 'Bottled Water', picked: false}, {data: 'Soft Drink', picked: false}],
    option1: true,
    option2: false,
    option2: false,

  };

  setModalVisible(visible) {
    if(this.previousAcceptOption != null)
      this.pickProjector(this.previousAcceptOption)
    
    this.setState({modalVisible: visible})
  }

  // componentDidUpdate(prevProps, prevState, snapshot){
  //   if(prevProps.data.length > 0){
  //     console.log(prevProps.data[0].seconds )
  //     console.log(this.props.data[0].seconds)
  //   }
  //   // if(prevProps.data.length > 0 && prevProps.data[0].distance > 0){
  //   //   console.log("DSAHUDIHWQIUDHWIQUHDIQWUHDUWQI")
  //   //   this.setState({reload: !this.state.reload});
  //   // }
  // }

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

  switchOptionCoffeeFunction(){
    let indexCount = this.state.switchOptionCoffee;
    if(indexCount == this.state.optionCoffee.length - 1)
      indexCount = 0;
    else
      indexCount += 1;
      
      this.setState({switchOptionCoffee: indexCount}, console.log(this.state.switchOptionCoffee))
  }
  isServicePress(data) {
    let isServicePress = this.state.projectorPress ? this.state.optionProjector[data].picked : this.state.optionCatering[data].picked;
    if(isServicePress)
      return true
    else 
      return false
  }

  pickProjector(data){
      if(this.state.projectorPress){
        this.state.optionProjector.map((e, i) => {
          this.state.optionProjector[i].picked = false;
          if(i == data){
            this.state.optionProjector[i].picked = true;
            this.setState(this.state.optionProjector);
          }
        })
      }else{
        this.state.optionCatering[data].picked = !this.state.optionCatering[data].picked
        console.log(this.state.optionCatering[data].picked)
        this.setState(this.state.optionCatering);
      }
  }

  acceptPressed(){
      let servicePicked = [];
      this.state.optionProjector.map((e, i) => {
        if(e.picked){ 
          servicePicked.push({projector: e.data})
          this.previousAcceptOption = i;
        }
      })
      this.state.optionCatering.map((e, i) => {
        if(e.picked){ 
          if(Array.isArray(e.data))
            servicePicked.push({catering: e.data[this.state.switchOptionCoffee]})
          else
            servicePicked.push({catering: e.data})
          // this.previousAcceptOption = i;
        }
      })
      this.props.servicePicked(servicePicked);
      this.setModalVisible(false);
  }

  render() {
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
            <View style={{width: '80%', height: '70%', backgroundColor: 'white', borderRadius: 10}}>
                <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center', marginTop: '3%'}}>
                    <Text style={{textAlign: 'center', color: 'black', fontWeight: '400', fontSize: 16}}>SERVICE INCLUDE</Text>
                </View>
                <View style={{flex: 0.2 , flexDirection: 'row', justifyContent: 'space-around', marginTop: '5%'}}>
                    <TouchableOpacity style={{backgroundColor: this.state.projectorPress ? '#EB5061' : 'rgba(189, 195, 199, 0.5)', borderRadius: 50, justifyContent: 'center', alignItems: 'center', width: 100, height: 100}} onPress={() => this.setState({projectorPress: true, cafePress: false})}>
                        <Icon name='md-easel' size={45} color={'white'} style={{}} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: this.state.cafePress ? '#EB5061' : 'rgba(189, 195, 199, 0.5)', borderRadius: 50, justifyContent: 'center', alignItems: 'center', width: 100, height: 100}} onPress={() => this.setState({cafePress: true, projectorPress: false})}>
                        <Icon name='md-cafe' size={45} color={'white'} style={{}} />
                    </TouchableOpacity>
                </View>
                <View style={{marginTop: '10%', flex: 0.56, alignItems: 'center',}}>
                  <TouchableOpacity style={[styles.optionProjector, {flexDirection: 'row', alignItems: 'center'}, [this.isServicePress(0) && {backgroundColor: 'rgba(83, 92, 104, 0.5)'}] ]} onPress={() => this.pickProjector(0)} >
                    <Animatable.Text style={{textAlign: 'center', color: 'black', marginLeft: !this.state.projectorPress ? 10 : 0}}>{`${this.state.projectorPress ? this.state.optionProjector[0].data : this.state.optionCoffee[this.state.switchOptionCoffee]}` } </Animatable.Text>
                    {!this.state.projectorPress && 
                      <TouchableOpacity style={{}} onPress={() => this.switchOptionCoffeeFunction()}>
                        <Icon name='md-arrow-dropright' size={30} style={{paddingHorizontal: 10}} />
                      </TouchableOpacity>
                    }
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.optionProjector, {marginTop: 10} , [this.isServicePress(1) && {backgroundColor: 'rgba(83, 92, 104, 0.5)'}]  ]} onPress={() => {this.pickProjector(1)}} >
                    <Text style={{textAlign: 'center', color: 'black'}}>{`${this.state.projectorPress ? this.state.optionProjector[1].data : this.state.optionCatering[1].data}`}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.optionProjector, {marginTop: 10}, [this.isServicePress(2) && {backgroundColor: 'rgba(83, 92, 104, 0.5)'}]  ]} onPress={() => {this.pickProjector(2)}}>
                    <Text style={{textAlign: 'center', color: 'black'}}>{`${this.state.projectorPress ? this.state.optionProjector[2].data : this.state.optionCatering[2].data}`}</Text>
                  </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', flex: 0.14}}>
                  <TouchableOpacity activeOpacity={0.7} style={{flex: 0.5, alignItems: 'center', borderWidth: 0.5, justifyContent: 'center', backgroundColor: '#807F80', borderColor: 'transparent'}} onPress={() => this.acceptPressed()}>
                    <Text style={{color: 'white'}}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => this.setModalVisible(false)} style={{flex: 0.5, alignItems: 'center', borderWidth: 0.5, justifyContent: 'center', borderColor: 'transparent', borderLeftColor: 'rgba(236, 240, 241,1.0)', backgroundColor: '#EB5061'}}>
                    <Text style={{color: 'white'}}>Cancel</Text>
                  </TouchableOpacity>
                </View>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          onPress={() => {
            this.setModalVisible(true);
          }}
          style={{marginLeft: 5}}
        >
           <Icon name='md-add-circle' size={25} color={'#535c68'} />
        </TouchableOpacity>
      </View>   
    );
  }
}
const styles = StyleSheet.create({
    optionProjector: {
      height: '20%', 
      width: '50%', 
      backgroundColor: 'rgba(242, 242, 242, 1))',
      justifyContent: 'center'
    }
})