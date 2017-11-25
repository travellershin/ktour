
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
$(".rec_co_option").on("click",".rec_co_option--add",function(){
    r_add_option($(".re_footer_save").attr("id"))
})

function r_add_option(id){
    let edittxt = ""
    edittxt+='<div class="rec_co_option_box"><input class="rec_co_option_name" placeholder="Option Name">'
    edittxt+='<input type="number" value="0" class="rec_co_option_people"/></div>'
    $(".rec_co_option--add").before(edittxt)
}


function r_save(id){

    $('.re').addClass('hidden');
    $('.ri').removeClass('hidden');
    $("body").css("overflow","auto");
    $(".popUp").addClass("hidden")

    let iArray = ["date","product","area","pickupPlace","pickupTime","clientName","nationality","people","adult","kid","infant","tel","messenger","email","agencyCode","memo"]

    for (let i = 0; i < iArray.length; i++) {
        r_obj[id][iArray[i]] = $(".re .rv_info_"+iArray[i]).val();
        if(typeof r_obj[id][iArray[i]] == "undefined"){
            r_obj[id][iArray[i]] = ""
        }
    }
    console.log(r_obj[id].memo)
    let numberArray = ["people","adult","infant","kid"];
    for (let i = 0; i < numberArray.length; i++) {
        r_obj[id][numberArray[i]] = r_obj[id][numberArray[i]]*1
    }

    r_obj[id].option = []

    for (let i = 0; i < $(".rec_co_option_name").length; i++) {
        let optdata = {
            option:$(".rec_co_option_name").eq(i).val(),
            people:$(".rec_co_option_people").eq(i).val()*1
        }
        if(optdata.people>0){
            r_obj[id].option.push(optdata)
        }
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
