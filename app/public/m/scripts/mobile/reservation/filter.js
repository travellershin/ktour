$(".r_filter").click(function(){
    $(".r_filter_background").removeClass("hidden");
    $("body").css("overflow", "hidden")
})
$(".r_filter_close").click(function(){
    $(".r_filter_background").addClass("hidden");
    $("body").css("overflow", "auto")
})

let filterMap = {
    product : new Map(),
    pickupPlace : new Map(),
    nationality : new Map(),
    agency : new Map()
}
$(".r_hbot_hasdrop--pickdrop").click(function(event){
    evnet.stopImmediatePropagation()
    toggle_filterbox($(this).attr("fid"));
    return false
})
$(".r_hbot_hasdrop--pickupdrop").click(function(){
    toggle_filterbox($(this).attr("fid"));
    return false
})
$(".r_hbot_hasdrop--nationalitydrop").click(function(){
    toggle_filterbox($(this).attr("fid"));
    return false
})

$(".r_hbot_hasdrop").click(function(event){
    if(!$(this).hasClass("r_hbot_pickup")&&!$(this).hasClass("r_hbot_nationality")){
        toggle_filterbox($(this).attr("fid"));
        console.log("너냐")
        return false
    }
})
$(".r_htop_filterRemove").click(function(){
    filterMap = {
        product : new Map(),
        pickupPlace : new Map(),
        nationality : new Map(),
        agency : new Map()
    }
    for (let i = 0; i < fArray.length; i++) {
        filter[fArray[i]] = Object.keys(r_total[fArray[i]])
    }
    $(".rf_selected").removeClass("rf_selected")
    inflate_reservation();
    $(".r_htop_filterRemove").html("모든 필터 해제(0)")
})


$(".r_drop").on("click","p",function(){
    $(this).toggleClass("rf_selected")
    let fitem = $(this).html()
    let fid = $(this).parent().attr("fid")

    if(filterMap[fid].has(fitem)){
        filterMap[fid].delete(fitem)
    }else{
        filterMap[fid].set(fitem)
    }

    filter[fid] = Array.from(filterMap[fid].keys())
    if(filter[fid].length === 0){
        filter[fid] = Object.keys(r_total[fid])
    }
    console.log(filter)
    inflate_reservation()

    return false
})
