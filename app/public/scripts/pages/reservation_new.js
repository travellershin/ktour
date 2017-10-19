let reservation = {};
let reserv_filtered = {};
let filter_rev = {}

$(document).ready(function(){
    datepicker_init();
})
$(document).on("click",".r_htop_filterRemove",function(){ //모든 필터 해제 클릭
    filter_init();
})
$(document).on("click",".drop_item",function(){ //드롭다운 하위 선택지들 클릭
    filter_set($(this))
})
$(document).on("click",".drp_quick_yesterday",function(){
    $(".drp_quick>p").removeClass("drp_quick--selected");
    $(this).addClass("drp_quick--selected")
    $(".r_set_date_txt").html(datestring.yesterday()+" ~ "+datestring.yesterday())
    dateArray = [datestring.yesterday()];
    collect_rev(0);
})
$(document).on("click",".drp_quick_today",function(){
    $(".drp_quick>p").removeClass("drp_quick--selected");
    $(this).addClass("drp_quick--selected")
    $(".r_set_date_txt").html(datestring.today()+" ~ "+datestring.today())
    dateArray = [datestring.today()];
    collect_rev(0);
})
$(document).on("click",".drp_quick_tomorrow",function(){
    $(".drp_quick>p").removeClass("drp_quick--selected");
    $(this).addClass("drp_quick--selected")
    $(".r_set_date_txt").html(datestring.tomorrow()+" ~ "+datestring.tomorrow())
    dateArray = [datestring.tomorrow()];
    collect_rev(0);
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

function collect_rev(i){
    firebase.database().ref("reservation").orderByChild("date").equalTo(dateArray[i]).on("value",snap=>{
        console.log("renewing data of " + dateArray[i]) // 데이터 최신화 작동 확인을 위해 console.log 남겨둠
        reservation[dateArray[i]] = {} //data 삭제 경우를 대비, 무조건 새로 mapping
        let data = snap.val();
        for (let revKey in data) {
            reservation[dateArray[i]][revKey] = data[revKey]
        };
        i++;
        if(i<dateArray.length){
            collect_rev(i)
        }
        filterOut_rev();
    })
}

function filterOut_rev(){
    reserv_filtered = {
        total:{},
        product:{},
        place:{},
        pickupPlace:{},
        nationality:{},
        agency:{}
    }

    filter_rev = {
        product:[],
        pickupPlace:[],
        nationality:[],
        agency:[]
    }

    for (let i = 0; i < dateArray.length; i++) {
        for (let keys in reservation[dateArray[i]]) {
            let rvdata = reservation[dateArray[i]][keys];
            reserv_filtered.total[keys] = rvdata;

            if(!reserv_filtered.place[rvdata.city]){reserv_filtered.place[rvdata.city] = {}}
            reserv_filtered.place[rvdata.city][keys] = rvdata;

            if(rvdata.nationality === "N/A"){
                if(!reserv_filtered.nationality.unknown){reserv_filtered.nationality.unknown = {}}
                reserv_filtered.nationality.unknown[keys] = rvdata;

            }else{
                if(!reserv_filtered.nationality[rvdata.nationality]){reserv_filtered.nationality[rvdata.nationality] = {}}
                reserv_filtered.nationality[rvdata.nationality][keys] = rvdata;
            }

            if(!reserv_filtered.product[rvdata.product]){reserv_filtered.product[rvdata.product] = {}}
            reserv_filtered.product[rvdata.product][keys] = rvdata;

            if(!reserv_filtered.agency[rvdata.agency]){reserv_filtered.agency[rvdata.agency] = {}}
            reserv_filtered.agency[rvdata.agency][keys] = rvdata;

            if(!reserv_filtered.pickupPlace[rvdata.pickupPlace]){reserv_filtered.pickupPlace[rvdata.pickupPlace] = {}}
            reserv_filtered.pickupPlace[rvdata.pickupPlace][keys] = rvdata;
        }
    }

    dynamicDrop($("#r_filter_product"),Object.keys(reserv_filtered.product));
    dynamicDrop($("#r_filter_pickupPlace"),Object.keys(reserv_filtered.pickupPlace));
    dynamicDrop($("#r_filter_nationality"),Object.keys(reserv_filtered.nationality));
    dynamicDrop($("#r_filter_agency"),Object.keys(reserv_filtered.agency));
    for (let filters in filter_rev) {
        if(filter_rev[filters].length === 0){
            filter_rev[filters] = Object.keys(reserv_filtered[filters]);
        }
    }

    inflate_rev();
}

function inflate_rev(){
    let domTxt = ""

    let data = {
        agency:{},
        nationality:{},
        pickupPlace:{},
        place:{},
        product:{}
    }

    let show = {}

    for (let filtername in filter_rev) {
        let filterArray = filter_rev[filtername];
        for (let i = 0; i < filter_rev[filtername].length; i++) {
            for (let key in reserv_filtered[filtername][filter_rev[filtername][i]]) {
                data[filtername][key] = reserv_filtered[filtername][filter_rev[filtername][i]][key]
            }
        }
    }

    for (let keys in data.product) {
        if(keys in data.pickupPlace && keys in data.nationality && keys in data.agency){
            show[keys] = data.product[keys]
        }
    }
    for (let key in show) {
        domTxt += '<div class="rv_content" id="'+key+'"><img class="rv_content_star" src="./assets/icon-star-off.svg"/><img class="rv_content_memo" src="./assets/icon-memo-on.svg"/><p class="rv_content_date">'
        domTxt += show[key].date + '</p><p class="rv_content_product">'
        domTxt += show[key].product.split("_")[2] + '</p><p class="rv_content_pickup">'
        domTxt += show[key].pickupPlace + '</p><p class="rv_content_people">'
        domTxt += show[key].people +'</p><p class="rv_content_option">'
        //옵션여부를 검사하는 곳
        domTxt += 'OPTION' +'</p><p class="rv_content_chinese">'
        //중국인가이드 요청여부를 검사하는 곳
        domTxt += 'X' + '</p><p class="rv_content_name" title="'
        domTxt += show[key].clientName + '">'
        domTxt += show[key].clientName + '</p><p class="rv_content_nationality">'
        domTxt += show[key].nationality + '</p><p class="rv_content_agency">'
        domTxt += show[key].agency + '</p></div>'
    };
    $('.rv_box').html(domTxt)

    let totalNo = Object.keys(reserv_filtered.total).length;
    let filteredNo = $(".rv_content").length;

    $(".r_htop_numbList").html(filteredNo + " / " + totalNo + " Reservations")
}

function filter_set(div){

    let kind = $(div).parent().attr("id").split("_")[3] //어떤 종류의 필터가 선택되었는가!
    $(div).toggleClass("drop_item--selected");
    if($(div).hasClass("drop_item--selected")){
        if(filter_rev[kind].length === Object.keys(reserv_filtered[kind]).length){
            filter_rev[kind] = [$(div).html()];
        }else{
            filter_rev[kind].push($(div).html());
        }

    }else{
        filter_rev[kind].splice(filter_rev[kind].indexOf($(div).html()),1);
    }
    for (let filters in filter_rev) {
        if(filter_rev[filters].length === 0){
            filter_rev[filters] = Object.keys(reserv_filtered[filters]);
        }
    }
    inflate_rev();
}

function rev_detail(id){
    let data = reserv_filtered.total[id]

    for (var key in data) {
        if(data[key] == "N/A"){
            $('.rv_info_'+key).html("-");
            $('.rv_info_'+key).val("-");
        }else{
            $('.rv_info_'+key).html(data[key]);
            $('.rv_info_'+key).val(data[key]);
        }
    }
    console.log($(".rv_info_memo").html())
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
    for (let filters in filter_rev) {
        filter_rev[filters] = Object.keys(reserv_filtered[filters]);
    }
    $(".drop_item").removeClass("drop_item--selected")
    $(".dropbox").addClass("display_none");
    inflate_rev();

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
