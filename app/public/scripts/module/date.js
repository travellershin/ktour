var dateArray = []

let drp_config = {
    "autoApply": true,
    locale: { format: 'YYYY-MM-DD'},
    //datestring class는 global.js에 명시되어 있음. 오늘 날짜를 문자열로 불러온다.
    startDate: datestring.today(),
    endDate: datestring.today()
}

function dw_drp(start,end,label){
    dateArray = [] //dateArray 초기화
    $('.drp_quick>p').removeClass('drp_quick--selected');
    $('.drp_txt').html(start.format('YYYY-MM-DD') + ' ~ ' + end.format('YYYY-MM-DD'));

    if(start.format('YYYY-MM-DD') === end.format('YYYY-MM-DD')){
        if(end.format('YYYY-MM-DD')===datestring.today()){
            $('.r_set_quick_today').addClass('r_set_quick--selected')
        };
        if(end.format('YYYY-MM-DD')===datestring.yesterday()){
            $('.r_set_quick_yesterday').addClass('r_set_quick--selected')
        }
        if(end.format('YYYY-MM-DD')===datestring.tomorrow()){
            $('.r_set_quick_tomorrow').addClass('r_set_quick--selected')
        }

        dateArray = [start.format('YYYY-MM-DD')] //dateArray에는 선택한 하루만이 들어간다
    }else{
        getDateRange(start.format('YYYY-MM-DD') , end.format('YYYY-MM-DD'), dateArray);
        //이 함수는 global.js에 명시되어 있음
    }
}

function singlePick(start){
    console.log(start.format('YYYY-MM-DD'))
}

$('.r_set_date_txt').daterangepicker(drp_config,
    function(start, end, label) {

        $('.r_set_quick>p').removeClass('r_set_quick--selected'); //어제/오늘/내일 퀵 선택을 일단 지운다
        $('.r_set_date_txt').html(start.format('YYYY-MM-DD') + ' ~ ' + end.format('YYYY-MM-DD')); //선택 날짜 범위를 표시한다

        //daterangepicker에서 선택한 날짜 범위가 하루 뿐이며, 오늘 / 어제 / 내일에 해당하는 경우 quickstart 박스를 채워준다
        if(start.format('YYYY-MM-DD') === end.format('YYYY-MM-DD')){
            if(end.format('YYYY-MM-DD')===datestring.today()){
                $('.r_set_quick_today').addClass('r_set_quick--selected')
            };
            if(end.format('YYYY-MM-DD')===datestring.yesterday()){
                $('.r_set_quick_yesterday').addClass('r_set_quick--selected')
            }
            if(end.format('YYYY-MM-DD')===datestring.tomorrow()){
                $('.r_set_quick_tomorrow').addClass('r_set_quick--selected')
            }

            dateArray = [start.format('YYYY-MM-DD')] //dateArray에는 선택한 하루만이 들어간다
        }else{
            getDateRange(start.format('YYYY-MM-DD') , end.format('YYYY-MM-DD'), dateArray);
            //이 함수는 global.js에 명시되어 있음
        }
        reservation.filter = {total:{},product:{},pickupPlace:{},place:{},nationality:{},agency:{}} //필터 내용 초기화
        reservation.watch(dateArray,0);
    }
);
