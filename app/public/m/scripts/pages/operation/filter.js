let filterMap = {
    product : new Map(),
    pickupPlace : new Map(),
    nationality : new Map(),
    agency : new Map()
}

$(".r_hbot_hasdrop").click(function(event){
    toggle_filterbox($(this).attr("fid"));
    return false
})
$("body").click(function(){
    $(".r_drop").addClass("hidden");
})
$(".r_htop_filterRemove").click(function(){
    for (let i = 0; i < fArray.length; i++) {
        filter[fArray[i]] = Object.keys(r_total[fArray[i]])
    }
    //inflate_reservation();
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
    console.log(filter)
    //inflate_reservation()

    return false
})
