
let guidedata = {};
let reservation = {};
let guideViaName = {};

$(document).ready(function(){
    date = datestring.today();
    firebase.database().ref("guide").on("value",snap => {
        guidedata = snap.val();

        for (let key in guidedata) {
            guideViaName[guidedata[key].name] = key
        }
        init_op_datepicker();
        getOperationData(datestring.today())
    })
    firebase.database().ref("reservation").off("value")
    firebase.database().ref("reservation").orderByChild("date").equalTo(datestring.today()).on("value",snap => {
        reservation[datestring.today()] = snap.val();
    })
})


function getOperationData(date){
    if(operationData[date]){
        inflate_data()
    }else{
        firebase.database().ref("operation/"+date).on("value",snap => {
            operationData[date] = snap.val();
            inflate_data();
        });
    }
}
