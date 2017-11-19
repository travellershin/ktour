let guideViaName = {} //가이드 이름이 입력될 경우 key값으로 변환하기 위한 객체
let guideData = {} //가이드 키로부터 정보를 얻어오기 위한 객체
let formerDate = datestring.today() //기존 등록되어 있던 콜백을 삭제하기 위해 date String을 담고있는 문자열

let operation = {} //전체 operation data를 담고 있는 전역 객체

let lastRendering = {//무엇을 그리고 있었나
    product:"어떤 product를 그리고 있었는지",
    bus:0, //어떤 bus를 보고 있었는지. 0일 경우 total
    inflateArray:["마지막에 보던 reservation의 순서 배열"],
    orderMethod:"마지막 정렬 방식"
}

let date = ""; //firebase database에 접근할 때 반드시 필요


let r_obj = {} //reservation을 담을 객체
let r_totalArray = [] //해당일 전체 reservation Array

$(document).ready(function(){

    firebase.database().ref("guide").on("value",snap => {
        guideData = snap.val();

        for (let key in guideData) {
            guideViaName[guideData[key].name] = key
        }

        init_datepicker();
        init_quickDate();
        getOperationData(datestring.today())

    })
})

function getOperationData(inputDate){
    //기존 다른 날짜에 달려있던 콜백을 제거한다
    date = inputDate;
    firebase.database().ref("operation/"+formerDate).off("value")
    console.log(formerDate + "에 달려있던 callback을 삭제합니다")
    firebase.database().ref("operation/"+inputDate).on("value",snap => {
        operation = snap.val();
        operation_generate(inputDate);
        //list_inflate();
    });
}

function getQuickDate(index,div){

    let no = index.split("_")[2]*1
    $(".o_header_quick>p").removeClass("drp_quick--selected");
    $(div).addClass("drp_quick--selected")
    $(".o_header_date_txt").val(datestring.add(no))
    $(".o_header_date_txt").data('daterangepicker').setStartDate(datestring.add(no));
    $(".o_header_date_txt").data('daterangepicker').setEndDate(datestring.add(no));
    getOperationData(datestring.add(no));
    formerDate = datestring.add(no);
}

function colorQuickDate(pickDate){
    $(".o_header_quick>p").removeClass("drp_quick--selected");

    for (var i = -1; i < 10; i++) {
        if(pickDate === datestring.add(i)){
            $('#drp_quick_'+i).addClass('drp_quick--selected')
        }
    }
}

function init_datepicker(){
    $('.o_header_date_txt').daterangepicker({
        "autoApply": true,
        singleDatePicker: true,
        locale: { format: 'YYYY-MM-DD'}
    },function(start,end,label){
        getOperationData(start.format('YYYY-MM-DD'));
        colorQuickDate(start.format('YYYY-MM-DD'))
        formerDate = start.format('YYYY-MM-DD');

    })
}

function init_quickDate(){
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
}
