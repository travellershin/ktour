function inflate_reservation(){

    let filterNumber = 0;
    for (let fid in filter_selected) {
        filterNumber+= filter_selected[fid].length
    }
    $(".ol_filterClear").html("모든 필터 해제("+filterNumber+")")

    console.log(lastRendering)
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
            domTxt += '<div class="rv_content" tid="'+rev[i].team+'" id="'+rev[i].id+'">'
            if(rev[i].oCheck === true){
                domTxt += '<div class="op_content_oCheck oCkeck--checked"></div>'
            }else{
                domTxt += '<div class="op_content_oCheck"></div>'
            }

            if(rev[i].gCheck === true){
                domTxt += '<div class="op_content_gCheck gCkeck--checked"></div>'
            }else{
                domTxt += '<div class="op_content_gCheck"></div>'
            }

            if(rev[i].star === true){
                domTxt += '<div class="rv_content_star rv_content_star--on"></div>'
            }else{
                domTxt += '<div class="rv_content_star"></div>'
            }
            if(rev[i].memo){
                if(rev[i].memo==="N/A"){rev[i].memo=""}
            }
            domTxt += '<p class="op_content_bus">'+rev[i].busNumber+'</p><p class="rv_content_date">';
            domTxt += '<p class="op_content_memo">'+rev[i].memo+'</p><p class="rv_content_pickup">';
            domTxt += rev[i].pickupPlace + '</p><p class="rv_content_people">';

            let title = ""
            //옵션여부를 검사하는 곳
            if(rev[i].option){
                for (let j = 0; j < rev[i].option.length; j++) {
                    title+=rev[i].option[j].option+" : "
                    title+=rev[i].option[j].people +" / "
                }
                title = title.slice(0,-3);
            }

            domTxt += rev[i].people+' ('+rev[i].adult+'/'+rev[i].kid+')' +'</p><p class="rv_content_option" title="'+title+'">'

            if(rev[i].option){
                domTxt+='O'
            }else{
                domTxt+='X'
            }

            domTxt += '</p><p class="rv_content_name" title="'
            domTxt += rev[i].clientName + '">'

            domTxt += rev[i].clientName + '</p><p class="rv_content_nationality">'
            domTxt += rev[i].nationality + '</p><p class="rv_content_agency">'
            domTxt += rev[i].agency + '</p><div class="o_rv_guideCheckZone"></div><div class="o_rv_clickZone"></div></div>'
        }
    }

    $('.rv_box').html(domTxt)

}
