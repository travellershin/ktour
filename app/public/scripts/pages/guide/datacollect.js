$(document).ready(function(){
    console.log("hi")
    firebase.database().ref("guide").on("value", snap =>{
        let data = snap.val();
        console.log(data)
    })
})
