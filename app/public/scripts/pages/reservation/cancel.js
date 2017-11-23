let cancelled = []
let c_obj = {}

$(".ri_footer_cancel").click(function(){
    show_cancel_confirm();
})

$(".alert_footer_yes").click(function(){
    cancel_reservation($(this).attr("id"));
})

$(".alert_footer_no").click(function(){
    cancel_cancel();
})
$(".r_set_trash").click(function(){
    show_canceled();
})
$(".cancel_box").on("click",".c_content",function(){
    c_detail($(this).attr("id"))
})
$(".ri_footer_permanent").click(function(){
    $(".permanent_footer_yes").attr("id",$(this).attr("id"))
    $(".permanent_background").removeClass("hidden")
})
$(".permanent_footer_yes").click(function(){
    cancel_permanent($(this).attr("id"))
})

function show_cancel_confirm(){
    $(".alert_contents").html("<p>Are you sure you want to cancel this reservation?</p>")
    $(".alert_background").removeClass("hidden");
    $(".alert_why").val("")
}

function cancel_reservation(id){
    console.log(id)
    toast("예약을 취소합니다");
    $(".alert_background").addClass("hidden");
    $("body").css("overflow","auto")
    $(".popUp").addClass("hidden");
    $(".lightBox_shadow").addClass("hidden");
    r_obj[id].why = $(".alert_why").val()
    r_obj[id].canceledDate = datestring.today()
    firebase.database().ref("canceled/"+id).set(r_obj[id]);
    firebase.database().ref("operation/"+r_obj[id].date+"/"+r_obj[id].product+"/teams/"+r_obj[id].team+"/reservations/"+id).remove()
}

function cancel_cancel(){
    $(".alert_background").addClass("hidden");
}

function cancel_dataCollect(){
    firebase.database().ref("canceled").orderByChild("date").on("value",snap=>{
        cancelled = []
        snap.forEach(function(child){
            cancelled.push(child.val())
        })
        c_obj = snap.val()

        if(c_obj){
            $(".r_set_trash_no").html(cancelled.length)
        }else{
            $(".r_set_trash_no").html(0)
        }
        console.log(cancelled)
    })
}


function show_canceled(){
    $(".r_stat_total").addClass("hidden");
    $(".r_stat_pie").addClass("hidden");
    $(".r_stat_second").addClass("hidden");
    $(".r_htop").addClass("hidden");
    $(".rv_box").addClass("hidden");
    $(".r_set_trash").addClass("hidden");
    $(".r_set_chartToggle").html("예약현황 보기");
    $(".r_hbot").addClass("hidden");
    $(".r_set_date").addClass("hidden");
    $(".r_set_quick").addClass("hidden");
    $(".c_hbot").removeClass("hidden");
    $(".cancel_box").removeClass("hidden");
    inflate_canceled()

}

function close_canceled(){
    $(".r_stat_total").removeClass("hidden");
    $(".r_stat_pie").removeClass("hidden");
    $(".r_htop").removeClass("hidden");
    $(".rv_box").removeClass("hidden");
    $(".r_set_trash").removeClass("hidden");
    $(".r_set_chartToggle").html("표로 보기");
    $(".r_hbot").removeClass("hidden");
    $(".c_hbot").addClass("hidden");
    $(".cancel_box").addClass("hidden");
    $(".r_set_date").removeClass("hidden");
    $(".r_set_quick").removeClass("hidden");
}


function inflate_canceled(){
    $('.cancel_box').html("")
    let txt = ""
    r_chart = {
        product:{},
        pickupPlace:{},
        agency:{},
        nationality:{}
    };

    for (let i = 0; i < cancelled.length; i++) {

        txt += '<div class="c_content" id="'+cancelled[i].id+'">'

        txt+='<p class="c_canceledDate">'+cancelled[i].canceledDate+'</p>'

        if(cancelled[i].why){
            if(cancelled[i].why==="N/A"){cancelled[i].why=""}
        }else{
            cancelled[i].why=""
        }
        txt += '<p class="rv_content_memo cancel_memo" title="'+cancelled[i].why+'">'+cancelled[i].why+'</p><p class="rv_content_date">'
        txt += cancelled[i].date + '</p><p class="rv_content_product">'
        txt += cancelled[i].product.split("_")[2] + '</p><p class="rv_content_people">'

        let title = ""
        //옵션여부를 검사하는 곳
        if(cancelled[i].option){
            for (let j = 0; j < cancelled[i].option.length; j++) {
                title+=cancelled[i].option[j].option+" : "
                title+=cancelled[i].option[j].people +" / "
            }
            title = title.slice(0,-3);
        }

        txt += cancelled[i].people+' ('+cancelled[i].adult+'/'+cancelled[i].kid+')' +'</p><p class="rv_content_option" title="'+title+'">'

        if(cancelled[i].option){
            txt+='O'
        }else{
            txt+='X'
        }

        txt += '</p><p class="rv_content_name" title="'
        txt += cancelled[i].clientName + '">'
        txt += cancelled[i].clientName + '</p><p class="rv_content_nationality">'
        txt += cancelled[i].nationality + '</p><p class="rv_content_agency">'
        txt += cancelled[i].agency + '</p></div>'

    }
    $('.cancel_box').html(txt)
}

function c_detail(id){

    $(".ri_footer_cancel").addClass("hidden")
    $(".ri_footer_edit").addClass("hidden")
    $(".ri_footer_permanent").removeClass("hidden")


    $(".re_footer_save").attr("id",id);
    $(".alert_footer_yes").attr("id",id);
    $("body").css("overflow","hidden");
    $(".ri_footer_gmail").attr("id",id);
    $(".ri_footer_permanent").attr("id",id);
    $(".lightBox_shadow").removeClass("hidden")

    let data = c_obj[id]
    console.log(data)

    if(data.star){
        $(".ri_header_star").addClass("ri_header_star--on")
    }else{
        $(".ri_header_star").removeClass("ri_header_star--on")
    }

    let field = ["date","product","people","pickupPlace","area","clientName","nationality","agency","tel","email","messenger","agencyCode","pickupTime","memo"];

    for (let i = 0; i < field.length; i++) {
        if(!data[field[i]]||data[field[i]] == "N/A"){
            $('.rv_info_'+field[i]).html("-");
            $('.rv_info_'+field[i]).val("-");
        }else{
            $('.rv_info_'+field[i]).html(data[field[i]]);
            $('.rv_info_'+field[i]).val(data[field[i]]);
        }
    }

    if(data.option){
        let txt = ""
        let edittxt = ""
        for (let i = 0; i < data.option.length; i++) {
            txt+=data.option[i].option+" : "
            txt+=data.option[i].people +"<br>"

            edittxt+='<div class="rec_co_option_box"><input class="rec_co_option_name" value="'+data.option[i].option+'" readonly>'
            edittxt+='<input type="number" value='+data.option[i].people+' class="rec_co_option_people" placeholder="people"/></div>'
        }
        txt = txt.slice(0,-4);
        $(".rv_info_option").html(txt)
        $(".rec_co_option").html(edittxt)
    }else{
        $(".rv_info_option").html("")
        $(".rec_co_option").html("")
    }


    console.log(cityData)

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
        $('.rv_info_people').html(data.people+" (adult "+data.people+" / kid 0)")
    }else{
        $('.rv_info_people').html(data.people+" (adult "+data.adult+" / kid "+data.kid+")")
    }

    //팝업창을 띄우고 높이를 조정
    $('.popUp').removeClass('hidden');
    $('.ric_name').height($('.rv_info_clientName').height())
    $('.ric_product').height($('.rv_info_product').height())
    $('.ric_option').height($('.rv_info_option').height())
    $('.ric_pick').height($('.rv_info_pickupPlace').height())
    $('.rv_info_memo').width($('.ric').width())
}

function cancel_permanent(id){
    toast("예약이 제거되었습니다");
    $(".permanent_background").addClass("hidden")
    $(".popUp").addClass("hidden");
    $(".lightBox_shadow").addClass("hidden");
    $("body").css("overflow","auto");
    firebase.database().ref("canceled/"+id).remove()
    inflate_canceled()
}
