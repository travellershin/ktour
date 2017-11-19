
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

})


function getOperationData(date){
    //기존 다른 날짜에 달려있던 콜백을 제거한다
    firebase.database().ref("operation").off("value")
    firebase.database().ref("operation/"+date).on("value",snap => {
        operationData = snap.val();
        //o_r_filter_clear();
        generate_overview();
    });
}


function init_op_datepicker(){
    for (let i = 0; i < $('.o_header_quick>p').length; i++) {
        let index = $('.o_header_quick>p').eq(i).attr("id").split("_")[2]
        if(index === "0"){
            $('#drp_quick_'+index).html(datestring.today().split("-")[1]+"/"+datestring.today().split("-")[2])
        }else{
            $('#drp_quick_'+index).html(datestring.add(index*1).split("-")[2])
        }
    }
    $(".o_header_quick").removeClass("hidden")
    $(".o_header_change").removeClass("hidden")

    $('.o_header_date_txt').daterangepicker({
        "autoApply": true,
        singleDatePicker: true,
        locale: { format: 'YYYY-MM-DD'}
    },function(start,end,label){
        date = start.format('YYYY-MM-DD');
        getOperationData(start.format('YYYY-MM-DD'));

        $(".o_header_quick>p").removeClass("drp_quick--selected");
            for (var i = -1; i < 10; i++) {
                if(start.format('YYYY-MM-DD')===datestring.add(i)){
                    $('#drp_quick_'+i).addClass('drp_quick--selected')
                }
            }
    })
}
