$(document).bind('keydown', function(e) {
    if(e.ctrlKey && (e.which == 83)) {
        if(!$(".r_add_wrapper").hasClass("hidden")){
            e.preventDefault();
              r_new_save();
              return false;
        }
    }
});

$(".r_htop_newReservation").click(function(){
    r_new();
})

$(".r_add_footer_cancel").click(function(){
    $(".r_add_wrapper").addClass("hidden")
    $("body").css("overflow","auto");
})

$("body").click(function(){
    $(".r_add_drop").addClass("hidden")
})
$(".r_add_footer_save").click(function(){
    r_new_save();
})
$(document).on("click",".r_add_pitem",function(event){
    event.stopPropagation();
    $(".r_add_input_product").val($(this).html());
    let rcity = $(this).html().split("_")[0];
    console.log(rcity)

    let picktxt = ""

    let firstPlaceSeoul = ["Myungdong","Dongdaemoon","Hongdae"];
    let firstPlaceBusan = ["Busan Station","Seomyun","Haeundae"]

    if(rcity==="Seoul"){
        console.log("서울가자")
        for (let i = 0; i < firstPlaceSeoul.length; i++) {
            picktxt+='<p class="r_add_placeItem">'+firstPlaceSeoul[i]+'</p>'
        }
        for (let place in cityData[rcity]) {
            if(!firstPlaceSeoul.includes(place)){
                picktxt+='<p class="r_add_placeItem">'+place+'</p>'
            }
        };
    }else if(rcity==="Busan"){
        console.log("부산가자")
        for (let i = 0; i < firstPlaceBusan.length; i++) {
            picktxt+='<p class="r_add_placeItem">'+firstPlaceBusan[i]+'</p>'
        }
        for (let place in cityData[rcity]) {
            if(!firstPlaceBusan.includes(place)){
                picktxt+='<p class="r_add_placeItem">'+place+'</p>'
            }
        };
    }

    $(".r_add_pickDrop").html(picktxt)
})
$(document).on("click",".r_add_placeItem",function(event){
    event.stopPropagation();
    $(".r_add_input_pickupPlace").val($(this).html());
})
$(document).on("click",".r_add_nitem",function(event){
    event.stopPropagation();
    $(".r_add_input_nationality").val($(this).html());
})
$(document).on("click",".r_add_aitem",function(event){
    event.stopPropagation();
    $(".r_add_input_agency").val($(this).html());
})
$(".r_add_input_option_add").click(function(){
    r_add_addOption();
})

function r_add_addOption(){
    let edittxt = ""
    edittxt+='<div class="r_add_input_optionLine"><input class="r_add_input_option" placeholder="Option Name">'
    edittxt+='<input class="r_add_input_option_people" value="0"></div>'
    $(".r_add_input_option_add").before(edittxt)
}

function inputSearch(txt){
    productFocus = -1;
    let searchArray = [];
    if(txt === ""){
        searchArray = pNameArray
    }else{
        for (let i = 0; i < pNameArray.length; i++) {
            if(pNameArray[i].toLowerCase().indexOf(txt)>-1){
                searchArray.push(pNameArray[i])
            }
        }
    }
    let droptxt = ""

    for (let i = 0; i < searchArray.length; i++) {
        droptxt += '<p class="r_add_pitem">'+searchArray[i]+'</p>'
    }
    $(".r_add_productDrop").html(droptxt)
}

function natSearch(txt){
    let searchArray = [];
    if(txt === ""){
        searchArray = nationalityArray
    }else{
        for (let i = 0; i < nationalityArray.length; i++) {
            if(nationalityArray[i].toLowerCase().indexOf(txt)>-1){
                searchArray.push(nationalityArray[i])
            }
        }
    }
    let droptxt = ""

    for (let i = 0; i < searchArray.length; i++) {
        droptxt += '<p class="r_add_nitem">'+searchArray[i]+'</p>'
    }
    $(".r_add_natDrop").html(droptxt)
}

function agencySearch(txt){
    let searchArray = [];
    if(txt === ""){
        searchArray = agencyNameArray
    }else{
        for (let i = 0; i < agencyNameArray.length; i++) {
            if(agencyNameArray[i].toLowerCase().indexOf(txt)>-1){
                searchArray.push(agencyNameArray[i])
            }
        }
    }
    let droptxt = ""

    for (let i = 0; i < searchArray.length; i++) {
        droptxt += '<p class="r_add_aitem">'+searchArray[i]+'</p>'
    }
    $(".r_add_agencyDrop").html(droptxt)
}



function r_new(){
    $("body").css("overflow","hidden");
    $(".r_add_wrapper").removeClass("hidden")
    $(".r_add_input>input").val("")
    $(".r_add_input_adult").val("")
    $(".r_add_input_option").val("")
    $(".r_add_input_option_people").val("")
    $(".r_add_input_kid").val("")
    $(".r_add_input_memo").val("")
    $(".r_add_input_date").val(datestring.tomorrow())
    $(".r_add_input_date").data('daterangepicker').setStartDate(datestring.tomorrow());
    $(".r_add_input_date").data('daterangepicker').setEndDate(datestring.tomorrow());
}

function r_new_save(){
    let required = ["date","product","pickupPlace","adult"];
    let additional = ["clientName","nationality","agency","tel","email","messenger","agencyCode","kid"]
    let rdata = {}
    let durl = "https://intranet-64851.appspot.com/v1/reservation?"
    for (let i = 0; i < required.length; i++) {
        if($(".r_add_input_"+required[i]).val()===""){
            toast(required[i]+" 는 필수 정보입니다.")
            return false
        }else{
            rdata[required[i]] = $(".r_add_input_"+required[i]).val()
            durl+=required[i]+"="+$(".r_add_input_"+required[i]).val()+"&"
        }
    }
    for (let i = 0; i < additional.length; i++) {
        if($(".r_add_input_"+additional[i]).val() !== ""){
            rdata[additional[i]] = $(".r_add_input_"+additional[i]).val();
            durl+=additional[i]+"="+$(".r_add_input_"+additional[i]).val()+"&"
        }
    }
    let adult = $(".r_add_input_adult").val()*1;
    let kid = $(".r_add_input_kid").val()*1;
    let people = adult+kid

    durl+="people="+people+"&"

    for (let i = 0; i < $(".r_add_input_option").length; i++) {
        let o = $(".r_add_input_option").eq(i).val();
        let p = $(".r_add_input_option_people").eq(i).val()
        if(o.length>0&&p>0){
            durl+="o="+o+"&p="+p+"&";
        }
    }

    if($(".r_add_input_memo").val() !== ""){
        let memmo = $(".r_add_input_memo").val()
        memmo = memmo.replace(/(?:\r\n|\r|\n)/g, '<br>')
        durl += 'memo='+memmo+"&"
    }

    durl = durl.slice(0,-1);
    console.log(durl)
    toast("서버로 예약 정보를 전송합니다")

    // Using YQL and JSONP
    $.ajax({
        url: durl,
        // Tell jQuery we're expecting JSONP
        dataType: "jsonp",
        // Work with the response
        error: function(xhr, exception){
            if( xhr.status === 200|| xhr.status === 201|| xhr.status === 202){
                console.log("성공인듯")
                toast("예약이 정상적으로 잡혔습니다")
            }else{
                console.log('Error : ' + xhr.responseText)
                toast("문제가 발생했습니다")
            }
        }
    });
    $("body").css("overflow","auto");
    $(".r_add_wrapper").addClass("hidden")
}
