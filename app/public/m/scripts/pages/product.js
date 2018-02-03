let product = new Product();
let cid = ""
let languageArray = ["Korean","Thai","English","Vietnamese","Chinese","Tagalog","Cantonese","French","Japanese","Spanish","Indonesian","German"]
let keyArray = [];
let isUpdating =



$('.pi_footer_edit').click(function(){
    product.edit($(this).attr('cid'));
})

$('.pi_footer_delete').click(function(){
    let doublecheck = confirm('상품과 관련된 모든 정보가 복구 불가능하게 제거됩니다. 제거할까요?')
    if(doublecheck){
        product.delete($('.pi_footer_delete').attr('id'))
    }
})

$(document).on("keyup", ".pei_id", function(){
    cid = $(".pei_id").val()
})

$('.pei_language').click(function(){
    console.log('language')
    if($(this).hasClass('pei_language_selected')){
        $(this).removeClass('pei_language_selected')
        $(".pei_language_cb").eq($(".pei_language").index(this)).css("background-image","url(./assets/checkboxes-default.svg)")
    }else{
        $(this).addClass('pei_language_selected')
        $(".pei_language_cb").eq($(".pei_language").index(this)).css("background-image","url(./assets/checkboxes-active.svg)")
    }
})

$('.pei_available').click(function(){
    if($(this).hasClass('pei_available_selected')){
        $(this).removeClass('pei_available_selected')
        $(".pei_available_cb").eq($(".pei_available").index(this)).css("background-image","url(./assets/checkboxes-default.svg)")
    }else{
        $(this).addClass('pei_available_selected')
        $(".pei_available_cb").eq($(".pei_available").index(this)).css("background-image","url(./assets/checkboxes-active.svg)")
    }
})

$('.pei_pickup_yes').click(function(){
    $(this).addClass('pei_pickup_selected');;
    $(".pei_pickup_no").removeClass('pei_pickup_selected');
    $(".pei_pickup_radio").eq(0).css("background-image","url(./assets/icon-radio-check.svg)");
    $(".pei_pickup_radio").eq(1).css("background-image","url(./assets/icon-radio-default.svg)");
})

$('.pei_pickup_no').click(function(){
    $(this).addClass('pei_pickup_selected');
    $(".pei_pickup_yes").removeClass('pei_pickup_selected');
    $(".pei_pickup_radio").eq(1).css("background-image","url(./assets/icon-radio-check.svg)");
    $(".pei_pickup_radio").eq(0).css("background-image","url(./assets/icon-radio-default.svg)");
})
 $(".pei_possibles").focusout(function(){
     let possibles = $(".pei_possibles").val().split(";");
     let html = ""
     for (let i = 0; i < possibles.length; i++) {
         html += possibles[i].trim().replace(/(\r\n|\n|\r)/gm,"") + "\n";
     }
     html += "이상 총 "+possibles.length*1 + "개가 입력됩니다."

     alert(html)
     console.log(possibles)
 })


$(".pe_save").click(function(){
    cid = $(".pei_id").val()
    console.log(cid)
    if(cid === window.localStorage["init_cid"]){
        product.save();
    }else{
        if(keyArray.indexOf(cid)>-1){
            //cid가 달라졌는데, 기존에 있는 것에 덮어쓰려는 경우 경고를 출력
            let confirmUpdate = confirm("기존에 '"+cid+"' 상품이 이미 존재합니다. 저장하면 정보가 덮어 씌워질 것입니다. 저장하시겠습니까?")
            if(confirmUpdate){
                firebase.database().ref("product/"+window.localStorage["init_cid"]).remove();
                product.save();
                keyArray.splice(keyArray.indexOf(window.localStorage["init_cid"]), 1);
            }

        }else{
            firebase.database().ref("product/"+window.localStorage["init_cid"]).remove();
            product.save();
            keyArray.splice(keyArray.indexOf(window.localStorage["init_cid"]), 1);
        }
    }

})

function Product(){
    this.show = function(){
        window.localStorage['init_cid'] = "";

        firebase.database().ref("product").once("value", snap => {
            let data = snap.val();
            // TODO: 도시명 DB에서 입력받아 for문 돌리기
            console.log(data)
            let txt = ""

            for (var keys in data) {
                keyArray.push(keys)

                let fullName = keys.split("_");
                let place = fullName[0];
                let regularity = fullName[1];
                let name = fullName[2];
                let code = data[keys].info.code
                let start = '17-08-23';
                let end = '17-08-23';
                let price_adult = '132,000'
                let price_child = '32,000'
                let net_adult = '132,000'
                let net_child = '32,000'
                let agency_total = 13;
                let agency_ongoing = 4;
                let agency_screening = 5;
                let agency_rejected = 4;


                // TODO: bgco_green부분과 ON에 데이터 넣기
                txt+= '<div class="pc" id="'+keys+'"><div class="pc_status"><div class="bgco_green">ON</div></div><p class="pc_place">'+place+'</p><p class="pc_regularity">'
                txt+= regularity+'</p><div class="pc_product"><p>'+name+'</p><p class="font_grey">'+code+'</p></div><p class="pc_start">'+start+'</p><p class="pc_end">'+end+'</p>'
                txt+= '<div class="pc_price"><p>adult '+price_adult+'won</p><p>child '+price_child+'won</p></div><div class="pc_net"><p>adult '+net_adult+'won</p><p>child '+net_child+'won</p></div>'
                txt+= '<div class="pc_agency"><p>'+agency_total+'개</p><p class="font_grey">(진행'+agency_ongoing+' 심사'+agency_screening+' 거절'+agency_rejected+')</p></div></div>'
            }

            $('.pc_box').html(txt)
        })
    }

    this.show_info = function(cid){

        $('.pi_footer_delete').attr('id', cid)

        firebase.database().ref("product/"+cid).once("value", snap => {
            let data = snap.val();
            $('.lightBox_shadow').removeClass('hidden');
            $('.pi').removeClass('hidden');

            let strArray = ["destination","place","regularity","period","status","description","ending","pickup","itinerary","cancellation","inclusive","exclusive","others"]
            $('.pii_id').html('('+data.info.code+')'+" "+cid);
            $('.pi_header_title').html('('+data.info.code+')'+" "+cid)

            for (var i = 0; i < strArray.length; i++) {
                $('.pii_'+strArray[i]).html(data.info[strArray[i]])
            }

            let status = data.info.status
            if(status === "ONGOING"){
                $('.pii_status').addClass('bgco_green');
                $('.pii_status').removeClass('bgco_orange');
                $('.pii_status').removeClass('bgco_red');
            }else if(status === "STOP"){
                $('.pii_status').removeClass('bgco_green');
                $('.pii_status').removeClass('bgco_orange');
                $('.pii_status').addClass('bgco_red');

            }else{
                $('.pii_status').removeClass('bgco_green');
                $('.pii_status').addClass('bgco_orange');
                $('.pii_status').removeClass('bgco_red');
            }

            let langShowTxt = "";
            for (var i = 0; i < data.info.language.length; i++) {
                if(data.info.language[i] === 1){
                    langShowTxt+=languageArray[i]+", "
                }
            }
            langShowTxt = langShowTxt.slice(0,-2);
            $('.pii_language').html(langShowTxt)

            let availShowTxt = "Every "
            let dayInWeekArray = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday","<br>*Except holiday"]
            for (var i = 0; i < 7; i++) {
                if(data.info.available[i] === 1)
                availShowTxt+= dayInWeekArray[i] + ", "
            }
            availShowTxt = availShowTxt.slice(0,-2);
            if(data.info.available[7] === 1){
                availShowTxt+= dayInWeekArray[7]
            }

            $('.pii_available').html(availShowTxt)

            $('.pii_itinerary').height(1).height($('.pii_itinerary').prop('scrollHeight'));
            $('.pii_cancellation').height(1).height($('.pii_cancellation').prop('scrollHeight'));
            $('.pii_description').height(1).height($('.pii_description').prop('scrollHeight'));
            $('.pii_inclusive').height(1).height($('.pii_inclusive').prop('scrollHeight'));
            $('.pii_exclusive').height(1).height($('.pii_exclusive').prop('scrollHeight'));
            $('.pii_others').height(1).height($('.pii_others').prop('scrollHeight'));

            $('.pii_cutoff').html(data.info.cutoff +' day(s) before')
            $('.pii_participants').html('Min ' +data.info.participants_min +' / Max '+data.info.participants_max)

            let meetTxt = ""
            for (var i = 0; i < data.info.meeting_location.length; i++) {
                meetTxt += (i+1)+". "+data.info.meeting_location[i]+"<br>"
            }
            meetTxt = meetTxt.slice(0,-4);

            $('.pii_meeting').html(meetTxt)

            $('.pi_footer_edit').attr('cid',cid)
        })
    }


    this.save = function(){

        keyArray.push(cid)

        let info_data = {
            destination:"",
            place:"",
            regularity:"",
            status:"",
            language:[0,0,0,0,0,0,0,0,0,0,0,0],
            period:"",
            available:[0,0,0,0,0,0,0,0],
            description:"",
            cutoff:0,
            participants_min:0,
            participants_max:0,
            meeting_location:[],
            pickup:"YES",
            cancellation:"",
            itinerary:"",
            code:"",
            ending:"",
            inclusive:"",
            exclusive:"",
            others:"",
        };

        for (var keys in info_data) {
            switch (keys) {
                case "language":
                    let languagedivArray = document.getElementsByClassName('pei_language');
                    for (let i = 0; i < info_data.language.length; i++) {
                        if($(languagedivArray[i]).hasClass("pei_language_selected")){
                            info_data.language[i] = 1;
                        }else{
                            info_data.language[i] = 0;
                        }
                    }

                    break;

                case "available":
                    let availabledivArray = document.getElementsByClassName('pei_available');
                    for (let i = 0; i < info_data.available.length; i++) {
                        if($(availabledivArray[i]).hasClass("pei_available_selected")){
                            info_data.available[i] = 1;
                        }else{
                            info_data.available[i] = 0;
                        }
                    }

                    break;

                case "pickup":

                    if($(".pei_pickup_yes").hasClass('pei_pickup_selected')){
                        info_data.pickup = "YES";
                    }else{
                        info_data.pickup = "NO";
                    }

                    break;

                case "meeting_location":
                    let meetingDivArray = document.getElementsByClassName('pei_meeting');
                    for (var i = 0; i < meetingDivArray.length; i++) {
                        info_data.meeting_location.push($(meetingDivArray[i]).val())
                    }

                    break;

                default:info_data[keys] = $('.pei_'+keys).val()

            }
        }

        let possibles = $(".pei_possibles").val().split(";");
        for (let i = 0; i < possibles.length; i++) {
            possibles[i] = possibles[i].trim();
        }

        firebase.database().ref("product/"+cid+"/info").set(info_data);
        firebase.database().ref("product/"+cid+"/possibles").set(possibles)

        $('.pe').addClass('hidden')
        this.show()
        this.show_info(cid);
    }

    this.edit = function(cid){

        window.localStorage['init_cid'] = cid;

        firebase.database().ref("product/"+cid).once("value", snap => {
            let data = snap.val();

            let info = data.info;

            $('.pi').addClass('hidden');
            $('.pe').removeClass('hidden');

            let inputStringArray = ["code","possibles","ending","destination","place","regularity","status","period","description","cancellation","itinerary","inclusive","exclusive","others"];

            for (var i = 0; i < inputStringArray.length; i++) {
                $(".pei_"+inputStringArray[i]).val(info[inputStringArray[i]])
            }

            $('.pei_id').val(cid)

            let inputNumberArray = ["participants_max","participants_min","cutoff"];

            for (var i = 0; i < inputNumberArray.length; i++) {
                $(".pei_"+inputNumberArray[i]).val(info[inputNumberArray[i]]*1)
            }

            let possiblesTxt = ""
            for (var i = 0; i < data.possibles.length; i++) {
                possiblesTxt += data.possibles[i].trim() + ";"
            }
            possiblesTxt = possiblesTxt.slice(0,-1);
            $('.pei_possibles').val(possiblesTxt);

            for (var i = 0; i < info.available.length; i++) {
                if(info.available[i] === 1){
                    $('.pei_available').eq(i).addClass('pei_available_selected')
                    $(".pei_available_cb").eq(i).css("background-image","url(./assets/checkboxes-active.svg)")
                }else{
                    $('.pei_available').eq(i).removeClass('pei_available_selected')
                    $(".pei_available_cb").eq(i).css("background-image","url(./assets/checkboxes-default.svg)")
                }
            }

            for (var i = 0; i < info.language.length; i++) {
                if(info.language[i] === 1){
                    $('.pei_language').eq(i).addClass('pei_language_selected')
                    $(".pei_language_cb").eq(i).css("background-image","url(./assets/checkboxes-active.svg)")
                }else{
                    $('.pei_language').eq(i).removeClass('pei_language_selected')
                    $(".pei_language_cb").eq(i).css("background-image","url(./assets/checkboxes-default.svg)")
                }
            }

            if(info.pickup === "YES"){
                $(".pei_pickup_yes").addClass('pei_pickup_selected');
                $(".pei_pickup_no").removeClass('pei_pickup_selected');
                $(".pei_pickup_radio").eq(0).css("background-image","url(./assets/icon-radio-check.svg)");
                $(".pei_pickup_radio").eq(1).css("background-image","url(./assets/icon-radio-default.svg)");

            }else{
                $(".pei_pickup_yes").removeClass('pei_pickup_selected');
                $(".pei_pickup_no").addClass('pei_pickup_selected');
                $(".pei_pickup_radio").eq(1).css("background-image","url(./assets/icon-radio-check.svg)");
                $(".pei_pickup_radio").eq(0).css("background-image","url(./assets/icon-radio-default.svg)");
            }
        })
    }

    this.delete = function(cid){
        $('.lightBox_shadow').addClass('hidden')
        $('.pi').addClass('hidden')
        keyArray.splice(keyArray.indexOf(cid), 1);
        firebase.database().ref("product/"+cid).remove();
        product.show();

    }

}
