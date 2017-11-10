let r_chart = {
    product:{},
    pickupPlace:{},
    agency:{},
    nationality:{}
}

function inflate_reservation(){
    inflate_r = []
    $('.rv_box').html("")
    let txt = ""

    r_chart = {
        product:{},
        pickupPlace:{},
        agency:{},
        nationality:{}
    };

    for (let i = 0; i < rData.length; i++) {
        let draw = true

        for (let j = 0; j < fArray.length; j++) {
            if(!filter[fArray[j]].includes(rData[i][fArray[j]])){
                draw = false
            }
        }

        if(draw){


            for (let j = 0; j < fArray.length; j++) {
                if(r_chart[fArray[j]][rData[i][fArray[j]]]){
                    r_chart[fArray[j]][rData[i][fArray[j]]][0]++;
                    r_chart[fArray[j]][rData[i][fArray[j]]][1]+=rData[i].people
                }else{
                    r_chart[fArray[j]][rData[i][fArray[j]]] = [1,rData[i].people]
                }
            }


            txt += '<div class="rv_content" id="'+rData[i].id+'">'
            if(rData[i].star){
                txt+='<div class="rv_content_star rv_content_star--on"></div>'
            }else{
                txt+='<div class="rv_content_star"></div>'
            }
            if(rData[i].memo){
                if(rData[i].memo==="N/A"){rData[i].memo=""}
            }
            txt += '<p class="rv_content_memo" title="'+rData[i].memo+'">'+rData[i].memo+'</p><p class="rv_content_date">'
            txt += rData[i].date + '</p><p class="rv_content_product">'
            txt += rData[i].product.split("_")[2] + '</p><p class="rv_content_pickup">'
            txt += rData[i].pickupPlace + '</p><p class="rv_content_people">'
            txt += rData[i].people +'</p><p class="rv_content_option">'
            //옵션여부를 검사하는 곳
            txt += 'OPTION' +'</p><p class="rv_content_name" title="'
            txt += rData[i].clientName + '">'
            txt += rData[i].clientName + '</p><p class="rv_content_nationality">'
            txt += rData[i].nationality + '</p><p class="rv_content_agency">'
            txt += rData[i].agency + '</p></div>'
        }
    }
    $('.rv_box').html(txt)
    draw_chart();
}
