
$(".ri_footer_edit").click(function(){
    $('.ri').addClass('hidden');
    $('.re').removeClass('hidden');
})
$(document).on("click", ".re_header_close", function(){
    re_close();
})
$(document).on("click", ".re_footer_save", function(){
    r_save($(this).attr("id"));
})
$(".ri_footer_cancel").click(function(){
    show_cancel_confirm();
})

$(".alert_footer_yes").click(function(){
    cancel_reservation($(this).attr("id"),"Canceled Reservation");
})

$(".alert_footer_no").click(function(){
    cancel_cancel();
})

function r_save(id){
    console.log(r_obj);
    console.log(id);

    $('.re').addClass('hidden');
    $('.ri').removeClass('hidden');
    $("body").css("overflow","auto");
    $(".popUp").addClass("hidden");
    $('.lightBox_shadow').addClass('hidden');


    let iArray = ["date","product","area","pickupPlace","pickupTime","chinese","clientName","nationality","people","adult","kid","infant","tel","messenger","email","agencyCode","memo"]
    for (let i = 0; i < iArray.length; i++) {
        r_obj[id][iArray[i]] = $(".re .rv_info_"+iArray[i]).val();
        if(typeof r_obj[id][iArray[i]] == "undefined"){
            r_obj[id][iArray[i]] = ""
        }
    }
    let numberArray = ["people","adult","infant","kid"];
    for (let i = 0; i < numberArray.length; i++) {
        r_obj[id][numberArray[i]] = r_obj[id][numberArray[i]]*1
    }
    console.log(r_obj[id].memo)

    r_obj[id].option = []

    for (let i = 0; i < $(".rec_co_option_name").length; i++) {
        let optdata = {
            option:$(".rec_co_option_name").eq(i).val(),
            people:$(".rec_co_option_people").eq(i).val()*1
        }
        r_obj[id].option.push(optdata)
        console.log(optdata)
    }


    toast("저장되었습니다")
    firebase.database().ref("operation/"+r_obj[id].date+"/"+r_obj[id].product+"/teams/"+r_obj[id].team+"/reservations/"+id).set(r_obj[id])

}

function re_close(){
    $('.popUp').addClass('hidden');
    $('.ri').removeClass('hidden');
    $('.re').addClass('hidden');
    $("body").css("overflow","auto");
}


function show_cancel_confirm(){
    $(".alert_contents").html("<p>Are you sure you want to cancel this reservation?</p>")
    $(".alert_background").removeClass("hidden");
    $(".alert_why").val("")
}

function cancel_reservation(sid,msg){
    toast("예약을 취소합니다");
    $(".alert_background").addClass("hidden");
    $("body").css("overflow","auto")
    $(".popUp").addClass("hidden");
    $(".lightBox_shadow").addClass("hidden");
    r_obj[sid].why = $(".alert_why").val()
    r_obj[sid].canceledDate = datestring.today()
    console.log(r_obj[sid])
    let data = {
        writer : r_obj[sid].agency,
        card: - r_obj[sid].sales,
        category:"reservation",
        currency:r_obj[sid].currency,
        date:r_obj[sid].date,
        id:sid,
        detail:msg + ". Reason : "+$(".alert_why").val()
    }
    firebase.database().ref("canceled/"+sid).set(r_obj[sid]);
    firebase.database().ref("operation/"+r_obj[sid].date+"/"+r_obj[sid].product+"/teams/"+r_obj[sid].team+"/reservations/"+sid).remove();


    firebase.database().ref("account/"+sid).set(data)
    console.log(data)
}

function cancel_cancel(){
    $(".alert_background").addClass("hidden");
}
