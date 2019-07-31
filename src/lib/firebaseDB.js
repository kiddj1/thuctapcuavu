import firebase from 'react-native-firebase';
import { showMessage, hideMessage } from "react-native-flash-message";
const meettingRoomKey = ['parisroom', 'nhatrangroom', 'easyroom', 'vungtauroom', 'hcmroom', 'hcm1room', ];

export function writeUserData(data, idroom){
    firebase.database().ref(`${meettingRoomKey[idroom]}/`).set(
        data
    ).then((data)=>{
        //success callback
        console.log('data ' , data)
    }).catch((error)=>{
        //error callback
        console.log('error ' , error)
    })
}

export function deleteData(){
    firebase.app().database().ref('meetingRoom/').remove();
}

export function sendComment(data, id) {
    firebase.database().ref(`${id}/`).update({
        reviews: data,
    }).then(() => {
        showMessage({
            message: "Successfully",
            description: "Data saved successfully.",
            type: "success",
            icon: "success"
            // backgroundColor: "rgba(46, 204, 113, 0.8)", // background color
            // color: "#606060", // text color
        });
    }).catch((err) => {

    });
}
export function updateData(data, dataUser){
    firebase.database().ref(`${data.id}/`).update({
        location: data.location,
        bookTime: data.time,
        bookCount: data.bookCount,
    });

    firebase.database().ref(`user_${data.uid}/`).update({
        historyBooking: dataUser.historyBooking,
        uid: dataUser.uid,
    });
}
export function readDataChange(callback, uid) {
    if(uid != null) meettingRoomKey.push(`user_${uid}`)
    meettingRoomKey.map((e , i) => {
        firebase.database().ref(`${e}/`).on('value', function (snapshot) {
            // console.log(snapshot)
            callback.onChange(snapshot.val());
        });
    })
}

export function rejectRoom(id, data){
    firebase.database().ref(`${id}/`).update({
        bookTime: data,
    });
}

export function readData(callback) {
   
    firebase.database().ref(`/`).once('value', function (snapshot) {
        // console.log(snapshot._childKeys)
        // console.log(snapshot.val())
        console.log(snapshot)
        callback.onFetchData(snapshot.val());

    });
   
}