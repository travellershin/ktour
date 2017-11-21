let guideData = {}
let IAArray = []; //inflate asset array

let order = []

$(document).ready(function(){
    order.push("cash")
    firebase.database().ref("guide").on("value", snap =>{
        guideData = snap.val();
        init_datepicker();
        inflateInfo();

        IAArray = []
        for (let key in guideData) {
            guideData[key].key = key
            IAArray.push(guideData[key])

            if(guideData[key].asset){
                guideData[key].assetLength = Object.keys(guideData[key].asset).length
            }else{
                guideData[key].assetLength = 0
            }
            if(!guideData[key].cash){
                guideData[key].cash = 0
            }
        }

        inflateAsset(IAArray);
    })
})

$(".sort_cash").click(function(){
    order.push("cash");
    console.log(order)
    inflateAsset(IAArray);
})
$(".sort_asset").click(function(){
    order.push("assetLength");
    console.log(order)
    inflateAsset(IAArray);
})
$(".sort_name").click(function(){
    order.push("name");
    console.log(order)
    inflateAsset(IAArray);
})


function inflateInfo(){

    let txt = ""
    console.log(guideData)

    for (let key in guideData) {
        let guide = guideData[key]

        txt+='<div class="g_card" gid="'+key+'"><div class="g_card_top"><div class="g_card_face_wrapper"><img class="g_card_face" src="'+guide.imgUrl+'"/>'
        txt+='</div><p class="g_card_name">'+guide.name+'</p></div><div class="g_card_line"><p class="g_card_title">LANGUAGES</p><p class="g_card_contents g_card_info_language">'
        if(guide.language){
            txt+=guide.language.join(", ")+'</p></div>'
        }else{
            txt+='</p></div>'
        }
        txt+='<div class="g_card_line"><p class="g_card_title">DRIVER</p><p class="g_card_contents g_card_info_driver">';
        if(guide.driver){txt+="O"}else{txt+="X"}
        txt+='</p></div><div class="g_card_line g_card_line--bottom"><p class="g_card_title">MEMO</p><p class="g_card_contents g_card_info_memo">'+guide.memo+'</p>'
        txt+='</div></div>'
    }

    $(".g_card_box").html(txt)
}

function inflateAsset(garray){

    let atxt = "" //guide asset txt

    for (let i = 0; i < order.length; i++) {
        if(order[i] === "name"){
            garray.sort(function(a,b){
                return a[order[i]] < b[order[i]] ? -1 : a[order[i]] > b[order[i]] ? 1 : 0;
            })
        }else{
            garray.sort(function(a,b){
                return a[order[i]] < b[order[i]] ? 1 : a[order[i]] > b[order[i]] ? -1 : 0;
            })
        }
    }



    for (let i = 0; i < garray.length; i++) {
        let guide = garray[i]

        let cash = "0 원"
        if(guide.cash){
            cash = comma(guide.cash)+" 원"
        }

        atxt+='<div class="ga" gid="'+guide.key+'"><div class="g_card_top"><div class="g_card_face_wrapper"><img class="g_card_face" src="'+guide.imgUrl+'"/></div><p class="g_card_name">'+guide.name+'</p></div>'
        if(guide.asset){
            let number = Object.keys(guide.asset).length
            atxt+='<div class="ga_asset_box"><div class="ga_asset_top"><p class="ga_asset_top_title">ASSET</p><p class="ga_asset_top_number">'+number+'</p></div><div class="ga_asset_body">'
            for (let key in guide.asset) {
                let gasset = guide.asset[key];
                atxt+= '<div class="ga_asset"><p class="ga_asset_name">'+gasset.asset+'</p><p class="ga_asset_number">'+gasset.left+'</p></div>'
            }
        }else{
            atxt+='<div class="ga_asset_box"><div class="ga_asset_top"><p class="ga_asset_top_title">ASSET</p><p class="ga_asset_top_number">0</p></div><div class="ga_asset_body">'
        }
        atxt+='</div></div><div class="ga_cash_box"><p class="ga_cash_title">CASH</p><div class="ga_cash"><p class="ga_cash_name">현금</p><p class="ga_cash_number">'+cash+'</p></div></div></div>'
    }

    $(".ga_box").html(atxt)
}


function init_datepicker(){
    $('.g_e_input_start').daterangepicker({
        "autoApply": true,
        singleDatePicker: true,
        locale: { format: 'YYYY-MM-DD'}
    },function(start,end,label){
        console.log("시작일 : " + start.format('YYYY-MM-DD'));
    })

    $('.g_e_input_end').daterangepicker({
        "autoApply": true,
        singleDatePicker: true,
        locale: { format: 'YYYY-MM-DD'}
    },function(start,end,label){
        console.log("종료일 : " + start.format('YYYY-MM-DD'));
    })
}
