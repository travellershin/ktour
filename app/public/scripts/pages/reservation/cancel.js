$(".ri_footer_cancel").click(function(){
    show_cancel_confirm();
})

$(".alert_footer_yes").click(function(){
    cancel_reservation($(this).attr("id"));
})

$(".alert_footer_no").click(function(){
    cancel_cancel();
})

function show_cancel_confirm(){
    $(".alert_contents").html("<p>Are you sure you want to cancel this reservation?</p>")
    $(".alert_background").removeClass("hidden");
}

function cancel_reservation(id){
    console.log(id)
    toast("예약을 취소합니다");
    $(".alert_background").addClass("hidden");
    $("body").css("overflow","auto")
    $(".popUp").addClass("hidden");
    firebase.database().ref("canceled/"+id).set(r_obj[id]);
    firebase.database().ref("reservation/"+id).remove();
}

function cancel_cancel(){
    $(".alert_background").addClass("hidden");
}
