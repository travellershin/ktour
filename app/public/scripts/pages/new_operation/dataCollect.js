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

let filter = { //reservation들에 맞게 생성된 전체 필터
    agency:[],
    pickupPlace:[],
    nationality:[]
}
let filter_selected = { //사용자가 클릭해 선택한 필터
    agency:[],
    pickupPlace:[],
    nationality:[]
}
let filter_adjusted = { //실제 적용된 필터(사용자가 아무것도 선택하지 않은 경우 전체를 선택했다고 간주해야 하기 때문에 필요)
    agency:[],
    pickupPlace:[],
    nationality:[]
}

let guideCollected = false;
 //화면 inflate는 operation정보가 다 불러와지면 호출되는데, 그 전에 가이드 정보를 불러오는데 실패했을 경우
 //화면 inflate를 미루는 로직에 필요. 하지만 이런 일이 발생할 확률은 극히 적음.

$(document).ready(function(){

    firebase.database().ref("guide").on("value",snap => {
        guideData = snap.val(); //화면을 그릴 때 가이드 이름정보가 필요하므로 가이드 정보를 최우선적으로 불러온다
        guideCollected = true; //가이드 정보가 불러와졌을 경우에만 화면 inflate를 진행한다.

        for (let key in guideData) {
            guideViaName[guideData[key].name] = key;
            //사용자가 가이드 이름으로 저장하면 가이드 key값으로 바꾸어 DB에 저장해야 하기 때문에 이 정보가 필요.
        }
    })

    init_datepicker(); //datepicker를 초기화하고 collect_pickupPlace, collect_agency를 이어서 진행함
    init_quickDate(); //quickdate 날짜들을 어제 ~ 오늘+9일 범위로 설정
    //getOperationData(datestring.today()) //operation data를 DB에서 불러옴.
    getOperationData("2017-07-11") // TODO: 현재 임시로 예전 데이터를 가지고 노는중
})

function getOperationData(inputDate){
    date = inputDate;

    firebase.database().ref("operation/"+formerDate).off("value") //기존 다른 날짜에 달려있던 콜백을 제거
    firebase.database().ref("memo/"+formerDate).off("value") //기존 다른 날짜에 달려있던 콜백을 제거

    lastRendering.product = ""
    firebase.database().ref("operation/"+inputDate).on("value",snap => {
        operation = snap.val();
        readyForGO(inputDate) //OperationData를 불러오기 전에 Guide Data가 다 불러와졌는지 확인하는 로직. 확인되면 operation_generate를 진행.
    });
    firebase.database().ref("memo/"+inputDate).on("value",snap => {
        memo = snap.val();
        inflateMemo(memo); //메모를 불러와 표시
    })
}

function readyForGO(inputDate){
    if(guideCollected){
        operation_generate(inputDate);
    }else{
        setTimeout(function () {
            console.log("GuideData가 불러와지지 않아 Operation Generate를 잠시 미룹니다")
            readyForGO(inputDate);
        }, 300);
    }
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
    toast(datestring.add(no) + " 날짜의 Operation을 확인합니다")
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
        toast(start.format('YYYY-MM-DD') + " 날짜의 Operation을 확인합니다")
    })

    $('.rv_info_date--picker').daterangepicker({ //reservation edit시 나타나는 datepicker -> 초기 startdate,enddate지정 불필요
        "autoApply": true,
        singleDatePicker: true,
        locale: { format: 'YYYY-MM-DD'}
    })

    collect_pickupPlace();
    collect_agency()
}

function init_quickDate(){
    //오늘 날짜만 MM/DD 형식으로 표기하고 나머지 날짜는 DD 형식으로 표기.
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

        //자주 사용되는 국가는 pickupPlace dropdown 상단에 위치하도록 함.
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
        //지주 사용되는 상품이 dropdown 상단에 위치하도록 함
        let firstArray = ["Seoul_Regular_남쁘","Seoul_Regular_남쁘아","Seoul_Regular_에버","Seoul_Regular_레남아","Seoul_Regular_레남쁘","Seoul_Regular_쁘남레아"]

        for (let key in pdata) {
            if(pdata[key].id.indexOf("_")>0){
                pOriginArray.push(pdata[key].id);
            }
        }

        //최종적으로 표시되는 것은 pNameArray이다. 한 단계 꼬아서 처리하는 이유는, firstArray에 담긴 상품들이 Product에서 추후 제거될 수도 있기 때문.
        //우선 OriginArray에 모든 상품들을 담은 뒤, originArray에 있는 상품들 중  firstArray에 작성된 product들을 pNameArray에 최우선순위로 담고, 남은 상품들을 이어서 담는다.

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
