$(document).on("click",".rv_content",function(){
    r_detail($(this).attr("id"));
})
$(".ri_header_close").click(function(){
    r_close();
})
$(".lightBox_shadow").click(function(){
    if($(".re").hasClass("hidden")){
        r_close();
    }
})
$(".ri").click(function(event){
    event.stopPropagation();
})

$(".ri_footer_gmail").click(function(){
    window.open("https://mail.google.com/mail/u/0/#inbox/"+$(this).attr("id").split("-")[0])
})

function r_detail(id){
    $(".ri_footer_cancel").removeClass("hidden")
    $(".ri_footer_edit").removeClass("hidden")
    $(".ri_footer_permanent").addClass("hidden")

    $(".re_footer_save").attr("id",id);
    $(".alert_footer_yes").attr("id",id);
    $("body").css("overflow","hidden");
    $(".ri_footer_gmail").attr("id",id);
    $(".lightBox_shadow").removeClass("hidden")

    let data = r_obj[id]
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

    let edittxt = ""

    if(data.option){
        let txt = ""
        for (let i = 0; i < data.option.length; i++) {
            txt+=data.option[i].option+" : "
            txt+=data.option[i].people +"<br>"

            edittxt+='<div class="rec_co_option_box"><input class="rec_co_option_name" value="'+data.option[i].option+'" readonly>'
            edittxt+='<input type="number" value='+data.option[i].people+' class="rec_co_option_people" placeholder="people"/></div>'
        }
        txt = txt.slice(0,-4);
        $(".rv_info_option").html(txt)
    }else{
        $(".rv_info_option").html("")
    }

    edittxt+='<div class="rec_co_option_box rec_co_option--add btn">+</div>'

    $(".rec_co_option").html(edittxt)


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

function r_close(){
    $('.popUp').addClass('hidden');
    $('.ri').removeClass('hidden');
    $('.re').addClass('hidden');
    $("body").css("overflow","auto");
}
