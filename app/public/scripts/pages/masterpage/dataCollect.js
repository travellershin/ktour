$(document).ready(function(){
    if(window.localStorage["ktlkey"]){
        let loginKey = window.localStorage["ktlkey"];
        let loginToken = window.localStorage["ktltoken"];
        firebase.database().ref("auth").once("value", snap => {
            adata = snap.val();
            if(adata[loginKey].token === loginToken && adata[loginKey].validdate === datestring.today() && adata[loginKey].grade===4){
                master_init();
            }else{
                location.href = './index.html'
            }
        });
    }else{
        location.href = './index.html'
    }
})
let m_authData = {};
let gData = {};
let iArray = [];

function master_init(){
    firebase.database().ref("guide").on("value", snap => {
        gData = snap.val();
        console.log(gData);
        firebase.database().ref("auth").on("value", snap => {
            m_authData = snap.val();
            for (let key in m_authData) {
                m_authData[key].key = key;
                iArray.push(m_authData[key])
            }
            inflate();
        });
    })


}
