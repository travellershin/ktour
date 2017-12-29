let account = [];
let acc_obj = {};
let exportStart = "";
let exportEnd = "";

$(document).ready(function(){

    if(window.localStorage["ktlkey"]){
        let loginKey = window.localStorage["ktlkey"];
        let loginToken = window.localStorage["ktltoken"];
        firebase.database().ref("auth").once("value", snap => {
            adata = snap.val();
            if(adata[loginKey].token === loginToken && adata[loginKey].validdate === datestring.today() && adata[loginKey].grade>0){
                datepicker_init();
                console.log("login okay")
            }else{
                location.href = './index.html'
            }

        });
    }else{
        location.href = './index.html'
    }

})

$(".a_htop_gmail").click(function(){
    $(".export_background").removeClass("hidden");
    $("body").css("overflow","hidden");
    $(".export_drp").html(datestring.today()+" ~ "+datestring.today());
    $(".export_drp").data('daterangepicker').setStartDate(datestring.today());
    $(".export_drp").data('daterangepicker').setEndDate(datestring.today());
    exportStart = datestring.today();
    exportEnd = datestring.today();
})
$(".export_export").click(function(){
    export_account()
})
$(".export_cancel").click(function(){
    $(".export_background").addClass("hidden");
    $("body").css("overflow","auto");
})

function export_account(){
    let durl = "https://intranet-64851.appspot.com/v1/excel/account?startAt="+exportStart+"&endAt="+exportEnd
    location.href = durl;

    $(".export_background").addClass("hidden");
    $("body").css("overflow","auto");
}

function datepicker_init(){
    $(".a_set_date_txt").html(datestring.today()+" ~ "+datestring.today())
    dateArray = [datestring.today()];
    collect_data();

    $('.a_set_date_txt').daterangepicker(drp_config,function(start, end, label){
        //날짜가 선택되면 필터를 초기화하고 드롭다운들을 닫는다
        $(".dw_dropdown").removeClass("drop_appended");
        $(".dropbox").addClass("display_none");
        dw_drp(start,end,label);
        collect_data();
    });

    $('.export_drp').daterangepicker(drp_config,function(start, end, label){
        exportStart = start.toISOString().slice(0, 10);
        exportEnd = end.toISOString().slice(0, 10);
    });

    $(".a_edit_input_date").daterangepicker({
        "autoApply": true,
        singleDatePicker: true,
        locale: { format: 'YYYY-MM-DD'},
        startDate: $(datestring.today()),
        endDate: $(datestring.today())
    });
}

function collect_data(){
    firebase.database().ref("account").off("value")
    firebase.database().ref("account").orderByChild("date").startAt(dateArray[0]).endAt(dateArray[dateArray.length - 1]).on("value",snap=>{
        account.length = 0;
        snap.forEach(function(child){
            let temp = child.val();
            temp.id = child.key
            account.push(temp)
        })
        acc_obj = snap.val();
        if(!acc_obj){
            acc_obj = {}
        }
        filter_account();
    })
}

$(document).on("click",".drp_quick_yesterday",function(){
    $(".drp_quick>p").removeClass("drp_quick--selected");
    $(this).addClass("drp_quick--selected");
    $(".a_set_date_txt").html(datestring.yesterday()+" ~ "+datestring.yesterday());
    dateArray = [datestring.yesterday()];
    collect_data();
})
$(document).on("click",".drp_quick_today",function(){
    $(".drp_quick>p").removeClass("drp_quick--selected");
    $(this).addClass("drp_quick--selected");
    $(".a_set_date_txt").html(datestring.today()+" ~ "+datestring.today());
    dateArray = [datestring.today()];
    collect_data();
})
$(document).on("click",".drp_quick_tomorrow",function(){
    $(".drp_quick>p").removeClass("drp_quick--selected");
    $(this).addClass("drp_quick--selected");
    $(".a_set_date_txt").html(datestring.tomorrow()+" ~ "+datestring.tomorrow());
    dateArray = [datestring.tomorrow()];
    collect_data();
})
