$(".r_htop_newReservation").click(function(){
    r_new();
})

$(".r_add_input_product").keyup(function(){
    inputSearch($(".r_add_input_product").val())
})
$(".r_add_footer_cancel").click(function(){
    $(".r_add_wrapper").addClass("hidden")
    $("body").css("overflow","auto");
})
$(".r_add_input_product").click(function(event){
    event.stopPropagation();
    $(".r_add_productDrop").removeClass("hidden")
});
$(".r_add_input_pickupPlace").click(function(event){
    event.stopPropagation();
    $(".r_add_pickDrop").removeClass("hidden")
});
$("body").click(function(){
    $(".r_add_productDrop").addClass("hidden")
    $(".r_add_pickDrop").addClass("hidden")
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

function inputSearch(txt){
    searchArray = []
    if(txt === ""){
        searchArray = pNameArray
    }else{
        for (let i = 0; i < pNameArray.length; i++) {
            if(pNameArray[i].indexOf(txt)>-1){
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

function r_new(){
    $("body").css("overflow","hidden");
    $(".r_add_wrapper").removeClass("hidden")
    $(".r_add_input>input").val("")
    $(".r_add_input_date").val(datestring.tomorrow())
    $(".r_add_input_date").data('daterangepicker').setStartDate(datestring.tomorrow());
    $(".r_add_input_date").data('daterangepicker').setEndDate(datestring.tomorrow());
}

function r_new_save(){
    let required = ["date","product","people","pickupPlace"];
    let additional = ["clientName","nationality","agency","tel","email","messenger","option","agencyCode","memo"]
    let rdata = {}
    let durl = "https://intranet-64851.appspot.com/v1/reservation?"
    for (let i = 0; i < required.length; i++) {
        if($(".r_add_input_"+required[i]).val()===""){
            toast(required[i]+" 는 필수 정보입니다.")
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
    durl = durl.slice(0,-1);
    console.log(durl)

    // Using YQL and JSONP
    $.ajax({
        url: durl,
        // Tell jQuery we're expecting JSONP
        dataType: "jsonp",
        // Work with the response
        success: function( response ) {
            console.log( response ); // server response
        },
        error: function(xhr) {
          console.log('실패 - ', xhr);
        }
    });
    $("body").css("overflow","auto");
    $(".r_add_wrapper").addClass("hidden")
    toast("저장되었습니다")
}
