$(document).on("click", ".ri_footer_edit", function(){
    $('.ri').addClass('hidden');
    $('.re').removeClass('hidden');
})
$(document).on("click", ".re_header_close", function(){
    re_close();
})
$(document).on("click", ".re_footer_save", function(){
    r_save($(this).attr("id"));
})


function r_save(id){
    console.log("얌마")

    $('.re').addClass('hidden');
    $('.ri').removeClass('hidden');
    $("body").css("overflow","auto");
    $(".popUp").addClass("hidden")

    let iArray = ["date","product","area","pickupPlace","pickupTime","option","chinese","clientName","nationality","people","adult","kid","infant","tel","messenger","email","agencyCode","memo"]
    for (let i = 0; i < iArray.length; i++) {
        r_obj[id][iArray[i]] = $(".rec .rv_info_"+iArray[i]).val();
        if(typeof r_obj[id][iArray[i]] == "undefined"){
            r_obj[id][iArray[i]] = ""
        }
    }
    let numberArray = ["people","adult","infant","kid"];
    for (let i = 0; i < numberArray.length; i++) {
        r_obj[id][numberArray[i]] = r_obj[id][numberArray[i]]*1
    }
    firebase.database().ref("operation/"+r_obj[id].date+"/"+r_obj[id].product+"/teams/"+r_obj[id].team+"/reservations/"+id).set(r_obj[id])
    toast("저장되었습니다")
}

function re_close(){
    $('.popUp').addClass('hidden');
    $('.ri').removeClass('hidden');
    $('.re').addClass('hidden');
    $("body").css("overflow","auto");
}
