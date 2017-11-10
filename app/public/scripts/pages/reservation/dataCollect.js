let rData = [];
let r_total = {}; //total:[6,12] - 예약 6개, 인원 12명 요런식. product : 남쁘아 : [6,12]
let fArray = ["product","pickupPlace","nationality","agency"]
$(document).ready(function(){
    datepicker_init();
})

function datepicker_init(){
    $(".r_set_date_txt").html(datestring.today()+" ~ "+datestring.today());
    dateArray = [datestring.today()]; // ../../module/date.js에 명시

    collect_reservation();

    $(".r_set_date_txt").daterangepicker(drp_config,function(start,end,label){
        //기존에 달려있던 드롭다운들을 제거한다
        $(".dw_dropdown").removeClass("drop_appended");
        $(".dropbox").remove();

        dateArray = [] //dateArray를 초기화한다

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

            dateArray = [start.format('YYYY-MM-DD')] //dateArray에는 선택한 하루만이 들어간다
        }else{
            getDateRange(start.format('YYYY-MM-DD') , end.format('YYYY-MM-DD'), dateArray); //이 함수는 global.js에 명시
        }

        filter = {}

        collect_reservation();
    })

    $('.r_add_input_date').daterangepicker({
        "autoApply": true,
        singleDatePicker: true,
        locale: { format: 'YYYY-MM-DD'},
        startDate:datestring.tomorrow()
    })
}


function collect_reservation(){
    firebase.database().ref("reservation").orderByChild("date").startAt(dateArray[0]).endAt(dateArray[dateArray.length - 1]).on("value",snap=>{
        rData = []
        snap.forEach(function(child){
            rData.push(child.val())
        })
        generate_filter();
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
            $(".r_drop_product").append("<p>"+rData[i].product+"</p>")
        }

        if(r_total.agency[rData[i].agency]){
            r_total.agency[rData[i].agency][0]++;
            r_total.agency[rData[i].agency][1]+=rData[i].people
        }else{
            r_total.agency[rData[i].agency] = [1,rData[i].people]
            $(".r_drop_agency").append("<p>"+rData[i].agency+"</p>")
        }

        if(r_total.nationality[rData[i].nationality]){
            r_total.nationality[rData[i].nationality][0]++;
            r_total.nationality[rData[i].nationality][1]+=rData[i].people
        }else{
            r_total.nationality[rData[i].nationality] = [1,rData[i].people]
            $(".r_drop_nationality").append("<p>"+rData[i].nationality+"</p>")
        }

        if(r_total.pickupPlace[rData[i].pickupPlace]){
            r_total.pickupPlace[rData[i].pickupPlace][0]++;
            r_total.pickupPlace[rData[i].pickupPlace][1]+=rData[i].people
        }else{
            r_total.pickupPlace[rData[i].pickupPlace] = [1,rData[i].people]
            $(".r_drop_pickupPlace").append("<p>"+rData[i].pickupPlace+"</p>")
        }
    }

    for (let i = 0; i < fArray.length; i++) {
        if(!filter[fArray[i]]){
            filter[fArray[i]] = Object.keys(r_total[fArray[i]])
        }
    }


    inflate_reservation();
}
