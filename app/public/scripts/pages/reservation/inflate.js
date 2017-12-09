let r_chart = {
    product:{},
    pickupPlace:{},
    agency:{},
    nationality:{}
}
let inflate_r = []

$(document).on("click", ".rv_content_star", function(event){
    let pid = r_obj[$(this).parent().attr("id")].product
    let tid = r_obj[$(this).parent().attr("id")].team
    let id = $(this).parent().attr("id")
    let date = r_obj[$(this).parent().attr("id")].date


    if($(this).hasClass("rv_content_star--on")){
        $(this).removeClass("rv_content_star--on")
        firebase.database().ref("operation/"+date+"/"+pid+"/teams/"+tid+"/reservations/"+id+"/star").set(false)
    }else{
        $(this).addClass("rv_content_star--on")
        firebase.database().ref("operation/"+date+"/"+pid+"/teams/"+tid+"/reservations/"+id+"/star").set(true)
    }

    event.stopPropagation();
})

function inflate_reservation(){
    inflate_r.length = 0
    $('.rv_box').html("")
    let txt = ""
    r_chart = {
        product:{},
        pickupPlace:{},
        agency:{},
        nationality:{}
    };

    let filterNumber = 0
    for (let fid in filterMap) {
        filterNumber += Array.from(filterMap[fid].keys()).length
    }
    $(".r_htop_filterRemove").html("모든 필터 해제("+filterNumber+")");
    console.log(rData)

    for (let i = 0; i < rvOrder.length; i++) {
        orderGuide[rvOrder[i]]()
    }

    for (let i = 0; i < rData.length; i++) {
        let draw = true

        for (let j = 0; j < fArray.length; j++) {
            if(filter[fArray[j]].indexOf(rData[i][fArray[j]])===-1){
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

            let title = ""
            //옵션여부를 검사하는 곳
            if(rData[i].option){
                for (let j = 0; j < rData[i].option.length; j++) {
                    title+=rData[i].option[j].option+" : "
                    title+=rData[i].option[j].people +" / "
                }
                title = title.slice(0,-3);
            }

            txt += rData[i].people+' ('+rData[i].adult+'/'+rData[i].kid+')' +'</p><p class="rv_content_option" title="'+title+'">'

            if(rData[i].option){
                txt+='O'
            }else{
                txt+='X'
            }

            txt += '</p><p class="rv_content_name" title="'
            txt += rData[i].clientName + '">'
            txt += rData[i].clientName + '</p><p class="rv_content_nationality">'
            txt += rData[i].nationality + '</p><p class="rv_content_agency">'
            txt += rData[i].agency + '</p></div>'
        }else{
            //console.log(rData[i])
        }
    }
    $('.rv_box').html(txt)
    draw_chart();
}

function inflate_totalPeople(){
    console.log(countPeople)
    let cityList = ["Seoul","Busan"];
    let firstSeoul = ["Myungdong",'Hongdae',"Dongdaemoon"];
    let firstBusan = ["Busan Station",'Seomyun',"Haeundae"];
    let inflateSeoul = [];
    let inflateBusan = [];

    for (let i = 0; i < firstSeoul.length; i++) {
        if(countPeople.Seoul){
            if(firstSeoul[i] in countPeople.Seoul){
                inflateSeoul.push(firstSeoul[i])
            }
        }
    }
    for (let i = 0; i < firstBusan.length; i++) {
        if(countPeople.Busan){
            if(firstBusan[i] in countPeople.Busan){
                inflateBusan.push(firstBusan[i])
            }
        }
    }
    if(countPeople.Seoul){
        for (let place in countPeople.Seoul) {
            if(!inflateSeoul.includes(place)){
                inflateSeoul.push(place)
            }
        }
    }
    if(countPeople.Busan){
        for (let place in countPeople.Busan) {
            if(!inflateBusan.includes(place)){
                inflateBusan.push(place)
            }
        }
    }

    let cityTxt = ''

    if(inflateSeoul.length>0){
        cityTxt+='<div class="r_stat_cityLine"><p class="r_stat_cityName">Seoul</p>'
        for (let i = 0; i < inflateSeoul.length; i++) {
            cityTxt+='<p class="r_stat_placeData">'+inflateSeoul[i]+" "+countPeople.Seoul[inflateSeoul[i]]
            if(i<inflateSeoul.length-1){
                cityTxt+=" / "
            }
        }
        cityTxt+='</div>'
    }
    if(inflateBusan.length>0){
        cityTxt+='<div class="r_stat_cityLine"><p class="r_stat_cityName">Busan</p>'
        for (let i = 0; i < inflateBusan.length; i++) {
            cityTxt+='<p class="r_stat_placeData">'+inflateBusan[i]+" "+countPeople.Busan[inflateBusan[i]]
            if(i<inflateBusan.length-1){
                cityTxt+=" / "
            }
        }
        cityTxt+='</div>'
    }

    for (let city in countPeople) {
        if(city !== "Seoul" && city !== "Busan"){
            cityTxt+='<div class="r_stat_cityLine"><p class="r_stat_cityName">'+city+'</p>'

            for (let place in countPeople[city]) {
                cityTxt+='<p class="r_stat_placeData">'+place+" "+countPeople[city][place] +" / "
            }
            cityTxt.slice(0,-3)
            cityTxt+='</div>'
        }
    }



    $(".r_stat_byCity").html(cityTxt)

}
