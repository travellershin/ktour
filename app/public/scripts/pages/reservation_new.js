let reservation_NF = []; //not filtered reservation
let filter = {}
let rev_obj = {}
let adjusted = {
    product : [],
    pickupPlace : [],
    nationality : [],
    agency : []
}
let cityData = {};
let reservation = {};

let pNameArray = [];
let searchArray = [];

$(document).ready(function(){
    datepicker_init();
    collect_pickupPlace();
})
$(document).on("click",".r_htop_filterRemove",function(){ //모든 필터 해제 클릭
    filter_init();
})
$(".r_hbot").on("click",".drop_item",function(){ //드롭다운 하위 선택지들 클릭
    filter_set($(this))
})
$(".re").on("click",".drop_item",function(){
    if($(this).attr("did","rev_areadrop")){
        let areaArray = []
        for (let area in cityData[$(this).html()]) {
            areaArray.push(area)
        }
        dynamicDrop($("#rev_placedrop"),areaArray)
    }
})
$(".r_add_input_product").click(function(event){
    event.stopPropagation();
    $(".r_add_productDrop").removeClass("hidden")
});
$(".r_add_input_pickupPlace").click(function(event){
    event.stopPropagation();
    $(".r_add_pickDrop").removeClass("hidden")
});
$("body").click(function(){
    $(".r_add_productDrop").addClass("hidden")
    $(".r_add_pickDrop").addClass("hidden")
})
$(".r_add_input_product").keyup(function(){
    inputSearch($(".r_add_input_product").val())
})
$(document).on("click",".drp_quick_yesterday",function(){
    $(".drp_quick>p").removeClass("drp_quick--selected");
    $(this).addClass("drp_quick--selected")
    $(".r_set_date_txt").html(datestring.yesterday()+" ~ "+datestring.yesterday())
    dateArray = [datestring.yesterday()];
    collect_rev();
})
$(document).on("click",".drp_quick_today",function(){
    $(".drp_quick>p").removeClass("drp_quick--selected");
    $(this).addClass("drp_quick--selected")
    $(".r_set_date_txt").html(datestring.today()+" ~ "+datestring.today())
    dateArray = [datestring.today()];
    collect_rev();
})
$(document).on("click",".drp_quick_tomorrow",function(){
    $(".drp_quick>p").removeClass("drp_quick--selected");
    $(this).addClass("drp_quick--selected")
    $(".r_set_date_txt").html(datestring.tomorrow()+" ~ "+datestring.tomorrow())
    dateArray = [datestring.tomorrow()];
    collect_rev();
})
$(document).on("click",".rv_content",function(){
    rev_detail($(this).attr("id"));
    $(".re_footer_save").attr("id",$(this).attr("id"))
})
$(document).on("click", ".ri_header_close", function(){
    $('.popUp').addClass('hidden');
    $('.ri').removeClass('hidden');
    $('.re').addClass('hidden');
})
$(".r_hbot").on("click",".drop_item",function(event){
    event.stopPropagation();
    let did = $(this).attr("did");
    if(!$("#"+did).hasClass("multiselect")){
        $("#drop_"+did).addClass("display_none");
        $("#"+did).val($(this).html());
        $("#"+did).attr("value",$(this).html());
    }
})
$(document).on("click", ".re_header_close", function(){
    //해야됨!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    $('.popUp').addClass('hidden');
    $('.ri').removeClass('hidden');
    $('.re').addClass('hidden');
})
$(document).on("click", ".ri_footer_edit", function(){
    $('.ri').addClass('hidden');
    $('.re').removeClass('hidden');

    // TODO: edit을 위한 세팅
})

$(document).on("click", ".re_footer_save", function(){
    $('.re').addClass('hidden');
    $('.ri').removeClass('hidden');

    re_save($(this).attr("id"));

    // TODO: save 기능
})
$(document).on("click", ".rv_content_star", function(event){
    if($(this).hasClass("rv_content_star--on")){
        $(this).removeClass("rv_content_star--on")
        firebase.database().ref("reservation/"+$(this).parent().attr("id")+"/star").set(false)
    }else{
        $(this).addClass("rv_content_star--on")
        firebase.database().ref("reservation/"+$(this).parent().attr("id")+"/star").set(true)
    }
    event.stopPropagation();

})
$(document).on("click",".r_add_pitem",function(event){
    event.stopPropagation();
    $(".r_add_input_product").val($(this).html());
    let city = $(this).html().split("_")[0];

    let picktxt = ""

    for (let place in cityData[city]) {
        picktxt+='<p class="r_add_placeItem">'+place+'</p>'
    };

    $(".r_add_pickDrop").html(picktxt)
})
$(document).on("click",".r_add_placeItem",function(event){
    event.stopPropagation();
    $(".r_add_input_pickupPlace").val($(this).html());
})

$(".r_set_chartToggle").click(function(){
    if($(".r_stat").hasClass("hidden")){
        $(".r_stat").removeClass("hidden");
        $(this).html("차트 닫기")
    }else{
        $(".r_stat").addClass("hidden");
        $(this).html("차트 열기")
    }
})
$(".r_htop_newReservation").click(function(){
    $(".r_add_wrapper").removeClass("hidden")
    $(".r_add_input>input").val("")
    $(".r_add_input_date").val(datestring.tomorrow())
    $(".r_add_input_date").data('daterangepicker').setStartDate(datestring.tomorrow());
    $(".r_add_input_date").data('daterangepicker').setEndDate(datestring.tomorrow());
})
$(".r_add_footer_cancel").click(function(){
    $(".r_add_wrapper").addClass("hidden")
})
$(".r_add_footer_save").click(function(){
    let rdata = {
        date:"",
        product:"",
        pickupPlace:"",
        people:0,
        name:"Unknown",
        nationality:"Unknown",
        agency:"Unknown",
        tel:"Unknown",
        email:"Unknown",
        messenger:"Unknown",
        option:"",
        chinese:"",
        agencyCode:"Unknown",
        memo:"",
    }
    if($(".r_add_input_product").val()===""||$(".r_add_input_pickupPlace").val()===""||$(".r_add_input_people").val()===""){
        toast("필수정보가 다 입력되지 않았습니다")
        return false
    }
    for (let key in rdata) {
        if($(".r_add_input_"+key).val()!==""){
            rdata[key] = $(".r_add_input_"+key).val()
        }
    }
    let key = firebase.database().ref().push().key
    rdata.reservedDate = datestring.today();
    rdata.reservedTime = "00:00"
    rdata.people = rdata.people*1
    rdata.area = rdata.product.split("_")[0];
    rdata.id = "NM_"+key
    if(rdata.memo===""){
        rdata.memo==="N/A"
    }
    console.log(rdata)

    firebase.database().ref("reservation/NM_"+key).set(rdata);

})
function myCallback(data){
    alert(data)
}


function collect_rev(){
    firebase.database().ref("reservation").orderByChild("date").startAt(dateArray[0]).endAt(dateArray[dateArray.length - 1]).on("value",snap=>{
        reservation_NF = []
        snap.forEach(function(child){
            reservation_NF.push(child.val())
        })
        reservation = snap.val()
        rev_obj = snap.val();
        filterOut_rev();
    })
}

function filterOut_rev(){

    let filter_product = new Set(); //필터 이름
    let filter_pickupPlace = new Set(); //필터 이름
    let filter_nationality = new Set(); //필터 이름
    let filter_agency = new Set(); //필터 이름

    for (let i = 0; i < reservation_NF.length; i++) {
        filter_product.add(reservation_NF[i].product)
        filter_pickupPlace.add(reservation_NF[i].pickupPlace)
        if(reservation_NF[i].nationality){
            filter_nationality.add(reservation_NF[i].nationality)
        }else{
            filter_nationality.add("Unknown")
        }
        filter_agency.add(reservation_NF[i].agency)
    }

    filter = {
        product : Array.from(filter_product),
        pickupPlace : Array.from(filter_pickupPlace),
        nationality : Array.from(filter_nationality) ,
        agency : Array.from(filter_agency)
    }
    dynamicDrop($("#r_filter_product"),filter.product);
    dynamicDrop($("#r_filter_pickupPlace"),filter.pickupPlace);
    dynamicDrop($("#r_filter_nationality"),filter.nationality);
    dynamicDrop($("#r_filter_agency"),filter.agency);

    inflate_rev(reservation_NF);
}

function inflate_rev(reservation){
    let domTxt = ""

    for (let i = 0; i < reservation.length; i++) {
        domTxt += '<div class="rv_content" id="'+reservation[i].id+'">'
        if(reservation[i].star){
            domTxt+='<div class="rv_content_star rv_content_star--on"></div>'
        }else{
            domTxt+='<div class="rv_content_star"></div>'
        }
        if(reservation[i].memo==="N/A"){reservation[i].memo="-"}
        domTxt += '<p class="rv_content_memo" title="'+reservation[i].memo+'">'+reservation[i].memo+'</p><p class="rv_content_date">'
        domTxt += reservation[i].date + '</p><p class="rv_content_product">'
        domTxt += reservation[i].product.split("_")[2] + '</p><p class="rv_content_pickup">'
        domTxt += reservation[i].pickupPlace + '</p><p class="rv_content_people">'
        domTxt += reservation[i].people +'</p><p class="rv_content_option">'
        //옵션여부를 검사하는 곳
        domTxt += 'OPTION' +'</p><p class="rv_content_name" title="'
        domTxt += reservation[i].clientName + '">'
        domTxt += reservation[i].clientName + '</p><p class="rv_content_nationality">'
        domTxt += reservation[i].nationality + '</p><p class="rv_content_agency">'
        domTxt += reservation[i].agency + '</p></div>'
    }

    $('.rv_box').html(domTxt)

    let totalNo = reservation_NF.length;
    let filteredNo = $(".rv_content").length;

    $(".r_htop_numbList").html("<p class='bold fl_left'>"+filteredNo + "</p><p class='fl_left'>&nbsp;/ " + totalNo + " Reservations</p>")

    draw_chart(reservation)
}

function filter_set(div){
    let filteredRev = {
        product : [],
        pickupPlace : [],
        nationality : [],
        agency : [],
        total : []
    }


    let kind = $(div).parent().attr("id").split("_")[3] //어떤 종류의 필터가 선택되었는가!
    $(div).toggleClass("drop_item--selected");
    if($(div).hasClass("drop_item--selected")){
        if(adjusted[kind].length === filter[kind].length){
            adjusted[kind] = [$(div).html()];
        }else{
            adjusted[kind].push($(div).html());
        }
    }else{
        adjusted[kind].splice(adjusted[kind].indexOf($(div).html()),1);
    }
    for (let filters in adjusted) {
        if(adjusted[filters].length === 0){
            adjusted[filters] = filter[filters];
        }
    }
    for (let filterName in adjusted) {
        for (let i = 0; i < reservation_NF.length; i++) {
            if(adjusted[filterName].indexOf(reservation_NF[i][filterName])>-1){
                filteredRev[filterName].push(reservation_NF[i])
            }
        }
    }

    for (let i = 0; i < filteredRev.product.length; i++) {
        if(filteredRev.pickupPlace.indexOf(filteredRev.product[i])>-1&&filteredRev.nationality.indexOf(filteredRev.product[i])>-1&&filteredRev.agency.indexOf(filteredRev.product[i])>-1){
            filteredRev.total.push(filteredRev.product[i])
        }
    }

    inflate_rev(filteredRev.total);
}

function rev_detail(id){
    let data = rev_obj[id]
    console.log(data)
    if(data.star){
        $(".ri_header_star").addClass("ri_header_star--on")
    }else{
        $(".ri_header_star").removeClass("ri_header_star--on")
    }

    for (var key in data) {
        if(data[key] == "N/A"){
            $('.rv_info_'+key).html("-");
            $('.rv_info_'+key).val("-");
        }else{
            $('.rv_info_'+key).html(data[key]);
            $('.rv_info_'+key).val(data[key]);
        }
    }

    if(cityData[$(".rv_info_area").val()]){
        let areaArray = []
        for (let area in cityData[$(".rv_info_area").val()]) {
            areaArray.push(area)
        }
        dynamicDrop($("#rev_placedrop"),areaArray)
    }
    if(data.agencyCode){$('.rv_info_agencyCode').html(data.agencyCode)}
    if(data.code){$('.rv_info_code').html(data.code)}
    if(data.agency){$('.rv_info_agency').html(data.agency)}

    if(data.adult === 0){ //db에 adult 항목이 비어있으면 people을 adult로 간주해 db에 넣음
        firebase.database().ref("reservation/"+data.date+"/"+id+"/adult").set(data.people)
        $('.rv_info_people').html(data.people+" (adult "+data.people+" / kid 0)")
    }else{
        $('.rv_info_people').html(data.people+" (adult "+data.adult+" / kid "+data.kid+")")
    }

    //팝업창을 띄우고 높이를 조정
    $('.popUp').removeClass('hidden');
    $('.ric_name').height($('.rv_info_clientName').height())
    $('.ric_product').height($('.rv_info_product').height())
    $('.ric_option').height($('.rv_info_option').height())
    $('.ric_pick').height($('.rv_info_pickupPlace').height())
    $('.rv_info_memo').width($('.ric').width())
}

function filter_init(){
    $(".drop_item").removeClass("drop_item--selected")
    $(".dropbox").addClass("display_none");
    inflate_rev(reservation_NF);
    adjusted = {
        product : [],
        pickupPlace : [],
        nationality : [],
        agency : []
    }
}

function datepicker_init(){
    $(".r_set_date_txt").html(datestring.today()+" ~ "+datestring.today())
    dateArray = [datestring.today()];
    collect_rev(0);

    $('.r_set_date_txt').daterangepicker(drp_config,function(start, end, label){
        //날짜가 선택되면 필터를 초기화하고 드롭다운들을 닫는다
        $(".dw_dropdown").removeClass("drop_appended");
        $(".dropbox").addClass("display_none");
        dw_drp(start,end,label);
        collect_rev(0);
    });

    $('.r_add_input_date').daterangepicker({
        "autoApply": true,
        singleDatePicker: true,
        locale: { format: 'YYYY-MM-DD'},
        startDate:datestring.tomorrow()
    })
}

$(document).on('focus','#singleDate', function(){
    let date = $(this).val()

    $(this).daterangepicker({
        "autoApply": true,
        singleDatePicker: true,
        locale: { format: 'YYYY-MM-DD'},
        startDate: date,
        endDate: date
    });
})

function collect_pickupPlace(){
    firebase.database().ref("place/city").on("value",snap=>{
        cityData = snap.val();
        let cityArray = []
        for (let city in cityData) {
            cityArray.push(city)
        }
        dynamicDrop($("#rev_areadrop"),cityArray)
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
    });
}

function draw_chart(rv){


    let cdata = {
        agency:{},
        product:{},
        nationality:{}
    }
    let sub = 0
    for (let keys in cdata) {
        for (let i = 0; i < rv.length; i++) {
            if(cdata[keys][rv[i][keys]]){
                cdata[keys][rv[i][keys]]+= rv[i].people*1
            }else{
                cdata[keys][rv[i][keys]] = rv[i].people*1
            }
            sub+=rv[i].people*1
        }
    }

    sub = sub/3

    let etc = {
        agency:0,
        product:0,
        nationality:0
    }
    for (let keys in cdata) {
        for (let yolo in cdata[keys]) {
            if(cdata[keys][yolo]/sub<0.05){
                etc[keys]+=cdata[keys][yolo];
                delete  cdata[keys][yolo]
            }
        }
    }

    let sort = {agency:[],product:[],nationality:[]};
    for (let keys in cdata) {
        for (let yolo in cdata[keys]) {
            sort[keys].push([yolo,cdata[keys][yolo]])
        }
        sort[keys].sort(function(a, b) {
            return b[1] - a[1];
        });
    }
    for (let key in etc) {
        if(etc[key]>0){
            sort[key].push(["etc",etc[key]])
        }
    }



    chartist = { //자료구조 명시를 위해 열어놓음
        agency:{
            labels:[],
            series:[]
        },
        product:{
            labels:[],
            series:[]
        },
        nationality:{
            labels:[],
            series:[]
        }
    };
    for (let i = 0; i < sort.agency.length; i++) {
        chartist.agency.labels.push(sort.agency[i][0]);
        chartist.agency.series.push(sort.agency[i][1])
    }
    for (let i = 0; i < sort.nationality.length; i++) {
        chartist.nationality.labels.push(sort.nationality[i][0]);
        chartist.nationality.series.push(sort.nationality[i][1])
    }
    for (let i = 0; i < sort.product.length; i++) {
        if(sort.product[i][0]==="etc"){
            chartist.product.labels.push("etc");
        }else{
            chartist.product.labels.push(sort.product[i][0].split("_")[2]);
        }

        chartist.product.series.push(sort.product[i][1])
    }

    new Chartist.Pie('#chart_product', chartist.product);
    new Chartist.Pie('#chart_agency', chartist.agency);
    new Chartist.Pie('#chart_nationality', chartist.nationality);
}

function re_save(id){
    let iArray = ["date","product","area","pickupPlace","pickupTime","option","chinese","clientName","nationality","people","adult","kid","infant","tel","messenger","email","agencyCode","memo"]
    for (let i = 0; i < iArray.length; i++) {
        reservation[id][iArray[i]] = $(".rec .rv_info_"+iArray[i]).val();
        if(typeof reservation[id][iArray[i]] == "undefined"){
            reservation[id][iArray[i]] = ""
        }
    }
    let numberArray = ["people","adult","infant","kid"];
    for (let i = 0; i < numberArray.length; i++) {
        reservation[id][numberArray[i]] = reservation[id][numberArray[i]]*1
    }
    firebase.database().ref("reservation/"+id).set(reservation[id])
    toast("저장되었습니다")
}

function inputSearch(txt){
    searchArray = []
    if(txt === ""){
        searchArray = pNameArray
    }else{
        for (let i = 0; i < pNameArray.length; i++) {
            if(pNameArray[i].indexOf(txt)>-1){
                searchArray.push(pNameArray[i])
            }
        }
    }
    let droptxt = ""

    for (let i = 0; i < searchArray.length; i++) {
        droptxt += '<p class="r_add_pitem">'+searchArray[i]+'</p>'
    }
    $(".r_add_productDrop").html(droptxt)

}
