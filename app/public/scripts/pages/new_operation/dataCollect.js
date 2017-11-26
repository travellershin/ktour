let guideViaName = {} //가이드 이름이 입력될 경우 key값으로 변환하기 위한 객체
let guideData = {} //가이드 키로부터 정보를 얻어오기 위한 객체
let formerDate = datestring.today() //기존 등록되어 있던 콜백을 삭제하기 위해 date String을 담고있는 문자열

let operation = {} //전체 operation data를 담고 있는 전역 객체

let lastRendering = {//무엇을 그리고 있었나
    product:"",
    bus:0, //어떤 bus를 보고 있었는지. 0일 경우 total
    order:[] //정렬 순서
}

let date = ""; //firebase database에 접근할 때 반드시 필요

let reservation = {} //product별 reservation


let r_obj = {} //reservation을 담을 객체
let r_totalArray = [] //해당일 전체 reservation Array

let filter = {
    agency:[],
    pickupPlace:[],
    nationality:[]
}
let filter_selected = {
    agency:[],
    pickupPlace:[],
    nationality:[]
}
let filter_adjusted = {
    agency:[],
    pickupPlace:[],
    nationality:[]
}

$(document).ready(function(){

    firebase.database().ref("guide").on("value",snap => {
        guideData = snap.val();

        for (let key in guideData) {
            guideViaName[guideData[key].name] = key
        }
    })

    init_datepicker();
    init_quickDate();
    getOperationData(datestring.today())
})

function getOperationData(inputDate){
    //기존 다른 날짜에 달려있던 콜백을 제거한다
    date = inputDate;
    firebase.database().ref("operation/"+formerDate).off("value")
    firebase.database().ref("memo/"+formerDate).off("value")
    console.log(formerDate + "에 달려있던 callback을 삭제합니다")
    lastRendering.product = ""
    firebase.database().ref("operation/"+inputDate).on("value",snap => {
        operation = snap.val();
        operation_generate(inputDate);
    });
    firebase.database().ref("memo/"+inputDate).on("value",snap => {
        memo = snap.val();
        inflateMemo(memo);
    })
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

    $('.rv_info_date--picker').daterangepicker({
        "autoApply": true,
        singleDatePicker: true,
        locale: { format: 'YYYY-MM-DD'},
        startDate:datestring.tomorrow(),
        endDate:datestring.tomorrow()
    })

    collect_pickupPlace();
    collect_agency()
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


function collect_pickupPlace(){
    firebase.database().ref("place").on("value",snap=>{
        let data = snap.val();
        let nationalityData = data.nationality
        cityData = data.city;
        let cityArray = []
        for (let city in cityData) {
            cityArray.push(city)
        }
        dynamicDrop($("#rev_areadrop"),cityArray);

        nationalityArray = ["PHILIPPINES","SINGAPORE","MALAYSIA","INDONESIA","HONG KONG","TAIWAN","UNITED STATES","VIET NAM"]

        for (let nat in nationalityData) {
            if(!nationalityArray.includes(nationalityData[nat].place)){
                nationalityArray.push(nationalityData[nat].place)
            }
        }

        let droptxt = ""

        for (let i = 0; i < nationalityArray.length; i++) {
            droptxt += '<p class="r_add_nitem">'+nationalityArray[i]+'</p>'
        }
        $(".r_add_natDrop").html(droptxt)
    });
    firebase.database().ref("product").on("value",snap=>{
        pdata = snap.val();
        let pOriginArray = []
        pNameArray = [];
        pShortArray = [];
        let firstArray = ["Seoul_Regular_남쁘","Seoul_Regular_남쁘아","Seoul_Regular_에버","Seoul_Regular_레남아","Seoul_Regular_레남쁘","Seoul_Regular_쁘남레아"]

        for (let key in pdata) {
            if(pdata[key].id.indexOf("_")>0){
                pOriginArray.push(pdata[key].id);

            }
        }

        for (let i = 0; i < firstArray.length; i++) {
            for (let j = 0; j < pOriginArray.length; j++) {
                if(pOriginArray[j] === firstArray[i]){
                    pNameArray.push(firstArray[i]);;
                    pOriginArray.splice(pOriginArray.indexOf(firstArray[i]),1);
                }
            }
        }
        for (let i = 0; i < pOriginArray.length; i++) {
            pNameArray.push(pOriginArray[i])
        }

        let droptxt = ""

        for (let i = 0; i < pNameArray.length; i++) {
            droptxt += '<p class="r_add_pitem">'+pNameArray[i]+'</p>'
        }
        $(".r_add_productDrop").html(droptxt)
        console.log("너냐")
    });
}

function collect_agency(){
    firebase.database().ref("agency").on("value",snap => {
        let data = snap.val();
        let agencyNameArray = []

        let droptxt = ""
        for (let key in data) {
            droptxt += '<p class="r_add_aitem">'+data[key].name+'</p>'
            agencyNameArray.push(data[key].name)
        }
        $(".r_add_agencyDrop").html(droptxt)
    })
}
