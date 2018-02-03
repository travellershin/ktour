function inflate_reservation(){

    let filterNumber = 0;
    for (let fid in filter_selected) {
        filterNumber+= filter_selected[fid].length
    }
    $(".ol_filterClear").html("모든 필터 해제("+filterNumber+")")

    let pid = lastRendering.product

    reservation[pid].sort(function(a,b){
        return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    })

    for (let i = 0; i < lastRendering.order.length; i++) {
        orderGuide[lastRendering.order[i]](pid)
    }
    let rev = reservation[pid]

    for (let fid in filter_selected) {
        if(filter_selected[fid].length === 0){
            filter_adjusted[fid] = filter[fid]
        }else{
            filter_adjusted[fid] = filter_selected[fid]
        }
    }

    let domTxt = ""
    for (let i = 0; i < rev.length; i++) {

        let draw = true;

        for (let fid in filter_adjusted) {
            if(!filter_adjusted[fid].includes(rev[i][fid])){
                draw = false;
            }
        }

        if(lastRendering.bus>0){
            if(rev[i].busNumber !== lastRendering.bus){
                draw = false;
            }
        }

        if(draw){
            domTxt += '<div class="rv_content" tid="'+rev[i].team+'" id="'+rev[i].id+'"><div class="op_content_topper">'

            if(rev[i].star === true){
                domTxt += '<div class="rv_content_star rv_content_star--on"></div>'
            }else{
                domTxt += '<div class="rv_content_star"></div>'
            }


            domTxt += '<p class="rv_content_name">('+rev[i].agency+')' + rev[i].clientName + '</p>'
            if(rev[i].memo){
                if(rev[i].memo==="N/A"){rev[i].memo=""}
            }

            if(rev[i].gCheck === true){
                domTxt += '<div class="op_content_gCheck gCkeck--checked"></div>'
            }else{
                domTxt += '<div class="op_content_gCheck"></div>'
            }

            if(rev[i].oCheck === true){
                domTxt += '<div class="op_content_oCheck oCkeck--checked"></div>'
            }else{
                domTxt += '<div class="op_content_oCheck"></div>'
            }
            domTxt += '<p class="rv_content_people">'+rev[i].people+' ('+rev[i].adult+'/'+rev[i].kid+')' +'</p></div>';

            domTxt += '<div class="op_content_lower"><p class="op_content_bus">BUS '+rev[i].busNumber+'</p>';
            domTxt += '<p class="rv_content_pickup">'+ rev[i].pickupPlace + '</p>'

            domTxt += '<p class="rv_content_nationality">' +rev[i].nationality + '</p></div>'
            domTxt += '<p class="op_content_memo">'+rev[i].memo+'</p><div class="oCheckZone"></div></div>'
        }
    }

    $('.rv_box').html(domTxt)

}
