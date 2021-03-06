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
        return false
    }
})
$("body").click(function(){
    $(".r_drop").addClass("hidden");
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

function toggle_filterbox(name){
    if(!$(".r_drop_"+name).hasClass("hidden")){
        $(".r_drop").addClass("hidden");
    }else{
        $(".r_drop").addClass("hidden");
        $(".r_drop_"+name).removeClass("hidden")
    }
}

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
    inflate_reservation()

    return false
})
