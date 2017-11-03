let reservation_NF = []; //not filtered reservation
let filter = {}
let rev_obj = {}
let adjusted = {
    product : [],
    pickupPlace : [],
    nationality : [],
    agency : []
}
let cityData = {}

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
})
$(document).on("click", ".ri_header_close", function(){
    $('.popUp').addClass('hidden');
    $('.ri').removeClass('hidden');
    $('.re').addClass('hidden');
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

    // TODO: save 기능
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

function collect_rev(){
    firebase.database().ref("reservation").orderByChild("date").startAt(dateArray[0]).endAt(dateArray[dateArray.length - 1]).on("value",snap=>{
        reservation_NF = []
        snap.forEach(function(child){
            reservation_NF.push(child.val())
        })
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
        domTxt += '<div class="rv_content" id="'+reservation[i].id+'"><img class="rv_content_star" src="./assets/icon-star-off.svg"/>'
        domTxt += '<p class="rv_content_memo">안녕하세욪ㅁ다ㅣㅓ메모입니다아아아</p><p class="rv_content_date">'
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

    $(".r_htop_numbList").html(filteredNo + " / " + totalNo + " Reservations")

    draw_chart(reservation)
    console.log(reservation)
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
    console.log(filteredRev)

    inflate_rev(filteredRev.total);
}

function rev_detail(id){
    let data = rev_obj[id]
    console.log(data)

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
        $('.rv_info_people').html(data.people+" (adult "+data.people+" / child 0)")
    }else{
        $('.rv_info_people').html(data.people+" (adult "+data.adult+" / child "+data.kid+")")
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
    })
}

function draw_chart(rv){
    console.log(rv)
    let cdata = {
        agency:{},
        product:{},
        nationality:{}
    }
    for (let keys in cdata) {
        for (let i = 0; i < rv.length; i++) {
            if(cdata[keys][rv[i][keys]]){
                cdata[keys][rv[i][keys]]+= rv[i].people
            }else{
                cdata[keys][rv[i][keys]] = rv[i].people
            }
        }
    }
    console.log(cdata)
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
    }

    for (let keys in cdata.agency) {
        chartist.agency.labels.push(keys);
        chartist.agency.series.push(cdata.agency[keys])
    }
    for (let keys in cdata.nationality) {
        chartist.nationality.labels.push(keys);
        chartist.nationality.series.push(cdata.nationality[keys])
    }
    for (let keys in cdata.product) {
        chartist.product.labels.push(keys.split("_")[2]);
        chartist.product.series.push(cdata.product[keys])
    }
    console.log(chartist.product)

    new Chartist.Pie('#chart_product', chartist.product);
    new Chartist.Pie('#chart_agency', chartist.agency);
    new Chartist.Pie('#chart_nationality', chartist.nationality);
}
