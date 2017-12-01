let rData = [];
let r_total = {}; //total:[6,12] - 예약 6개, 인원 12명 요런식. product : 남쁘아 : [6,12]
let fArray = ["product","pickupPlace","nationality","agency"];
let r_obj = {};
let cityData = {};
let pNameArray = [];
let nationalityArray = [];
let agencyNameArray = [];
let filter = {
    product:[],
    agency:[],
    pickupPlace:[],
    nationality:[]
}
let countPeople = {}

$(document).ready(function(){
    datepicker_init();
})

$(".r_htop_gmail").click(function(){
    export_reservation()
})

function export_reservation(){

    let startDate = dateArray[0]
    let endDate = dateArray[dateArray.length - 1]
    let durl = "https://intranet-64851.appspot.com/v1/excel/reservation?startAt="+startDate+"&endAt="+endDate

    console.log(durl)

    // Using YQL and JSONP
    $.ajax({
        url: durl,
        // Tell jQuery we're expecting JSONP
        dataType: "jsonp",
        // Work with the response
        success: function( response ) {
            console.log( response ); // server response
        },
        error: function(xhr) {
          console.log('실패 - ', xhr);
        }
    });

}


$(".r_set_quick>p").click(function(){
    r_quick($(this).attr("id"))
    $(".drp_quick>p").removeClass("drp_quick--selected");
    $(this).addClass("drp_quick--selected")
})

function datepicker_init(){
    $(".r_set_date_txt").html(datestring.today()+" ~ "+datestring.today());
    dateArray = [datestring.today()]; // ../../module/date.js에 명시

    collect_reservation();
    collect_pickupPlace();
    collect_agency();

    $('.rv_info_date--picker').daterangepicker({
        "autoApply": true,
        singleDatePicker: true,
        locale: { format: 'YYYY-MM-DD'},
        startDate:datestring.tomorrow(),
        endDate:datestring.tomorrow()
    })

    for (let i = 0; i < $('.drp_quick>p').length; i++) {

        let index = $('.drp_quick>p').eq(i).attr("id").split("_")[2]
        if(index.length === 1){
            $('.drp_quick>p').eq(i).html(datestring.add(index*1).split("-")[2])
        }else if(index === "today"){
            $('.drp_quick>p').eq(i).html(datestring.today().split("-")[1]+"/"+datestring.today().split("-")[2])
        }else if(index === "yesterday"){
            $('.drp_quick>p').eq(i).html(datestring.yesterday().split("-")[2])
        }else{
            $('.drp_quick>p').eq(i).html(datestring.tomorrow().split("-")[2])
        }
    }

    $(".r_set_date_txt").daterangepicker(drp_config,function(start,end,label){
        //기존에 달려있던 드롭다운들을 제거한다
        $(".dw_dropdown").removeClass("drop_appended");
        $(".dropbox").remove();

        dateArray.length = 0 //dateArray를 초기화한다

        $('.drp_quick>p').removeClass('drp_quick--selected');
        $('.drp_txt').html(start.format('YYYY-MM-DD') + ' ~ ' + end.format('YYYY-MM-DD'));


        if(start.format('YYYY-MM-DD') === end.format('YYYY-MM-DD')){
            if(end.format('YYYY-MM-DD')===datestring.yesterday()){
                $('.drp_quick_yesterday').addClass('drp_quick--selected')
            };
            if(end.format('YYYY-MM-DD')===datestring.today()){
                $('.drp_quick_today').addClass('drp_quick--selected')
            }
            if(end.format('YYYY-MM-DD')===datestring.tomorrow()){
                $('.drp_quick_tomorrow').addClass('drp_quick--selected')
            }
            if(end.format('YYYY-MM-DD')===datestring.add(2)){
                $('#drp_quick_2').addClass('drp_quick--selected')
            }
            if(end.format('YYYY-MM-DD')===datestring.add(3)){
                $('#drp_quick_3').addClass('drp_quick--selected')
            }
            if(end.format('YYYY-MM-DD')===datestring.add(4)){
                $('#drp_quick_4').addClass('drp_quick--selected')
            }
            if(end.format('YYYY-MM-DD')===datestring.add(5)){
                $('#drp_quick_5').addClass('drp_quick--selected')
            }
            if(end.format('YYYY-MM-DD')===datestring.add(6)){
                $('#drp_quick_6').addClass('drp_quick--selected')
            }
            if(end.format('YYYY-MM-DD')===datestring.add(7)){
                $('#drp_quick_7').addClass('drp_quick--selected')
            }
            if(end.format('YYYY-MM-DD')===datestring.add(8)){
                $('#drp_quick_8').addClass('drp_quick--selected')
            }
            if(end.format('YYYY-MM-DD')===datestring.add(9)){
                $('#drp_quick_9').addClass('drp_quick--selected')
            }

            dateArray = [start.format('YYYY-MM-DD')] //dateArray에는 선택한 하루만이 들어간다
        }else{
            getDateRange(start.format('YYYY-MM-DD') , end.format('YYYY-MM-DD'), dateArray); //이 함수는 global.js에 명시
        }

        collect_reservation();
    })

    $('.r_add_input_date').daterangepicker({
        "autoApply": true,
        singleDatePicker: true,
        locale: { format: 'YYYY-MM-DD'},
        startDate:datestring.tomorrow()
    })

}

let callback;
function collect_reservation(){
    filterMap = {
        product : new Map(),
        pickupPlace : new Map(),
        nationality : new Map(),
        agency : new Map()
    }

    filter = {
        agency:Array.from(filterMap.agency.keys()),
        product:Array.from(filterMap.product.keys()),
        pickupPlace:Array.from(filterMap.pickupPlace.keys()),
        nationality:Array.from(filterMap.nationality.keys())
    }

    firebase.database().ref("operation").off("value");
    firebase.database().ref("operation").orderByKey().startAt(dateArray[0]).endAt(dateArray[dateArray.length - 1]).on("value",snap=>{
        rData.length = 0;
        let oprev = snap.val();
        r_obj = {}

        countPeople = {}

        for (let date in oprev) {
            for (let pd in oprev[date]) {
                for (let team in oprev[date][pd].teams) {
                    for (let rev in oprev[date][pd].teams[team].reservations) {
                        let rddata = oprev[date][pd].teams[team].reservations[rev]

                        rddata.team = team;
                        rData.push(rddata);
                        r_obj[rev] = rddata;

                        if(countPeople[rddata.area]){
                            if(countPeople[rddata.area][rddata.pickupPlace]){
                                countPeople[rddata.area][rddata.pickupPlace] += rddata.people
                            }else{
                                countPeople[rddata.area][rddata.pickupPlace] = rddata.people
                            }
                        }else{
                            countPeople[rddata.area] = {};
                            countPeople[rddata.area][rddata.pickupPlace] = rddata.people
                        }
                    }
                }
            }
        }
        inflate_totalPeople();
        generate_filter();
        cancel_dataCollect();
    })
}

function generate_filter(){
    r_total = { //total은 필터링 전을 뜻함
        total:[0,0],
        product:{},
        agency:{},
        pickupPlace:{},
        nationality:{}
    };
    $(".r_drop").html("")

    filter = {
        agency:Array.from(filterMap.agency.keys()),
        product:Array.from(filterMap.product.keys()),
        pickupPlace:Array.from(filterMap.pickupPlace.keys()),
        nationality:Array.from(filterMap.nationality.keys())
    }

    for (let i = 0; i < rData.length; i++) {
        if(r_total.product[rData[i].product]){
            r_total.product[rData[i].product][0]++;
            r_total.product[rData[i].product][1]+=rData[i].people
            r_total.total[0]++
            r_total.total[1]+=rData[i].people
        }else{
            r_total.product[rData[i].product] = [1,rData[i].people]
            r_total.total[0]++
            r_total.total[1]+=rData[i].people
            if(filter.product.includes(rData[i].product)){
                $(".r_drop_product").append("<p class='rf_selected'>"+rData[i].product+"</p>")
            }else{
                $(".r_drop_product").append("<p>"+rData[i].product+"</p>")
            }

        }

        if(r_total.agency[rData[i].agency]){
            r_total.agency[rData[i].agency][0]++;
            r_total.agency[rData[i].agency][1]+=rData[i].people
        }else{
            r_total.agency[rData[i].agency] = [1,rData[i].people]
            if(filter.agency.includes(rData[i].agency)){
                $(".r_drop_agency").append("<p class='rf_selected'>"+rData[i].agency+"</p>")
            }else{
                $(".r_drop_agency").append("<p>"+rData[i].agency+"</p>")
            }
        }

        if(r_total.nationality[rData[i].nationality]){
            r_total.nationality[rData[i].nationality][0]++;
            r_total.nationality[rData[i].nationality][1]+=rData[i].people
        }else{
            r_total.nationality[rData[i].nationality] = [1,rData[i].people]

            if(filter.nationality.includes(rData[i].nationality)){
                $(".r_drop_nationality").append("<p class='rf_selected'>"+rData[i].nationality+"</p>")
            }else{
                $(".r_drop_nationality").append("<p>"+rData[i].nationality+"</p>")
            }
        }

        if(r_total.pickupPlace[rData[i].pickupPlace]){
            r_total.pickupPlace[rData[i].pickupPlace][0]++;
            r_total.pickupPlace[rData[i].pickupPlace][1]+=rData[i].people
        }else{
            r_total.pickupPlace[rData[i].pickupPlace] = [1,rData[i].people]

            if(filter.pickupPlace.includes(rData[i].pickupPlace)){
                $(".r_drop_pickupPlace").append("<p class='rf_selected'>"+rData[i].pickupPlace+"</p>")
            }else{
                $(".r_drop_pickupPlace").append("<p>"+rData[i].pickupPlace+"</p>")
            }
        }
    }

    for (let i = 0; i < fArray.length; i++) {
        if(filter[fArray[i]].length<1){
            filter[fArray[i]] = Object.keys(r_total[fArray[i]])
        }
    }
    inflate_reservation();
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
        console.log(pdata)
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
    });
}

function collect_agency(){
    firebase.database().ref("agency").on("value",snap => {
        let data = snap.val();
        agencyNameArray.length = 0

        let droptxt = ""
        for (let key in data) {
            droptxt += '<p class="r_add_aitem">'+data[key].name+'</p>'
            agencyNameArray.push(data[key].name)
        }
        $(".r_add_agencyDrop").html(droptxt)
    })
}

$(document).on("click",".drp_quick_yesterday",function(){
    $(".drp_quick>p").removeClass("drp_quick--selected");
    $(this).addClass("drp_quick--selected")
    $(".r_set_date_txt").html(datestring.yesterday()+" ~ "+datestring.yesterday())
    dateArray = [datestring.yesterday()];
    $(".r_set_date_txt").data('daterangepicker').setStartDate(datestring.yesterday());
    $(".r_set_date_txt").data('daterangepicker').setEndDate(datestring.yesterday());
    collect_reservation();
})
$(document).on("click",".drp_quick_today",function(){
    $(".drp_quick>p").removeClass("drp_quick--selected");
    $(this).addClass("drp_quick--selected")
    $(".r_set_date_txt").html(datestring.today()+" ~ "+datestring.today())
    dateArray = [datestring.today()];
    $(".r_set_date_txt").data('daterangepicker').setStartDate(datestring.today());
    $(".r_set_date_txt").data('daterangepicker').setEndDate(datestring.today());
    collect_reservation();
})
$(document).on("click",".drp_quick_tomorrow",function(){
    $(".drp_quick>p").removeClass("drp_quick--selected");
    $(this).addClass("drp_quick--selected")
    $(".r_set_date_txt").html(datestring.tomorrow()+" ~ "+datestring.tomorrow())
    dateArray = [datestring.tomorrow()];
    $(".r_set_date_txt").data('daterangepicker').setStartDate(datestring.tomorrow());
    $(".r_set_date_txt").data('daterangepicker').setEndDate(datestring.tomorrow());
    collect_reservation();
})


function r_quick(index){
    if(index.split("_")[2].length === 1){
        let no = index.split("_")[2]*1
        $(".r_set_date_txt").html(datestring.add(no)+" ~ "+datestring.add(no))
        dateArray = [datestring.add(no)];
        collect_reservation();
        $(".r_set_date_txt").data('daterangepicker').setStartDate(datestring.add(no));
        $(".r_set_date_txt").data('daterangepicker').setEndDate(datestring.add(no));
    }
}
