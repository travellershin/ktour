function inflate_reservation(array){
    let rev = array // TODO: array를 일단 받아정렬 방법에 따라 정렬하기

    let domTxt = ""
    for (let i = 0; i < rev.length; i++) {
        domTxt += '<div class="rv_content" tid="'+rev[i].team+'" id="'+rev[i].id+'">'
        if(rev[i].oCheck){
            domTxt += '<div class="op_content_oCheck oCkeck--checked"></div>'
        }else{
            domTxt += '<div class="op_content_oCheck"></div>'
        }

        if(rev[i].gCheck){
            domTxt += '<div class="op_content_gCheck gCkeck--checked"></div>'
        }else{
            domTxt += '<div class="op_content_gCheck"></div>'
        }

        if(rev[i].star){
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
        domTxt += rev[i].agency + '</p></div>'

    }
    $('.rv_box').html(domTxt)

}
