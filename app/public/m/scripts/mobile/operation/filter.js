$(".r_hbot_hasdrop--pickdrop").click(function(event){
    toggle_filterbox("pickupPlace");
    return false
})
$(".r_hbot_hasdrop--natdrop").click(function(event){
    toggle_filterbox("nationality");
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
    for (let i = 0; i < fArray.length; i++) {
        filter[fArray[i]] = Object.keys(r_total[fArray[i]])
    }
    //inflate_reservation();
})

$(".ol_filterClear").click(function(){

    for (let fid in filter_selected) {
        filter_selected[fid].length = 0
    }
    $(".r_drop>p").removeClass("rf_selected")
    inflate_reservation();
})

function toggle_filterbox(name){
    console.log("?")
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

    if(filter_selected[fid].includes(fitem)){
        filter_selected[fid].splice(filter_selected[fid].indexOf(fitem),1)
    }else{
        filter_selected[fid].push(fitem)
    }

    inflate_reservation()

    return false
})
