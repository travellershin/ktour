let getdate = new GetDate();
let reservation = new Reservation();
let listDate = [];
//reservation 필터링 전의 전역변수!
var reservation_total = {};

firebase.database().ref("reservation").once("value", snap => {
    let data = snap.val();
    console.log(data)
})

$(document).ready(function(){
    getdate.init();
    //dateRangePicker를 등록한다.
})

$('#singleDateBox').click(function(){
    $('#singleDate').data('daterangepicker').show();
})
$('.r_set_quick_today').click(function(){
    //인자로 클릭된 녀석과 '오늘 날짜의 String'을 넘기면서 getdate.quick을 실행한다.
    getdate.quick($(this), datestring.today());
})

$('.r_set_quick_yesterday').click(function(){
    getdate.quick($(this), datestring.yesterday());
})

$('.r_set_quick_tomorrow').click(function(){
    getdate.quick($(this), datestring.tomorrow());
})

//개별 예약을 클릭했을 때
$('.rv_box').on("click", ".rv_content", function(){
    reservation.info($(this).attr('id'))
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

function GetDate(){

    //dateRangePicker를 등록한다.
    this.init = function(){

        listDate = [datestring.today()];

        $('.rv_box').html("")
        reservation_total = {};
        reservation.show(listDate, 0);
        $('.r_set_date_txt').html(datestring.today() + ' ~ ' + datestring.today());




    }

    this.quick = function(dom, date_txt){
        $('.r_set_quick>p').removeClass('r_set_quick--selected');
        dom.addClass('r_set_quick--selected');

        $('.r_set_date_txt').data('daterangepicker').setStartDate(date_txt);
        $('.r_set_date_txt').data('daterangepicker').setEndDate(date_txt);
        $('.r_set_date_txt').html(date_txt+" ~ "+date_txt)
        listDate = [date_txt];
        console.log(listDate);

        $('.rv_box').html("");
        reservation_total = {};
        reservation.show(listDate, 0);
    }
}


function Reservation(){

    //예약 내용을 표시한다

    this.show = function(listDate, no){


        firebase.database().ref("reservation/"+listDate[no]).on("value", snap => {
            let domTxt = ""

            let data = snap.val();

            for (var key in data) {
                reservation_total[key] = data[key]

                domTxt += '<div class="rv_content" id="'+key+'"><img class="rv_content_star" src="./assets/icon-star-off.svg"/><img class="rv_content_memo" src="./assets/icon-memo-on.svg"/><p class="rv_content_date">'
                domTxt += data[key].date + '</p><p class="rv_content_product">'
                domTxt += data[key].product + '</p><p class="rv_content_pickup">'
                domTxt += data[key].pickupPlace + '</p><p class="rv_content_people">'
                domTxt += data[key].people +'</p><p class="rv_content_option">'
                //옵션여부를 검사하는 곳
                domTxt += 'OPTION' +'</p><p class="rv_content_chinese">'
                //중국인가이드 요청여부를 검사하는 곳
                domTxt += 'X' + '</p><p class="rv_content_name" title="'
                domTxt += data[key].clientName + '">'
                domTxt += data[key].clientName + '</p><p class="rv_content_nationality">'
                domTxt += data[key].nationality + '</p><p class="rv_content_agency">'
                domTxt += data[key].agency + '</p></div>'

            }

            $('.rv_box').append(domTxt)

            if(no < listDate.length - 1){
                no++;
                this.show(listDate, no);
            }

        })
    }


    this.info = function(id){
        console.log(id)
        console.log(reservation_total)
        let data = reservation_total[id]
        console.log(data)


        for (var key in data) {
            $('.ric_co>.rv_info_'+key).html(data[key]);
            $('.rec_co .rv_info_'+key).val(data[key]);
        }
        if(data.agencyCode){$('.rv_info_agencyCode').html(data.agencyCode)}
        if(data.code){$('.rv_info_code').html(data.code)}
        if(data.agency){$('.rv_info_agency').html(data.agency)}

        if(data.adult === 0){
            firebase.database().ref("reservation/"+data.date+"/"+id+"/adult").set(data.people)
            $('.rv_info_people').html(data.people+" (adult "+data.people+" / child 0)")
        }else{
            $('.rv_info_people').html(data.people+" (adult "+data.adult+" / child "+data.kid+")")
        }

        //팝업창을 띄운다
        $('.popUp').removeClass('hidden');


        this.vertical();
    }

    this.vertical = function(){
        $('.ric_name').height($('.rv_info_clientName').height())
        $('.ric_product').height($('.rv_info_product').height())
        $('.ric_option').height($('.rv_info_option').height())
        $('.ric_pick').height($('.rv_info_pickupPlace').height())
        $('.rv_info_memo').width($('.ric').width())
    }

    this.save = function(){

    }


    this.editShow = function(){

    }
}
