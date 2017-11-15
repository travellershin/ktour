

$(document).on("click", ".pc", function(){ //개별 프로덕트 클릭 -> Edit창 열기
    show_detail($(this).attr('id'));
})
$(document).keyup(function(){
    if(event.key === "Escape"){
        close_detail();
    }
})
$(".pe_header_close").click(function(){ //Edit창 닫기
    close_detail();
})
$(".pe_nav").children().click(function(){ //Edit창 탭 이동
    open_product($(this).html().toLowerCase());
})
$(".pe_div_area").on("click",".drop_item",function(){ //area를 새로 선택했다면 그에 맞는 pickup dropdown을 선택해야 한다.
    setPickDrop($(this).html());
})
$(".pei_pickupLocationZone").on("click",".drop_item",function(){ //pickup Location 선택했다면 그 내용이 map에 업데이트된다.
    choosePickDrop($(this));
})
$(".pei_location_add").click(function(){
    addPickDrop();
})
$(document).on("click",".p_ml_remove",function(){
    removePickDrop($(this));
})
$(document).on("click",".pep_p_tab_box",function(){
    movePricesetTab($(this))
})
$(document).on("click",".pep_p_tab_remove",function(){
    // TODO: delete priceSet
})
$(".p_set_add").click(function(){
    addNewProduct();
})
$('.pei_language').click(function(){
    if($(this).children(".pei_language_cb").hasClass('cb_checked')){
        $(this).children(".pei_language_cb").removeClass('cb_checked')
    }else{
        $(this).children(".pei_language_cb").addClass('cb_checked')
    }
})

$('.pei_available').click(function(){
    if($(this).hasClass('pei_available_selected')){
        $(this).removeClass('pei_available_selected')
        $(".pei_available_cb").eq($(".pei_available").index(this)).removeClass('cb_checked')
    }else{
        $(this).addClass('pei_available_selected')
        $(".pei_available_cb").eq($(".pei_available").index(this)).addClass('cb_checked')
    }
})
$(document).on("click",".pep_p_ag_add",function(){
    makePriceGroup($(this).attr("pid"))
})
$(document).on("click",".pep_p_ag_box_close",function(){
    deletePriceGroup($(this))
})
$(document).on('focus',".pep_p_gen_reservation", function(){ //reservation date 설정 input을 클릭하면 그 때 동적으로 datepicker 달기
    let dateArray = $(this).val().split("-");
    let start = dateArray[0]+"-"+dateArray[1]+"-"+dateArray[2].trim();
    let end = dateArray[3].trim()+"-"+dateArray[4]+"-"+dateArray[5];

    $(this).daterangepicker({
        "autoApply": true,
        locale: { format: 'YYYY-MM-DD'},
        startDate: start,
        endDate: end
    });
})

$(document).on('focus',".pep_p_gen_tour", function(){
    let dateArray = $(this).val().split("-");
    let start = dateArray[0]+"-"+dateArray[1]+"-"+dateArray[2].trim();
    let end = dateArray[3].trim()+"-"+dateArray[4]+"-"+dateArray[5];
    $(this).daterangepicker({
        "autoApply": true,
        locale: { format: 'YYYY-MM-DD'},
        startDate: start,
        endDate: end
    });
})

$(document).on("click",".pep_p_ag_set",function(){
    setAgencyPrice($(this))
})
$(document).on("click",".APC_agency",function(){
    agencySelect($(this))
})
$(document).on("click",".APC_group",function(){
    agencyMove($(this))
})
$(".pe_APC_header_close").click(function(){
    APCClose();
})
$(".pe_APC_footer_save").click(function(){
    setAPC();
})
$(document).on("click",".pep_p_op_add",function(){
    addOption()
})
$(document).on("click",".pep_p_op_close",function(){
    $(this).parent().remove();
})
$(document).on("click",".pep_p_as_add",function(){
    addAsset();
})
$(document).on("click",".pep_p_as_remove",function(){
    $(this).parent().remove();
})
$(document).on("click",".pep_p_bus_add",function(){
    addBus();
})
$(document).on("click",".pep_p_bus_price_add",function(){
    let index = $(".pep_p_bus_price_add").index(this);
    addBusCell(index);
})
$(document).on("click",".pep_p_bus_remove",function(){
    $(this).parent().remove();
})
$(document).on("click",".pep_p_tab_add",function(){
    addPriceTab();
})
$(document).on("click",".pep_p_tab_remove",function(){
    removePriceTab($(this));
})
$(document).on("click",".pei_forall",function(){
    $(this).toggleClass("cb_checked")
})
$(document).on("click",".pep_p_as_pre_cb",function(){
    $(this).toggleClass("cb_checked")
})

let apg = {
    unassigned:[],
    refused:[],
    screening:[],
    unassigned_yet:[],
    group:[]
}

$(".pe_tab_agency").on("click",".dw_radio",function(){
    originGroup = $(this).parent().attr("rstat").toLowerCase();
    changedGroup =  $(this).html().toLowerCase();

})

function addNewProduct(){
    let key = firebase.database().ref().push().key
    $(".pe").attr("pid",key)
    product[key] = {};
    let data = product[key];
    data.price = {default:{
        byAgencies:[{
            adultAge_max:0,
            adultAge_min:0,
            adult_gross:10000,
            adult_net:10000,
            agency:[],
            currency:"KRW",
            infantAge_max:0,
            infantAge_min:0,
            infant_gross:10000,
            infant_net:10000,
            kidAge_max:0,
            kidAge_min:0,
            kid_gross:10000,
            kid_net:10000,
        }],
        description:"description field",
        forAll:false,
        reservationDate_from:datestring.today(),
        reservationDate_to:datestring.today(),
        tourDate_from:datestring.today(),
        tourDate_to:datestring.today(),
        title:"Default"
    }};
    data.cost = {
        bus:[{max:0,min:0,name:"BUS NAME",size:[{cost:10000,max:0,min:0}]}],
        item:[]
    };
    data.id = "Seoul_Regular_NEWPRODUCT";
    data.info = {
        area:"Seoul",
        available:[false,false,false,false,false,false,false,false],
        cancellation:"-",
        category:"Regular",
        deadline:24,
        description:"-",
        exclude:"-",
        id:"Seoul_Regular_NEWPRODUCT",
        include:"_",
        itinerary:"-",
        language:[true,false,false,false,false,false,false,false,false,false,false,false],
        name:"NEW PRODUCT",
        others:"-",
        period:"-",
        pickup:[""],
        status:"ON"
    };
    data.option = [],
    data.possibles = ["Not written Yet"]
    data.agency = {}

    for (let i = 0; i < agencyArray.length; i++) {
        data.agency[agencyArray[i]]  = "Unassigned"
    }

    show_detail(key)
}

function show_detail(pid){
    let data = product[pid]
    console.log(data)
    $(".pe").attr("pid",pid);
    if(data.id){
        $(".pe_header_title").html(data.id.split("_")[2]);
    }else{
        $(".pe_header_title").html("제품명을 입력해주세요")
    }

    let info = ["name","area","category","status","description","deadline","itinerary",
                "cancellation","include","exclude","others"] //db에서 input text 형태로 입력된 data들을 정의

    for (let i = 0; i < info.length; i++) { //input text 형태의 data들을 집어넣음
        $(".input_info_"+info[i]).val(data.info[info[i]]);
    }

    let periodArray = []

    for (let i = 0; i < data.info.period.length; i++) {
        periodArray.push(data.info.period[i].from + " ~ " + data.info.period[i].to)
    }

    $(".input_info_period").val(periodArray.join(";"))

    if(data.info.memo){ //메모 내용은 없을수도 있어서...?
        $(".pe_memo_txt").val(data.info.memo)
    }else{
        $(".pe_memo_txt").val("")
    }

    if(data.possibles){
        $(".arraydata_possibles").val(data.possibles.join(";\n")); //possibles는 ;으로 분리해 보여줌
    }else{
        $(".arraydata_possibles").val("")
    }


    for (var i = 0; i < data.info.language.length; i++) {
        if(data.info.language[i]){
            $(".pei_language_cb").eq(i).addClass('cb_checked')
        }else{
            $(".pei_language_cb").eq(i).removeClass('cb_checked')
        }
    }
    for (var i = 0; i < data.info.available.length; i++) {
        if(data.info.available[i]){
            $(".pei_available_cb").eq(i).addClass('cb_checked')
        }else{
            $(".pei_available_cb").eq(i).removeClass('cb_checked')
        }
    }
    let pickArray = pickupObj[data.info.area]

    let picktxt = "" //Meeting Location을 그려준다.
    if(data.info.pickup){
        for (var i = 0; i < data.info.pickup.length; i++) {
            picktxt+='<div class="ov_hidden mt_20"><p class="pei_meeting_no">'+(i+1)+'.</p><input readonly spellcheck="false" class="dw_dropdown fl_left pe_mid pei_meeting pei_meeting_'+(i+1)+'" id="pei_meeting_'+(i+1)+'" dropitem="'+pickArray+'" value="'+data.info.pickup[i]+'"><img class="p_ml_remove" src="./assets/icon-close-small.svg"/></div>'
        }
    }
    $(".pei_pickupLocationZone").html(picktxt)
    //info 탭 내용 draw가 끝났다

    let agencyTxt = ""
    for (let i = 0; i < agencyArray.length; i++) {
        agencyTxt+='<p class="pea_title">'+agencyArray[i]+'</p><div class="pea_agency pea_'+agencyArray[i]+'" rstat="';
        if(data.agency){
            agencyTxt+=data.agency[agencyArray[i]]+'"><div class="dw_radio">Ongoing</div><div class="dw_radio">Screening</div><div class="dw_radio">Refused</div><div class="dw_radio">Unassigned</div></div>'
        }else{
            agencyTxt+='Unassigned"><div class="dw_radio">Ongoing</div><div class="dw_radio">Screening</div><div class="dw_radio">Refused</div><div class="dw_radio">Unassigned</div></div>'
        }
    }
    $(".pe_tab_agency").html(agencyTxt);

    for (let i = 0; i < $(".pea_agency").length; i++) {
        if($(".pea_agency").eq(i).attr("rstat") === "Ongoing"){
            $(".pea_agency").eq(i).children(".dw_radio").eq(0).addClass("dw_radio_selected");
        }else if($(".pea_agency").eq(i).attr("rstat") === "Screening"){
            $(".pea_agency").eq(i).children(".dw_radio").eq(1).addClass("dw_radio_selected");
        }else if($(".pea_agency").eq(i).attr("rstat") === "Refused"){
            $(".pea_agency").eq(i).children(".dw_radio").eq(2).addClass("dw_radio_selected");
        }else{
            $(".pea_agency").eq(i).children(".dw_radio").eq(3).addClass("dw_radio_selected");
        }
    }

    //agency 탭 내용 draw가 끝났다

    let price = data.price

    let tabTxt = ""
    for (let priceCode in price) {
        let pdata = price[priceCode]

        tabTxt+='<div class="pep_p_tab_box"><input class="pep_p_tab pep_title_'+priceCode+'" tid="'+priceCode+'" spellcheck="false" value="'+pdata.title.toUpperCase()+'"/><img class="pep_p_tab_remove" src="./assets/icon-close-small.svg" /></div>'
    }
    tabTxt+='<p class="pep_p_tab pep_p_tab_add"></p>'

    $(".pep_p_tabGroup").html(tabTxt)

    let tabInfoTxt = "";
    for (let priceCode in price) {

        let pdata = price[priceCode]
        tabInfoTxt+='<div class="pep_p" id="'+priceCode+'"><div class="pep_p_gen"><div class="pep_p_gen_line"><p class="pep_p_gen_title">DESCRIPTION</p>';
        tabInfoTxt+='<input value="'+pdata.description+'" class="pep_p_gen_input pep_p_gen_input pep_description_'+priceCode+'"/></div><div class="pep_p_gen_line"><p class="pep_p_gen_title">RESERVATION DATE</p>';
        tabInfoTxt+='<input value="'+pdata.reservationDate_from.trim()+' - '+pdata.reservationDate_to.trim()+'" class="pep_p_gen_input pep_p_gen_reservation pep_p_gen_input--dropdown '+priceCode+'_reservation"/><checkbox class="pei_forall"></checkbox><p class="pei_forall_txt">For All Date</p>';
        tabInfoTxt+='</div><div class="pep_p_gen_line"><p class="pep_p_gen_title">TOUR DATE</p><input value="'+pdata.tourDate_from.trim()+' - '+pdata.tourDate_to.trim()+'" class="pep_p_gen_input pep_p_gen_tour pep_p_gen_input--dropdown '+priceCode+'_tour"/>';
        tabInfoTxt+='</div></div><div class="pep_p_ag"><div class="pep_p_ag_setZone" pid="'+priceCode+'"><p class="pep_p_ag_set btn">AGENCY PRICE SET</p></div>'
        tabInfoTxt+='<div class="'+priceCode+'_byAgenciesBox">'

        for (var i = 0; i < price[priceCode].byAgencies.length; i++) {
            let info = price[priceCode].byAgencies[i];

            tabInfoTxt+='<div class="pep_p_ag_box '+priceCode+'_pep_p_ag_box_'+i+'"><p class="pep_p_ag_box_title pep_pricegroup_'+priceCode+'">PRICE GROUP '+i+'</p>'
            tabInfoTxt+='<img class="pep_p_ag_box_close" cid="'+priceCode+"_"+i+'" src="./assets/icon-close.svg"/><div class="pep_p_ag_box_currency"><p class="pep_p_ag_box_currency_title">CURRENCY UNIT</p>'
            tabInfoTxt+='<div class="pep_p_ag_box_currency_rbox pei_price_currency pep_currency_'+priceCode+'_'+i+'" rstat="'+info.currency+'"><div class="dw_radio">USD</div><div class="dw_radio">KRW</div><div class="dw_radio">CNY</div>'
            tabInfoTxt+='</div></div><div class="pep_p_ag_box_agencies '+priceCode+'_pep_p_ag_box_agencies_'+i+'">'

            if(info.agency){
                for (var j = 0; j < info.agency.length; j++) {
                    tabInfoTxt+='<p>'+info.agency[j]+'</p>'
                }
            }

            tabInfoTxt+='</div><table class="pep_p_ag_box_price"><tr><th></th><th>ADULT</th><th>YOUNG</th><th>BABY</th></tr>'
            tabInfoTxt+='<tr><td>AGE</td><td><input value="'+info.adultAge_min+' - '+info.adultAge_max+'" class="'+priceCode+'_pei_price_age_adult_'+i+'"/></td>';
            tabInfoTxt+='<td><input value="'+info.kidAge_min+' - '+info.kidAge_max+'" class="'+priceCode+'_pei_price_age_kid_'+i+'"/></td>';
            tabInfoTxt+='<td><input value="'+info.infantAge_min+' - '+info.infantAge_max+'" class="'+priceCode+'_pei_price_age_infant_'+i+'"/></td></tr>';

            tabInfoTxt+='<tr><td>GROSS</td><td><input value="'+info.adult_gross+'" class="'+priceCode+'_pei_price_gross_adult_'+i+'"/></td>';
            tabInfoTxt+='<td><input value="'+info.kid_gross+'" class="'+priceCode+'_pei_price_gross_kid_'+i+'"/></td>';
            tabInfoTxt+='<td><input value="'+info.infant_gross+'" class="'+priceCode+'_pei_price_gross_infant_'+i+'"/></td></tr>';

            tabInfoTxt+='<tr><td>NET</td><td><input value="'+info.adult_net+'" class="'+priceCode+'_pei_price_net_adult_'+i+'"/></td>';
            tabInfoTxt+='<td><input value="'+info.kid_net+'" class="'+priceCode+'_pei_price_net_kid_'+i+'"/></td>';
            tabInfoTxt+='<td><input value="'+info.infant_net+'" class="'+priceCode+'_pei_price_net_infant_'+i+'"/></td></tr>';

            tabInfoTxt+='<tr><td>COMMISION</td><td><input readonly class="'+priceCode+'_pei_price_commision_adult_'+i+'"/></td>'
            tabInfoTxt+='<td><input readonly class="'+priceCode+'_pei_price_commision_kid_'+i+'"/></td>';
            tabInfoTxt+='<td><input readonly class="'+priceCode+'_pei_price_commision_infant_'+i+'"/></td></tr></table></div>';

        }

        tabInfoTxt+='</div><div class="ov_hidden"><div class="longbtn pep_p_ag_add" pid="'+priceCode+'"><img src="./assets/icon-add.svg"/>'
        tabInfoTxt+='<p>ADD NEW PRICE GROUP</p></div></div></div></div>'
    }

    $(".pep_p_tabinfo").html(tabInfoTxt)

    for (let priceCode in price) {
        if(price[priceCode].forAll){
            $("#"+priceCode).find(".pei_forall").addClass("cb_checked")
        }else{
            $(".pei_forall").removeClass("cb_checked")
        }
    }

    $(".pep_p_tab_box").eq(0).addClass("pep_p_tab--selected");

    for (let priceCode in price) {
        for (let i = 0; i < price[priceCode].byAgencies.length; i++) {
            let currency = price[priceCode].byAgencies[i].currency;
            if(currency === "USD"){$(".pep_currency_"+priceCode+"_"+i).children(".dw_radio").eq(0).addClass("dw_radio_selected")}
            if(currency === "KRW"){$(".pep_currency_"+priceCode+"_"+i).children(".dw_radio").eq(1).addClass("dw_radio_selected")}
            if(currency === "CNY"){$(".pep_currency_"+priceCode+"_"+i).children(".dw_radio").eq(2).addClass("dw_radio_selected")}

            let info = price[priceCode].byAgencies[i];

            $("."+priceCode+"_pei_price_commision_adult_"+i).val((Math.round((info.adult_gross - info.adult_net)*1000/info.adult_gross)/10)+'%');
            $("."+priceCode+"_pei_price_commision_kid_"+i).val((Math.round((info.kid_gross - info.kid_net)*1000/info.kid_gross)/10)+'%')
            $("."+priceCode+"_pei_price_commision_infant_"+i).val((Math.round((info.infant_gross - info.infant_net)*1000/info.infant_gross)/10)+'%')

        }
    }

    $(".pep_p").addClass("hidden");
    $(".pep_p").eq(0).removeClass("hidden")

    //price 탭 내용 draw가 끝났다

    let cost = data.cost

    let costTxt = '';
    if(data.cost){
        if(cost.item){
            for (let i = 0; i < cost.item.length; i++) {
                costTxt +='<div class="pep_p_as"><img class="pep_p_as_remove" src="./assets/icon-close.svg" /><div class="ov_hidden"><input class="pep_p_as_title" placeholder="New Item"/><div class="pep_p_as_pre">'
                costTxt += '<checkbox class="pep_p_as_pre_cb"></checkbox><p>PURCHASE IN ADVANCE</p></div></div><table class="pep_p_as_price">'
                costTxt+='<tr><th></th><th>ADULT</th><th>YOUNG</th><th>KID</th><th>BABY</th></tr><tr><td>AGE</td>'
                costTxt+='<td><input class="pei_age_adult_'+i+'"/></td><td><input class="pei_age_young_'+i+'"/></td>'
                costTxt+='<td><input class="pei_age_kid_'+i+'"/></td><td><input class="pei_age_free_'+i+'"/></td>'
                costTxt+='</tr><tr><td>PRICE</td>'
                costTxt+='<td><input class="pei_price_adult_'+i+'"/></td><td><input class="pei_price_young_'+i+'"/></td>'
                costTxt+='<td><input class="pei_price_kid_'+i+'"/></td><td><input class="pei_price_free_'+i+'"/></td>'
                costTxt+='</tr></table></div>'
            }
        }
    }
    $(".pep_p_as_box").html(costTxt)

    if(data.cost){
        if(cost.item){
            for (let i = 0; i < cost.item.length; i++) {
                if(cost.item[i].pre){
                    $(".pep_p_as_pre_cb").eq(i).addClass("cb_checked")
                }
                $(".pep_p_as_title").eq(i).val(cost.item[i].item)
                $(".pei_age_adult_"+i).val(cost.item[i].adultAge_min+"-"+cost.item[i].adultAge_max)
                $(".pei_age_young_"+i).val(cost.item[i].youngAge_min+"-"+cost.item[i].youngAge_max)
                $(".pei_age_kid_"+i).val(cost.item[i].kidAge_min+"-"+cost.item[i].kidAge_max)
                $(".pei_age_free_"+i).val("-")
                $(".pei_price_adult_"+i).val(cost.item[i].adult_cost)
                $(".pei_price_young_"+i).val(cost.item[i].young_cost)
                $(".pei_price_kid_"+i).val(cost.item[i].kid_cost)
                $(".pei_price_free_"+i).val(0)
            }
        }
    }

    let busTxt = '';

    if(data.cost){
        if(cost.bus){
            for (let i = 0; i < cost.bus.length; i++) {
                busTxt+='<div class="pep_p_bus"><img class="pep_p_bus_remove" src="./assets/icon-close.svg"/><input class="pep_p_bus_name"><table class="pep_p_bus_price" border="1"><tr><th>PEOPLE</th><th>PRICE</th></tr>';

                for (let j = 0; j < cost.bus[i].size.length; j++) {
                    busTxt+='<tr class="pei_bus_'+i+'"><th><input class="pei_bus_'+i+'_people_'+j+'"/></th><th><input class="pei_bus_'+i+'_price_'+j+'"/></th></tr>'
                }
                busTxt+='<tr><th class="pep_p_bus_price_add"  colspan="2">+ ADD CELL</th></tr></table></div>'
            }
        }
    }else{
        console.log("cost 데이터가 없다");
    }
    $(".pep_p_bus_box").html(busTxt)

    if(data.cost){
        if(cost.bus){
            for (let i = 0; i < cost.bus.length; i++) {
                $(".pep_p_bus_name").eq(i).val(cost.bus[i].name);
                for (let j = 0; j < cost.bus[i].size.length; j++) {
                    $(".pei_bus_"+i+"_people_"+j).val(cost.bus[i].size[j].min +"-"+cost.bus[i].size[j].max);
                    $(".pei_bus_"+i+"_price_"+j).val(cost.bus[i].size[j].cost);
                }
            }
        }else{
            console.log("bus 데이터가 없다");
        }
        if(cost.wage){
            $(".pei_wage").val(cost.wage)
        }else{
            $(".pei_wage").val(0)
        }
    }else{
        console.log("cost 데이터가 없다");
    }

    let optionTxt = ''
    if(data.option){
        for (let i = 0; i < data.option.length; i++) {
            optionTxt+='<div class="pep_p_op"><img class="pep_p_op_close" src="./assets/icon-close.svg"/><div class="ov_hidden"><input class="pep_p_op_name" value="'+data.option[i].option+'"/>'
            optionTxt+='<input class="pep_p_op_price" value="'+data.option[i].price+'"/><p class="pep_p_op_currency">WON</p></div><div class="ov_hidden"><p class="pep_p_op_potitle">Possibles</p><input class="pep_p_op_possibles" spellcheck="false" value="'+data.option[i].possibles.join(";")+'"></input></div></div>'
        }
    }

    $(".pep_p_op_box").html(optionTxt)

    open_product("info");
}



function open_product(tabName){
    $(".lightBox_shadow").removeClass("hidden");
    $(".pe").removeClass("hidden");
    $(".pe_tab").addClass("hidden");
    $(".pe_tab_"+tabName).removeClass("hidden")
    $(".pe_nav>p").removeClass("pe_nav--selected");
    $(".pe_nav_"+tabName).addClass("pe_nav--selected");
}

function close_detail(){
    $(".lightBox_shadow").addClass("hidden");
    $(".pe").addClass("hidden");
}

function setPickDrop(area){
    if($(".pei_area").val()!==area){ //다만 내용이 바뀌었을때만 실행한다
        let pickArray = pickupObj[area]
        let picktxt='<div class="ov_hidden mt_20"><p class="pei_meeting_no">1.</p><input readonly spellcheck="false" class="dw_dropdown fl_left pe_mid pei_meeting pei_meeting_1" id="pei_meeting_1" dropitem="'+pickArray+'" value=""><img class="p_ml_remove" src="./assets/icon-close-small.svg"/></div>'
        $(".pei_pickupLocationZone").html(picktxt)
    }
}
function addPickDrop(){
    let i = $(".pei_meeting_no").length
    let pickArray = pickupObj[$(".pei_area").val()]
    let picktxt='<div class="ov_hidden mt_20"><p class="pei_meeting_no">'+(i+1)+'.</p><input readonly spellcheck="false" class="dw_dropdown fl_left pe_mid pei_meeting pei_meeting_'+(i+1)+'" id="pei_meeting_'+(i+1)+'" dropitem="'+pickArray+'" value="New Meeting Location"><img class="p_ml_remove" src="./assets/icon-close-small.svg"/></div>'
    $(".pei_pickupLocationZone").append(picktxt);
}
function removePickDrop(div){
    $(div).parent().remove();
    for (let i = 0; i < $(".pei_meeting_no").length; i++) {
        $(".pei_meeting_no").eq(i).html(i+1+".")
    }
}

function choosePickDrop(div){
    let index = $(div).attr("did").split("_")[2]*1-1
    product[$(".pe").attr("pid")].info.pickup[index] = $(div).html();
}

function movePricesetTab(div){
    if(!$(div).hasClass("pep_p_tab_add")){
        $(".pep_p_tab_box").removeClass("pep_p_tab--selected")
        $(div).addClass("pep_p_tab--selected")
        $(".pep_p").addClass("hidden");
        $("#"+$(div).children(".pep_p_tab").attr("tid")).removeClass("hidden")
    }
}

function makePriceGroup(pid){
    let info = {
        adultAge_max:0,
        adultAge_min:0,
        adult_gross:10000,
        adult_net:10000,
        agency:[],
        currency:"KRW",
        infantAge_max:0,
        infantAge_min:0,
        infant_gross:10000,
        infant_net:10000,
        kidAge_max:0,
        kidAge_min:0,
        kid_gross:10000,
        kid_net:10000,
    }
    let i = $("."+pid+"_byAgenciesBox").children(".pep_p_ag_box").length //배열의 요기에 저장될것
    let priceCode = pid;
    let tabInfoTxt = ""

    tabInfoTxt+='<div class="pep_p_ag_box '+priceCode+'_pep_p_ag_box_'+i+'"><p class="pep_p_ag_box_title pep_pricegroup_'+priceCode+'">PRICE GROUP '+i+'</p>'
    tabInfoTxt+='<img class="pep_p_ag_box_close" cid="'+priceCode+"_"+i+'" src="./assets/icon-close.svg"/><div class="pep_p_ag_box_currency"><p class="pep_p_ag_box_currency_title">CURRENCY UNIT</p>'
    tabInfoTxt+='<div class="pep_p_ag_box_currency_rbox pei_price_currency pep_currency_'+priceCode+'_'+i+'" rstat="'+info.currency+'"><div class="dw_radio">USD</div><div class="dw_radio dw_radio_selected">KRW</div><div class="dw_radio">CNY</div>'
    tabInfoTxt+='</div></div><div class="pep_p_ag_box_agencies '+priceCode+'_pep_p_ag_box_agencies_'+i+'">'

    for (var j = 0; j < info.agency.length; j++) {
        tabInfoTxt+='<p>'+info.agency[j]+'</p>'
    }

    tabInfoTxt+='</div><table class="pep_p_ag_box_price"><tr><th></th><th>ADULT</th><th>YOUNG</th><th>BABY</th></tr>'
    tabInfoTxt+='<tr><td>AGE</td><td><input value="'+info.adultAge_min+' - '+info.adultAge_max+'" class="'+priceCode+'_pei_price_age_adult_'+i+'"/></td>';
    tabInfoTxt+='<td><input value="'+info.kidAge_min+' - '+info.kidAge_max+'" class="'+priceCode+'_pei_price_age_kid_'+i+'"/></td>';
    tabInfoTxt+='<td><input value="'+info.infantAge_min+' - '+info.infantAge_max+'" class="'+priceCode+'_pei_price_age_infant_'+i+'"/></td></tr>';

    tabInfoTxt+='<tr><td>GROSS</td><td><input value="'+info.adult_gross+'" class="'+priceCode+'_pei_price_gross_adult_'+i+'"/></td>';
    tabInfoTxt+='<td><input value="'+info.kid_gross+'" class="'+priceCode+'_pei_price_gross_kid_'+i+'"/></td>';
    tabInfoTxt+='<td><input value="'+info.infant_gross+'" class="'+priceCode+'_pei_price_gross_infant_'+i+'"/></td></tr>';

    tabInfoTxt+='<tr><td>NET</td><td><input value="'+info.adult_net+'" class="'+priceCode+'_pei_price_net_adult_'+i+'"/></td>';
    tabInfoTxt+='<td><input value="'+info.kid_net+'" class="'+priceCode+'_pei_price_net_kid_'+i+'"/></td>';
    tabInfoTxt+='<td><input value="'+info.infant_net+'" class="'+priceCode+'_pei_price_net_infant_'+i+'"/></td></tr>';

    tabInfoTxt+='<tr><td>COMMISION</td><td><input readonly class="'+priceCode+'_pei_price_commision_adult_'+i+'"/></td>'
    tabInfoTxt+='<td><input readonly class="'+priceCode+'_pei_price_commision_kid_'+i+'"/></td>';
    tabInfoTxt+='<td><input readonly class="'+priceCode+'_pei_price_commision_infant_'+i+'"/></td></tr></table></div>';

    $("."+pid+"_byAgenciesBox").append(tabInfoTxt)
}

function deletePriceGroup(div){
    for (let i = 0; i < $(".pep_p_ag").length; i++) {
        for (var j = 0; j < $(".pep_p_ag").eq(i).find(".pep_p_ag_box").length; j++) {
            if($(".pep_p_ag").eq(i).find(".pep_p_ag_box").length>1){
                $(div).parent().remove();
                $(".pep_p_ag").eq(i).find(".pep_p_ag_box").eq(j).find(".pep_p_ag_box_title").html("PRICE GROUP "+j)
            }
        }
    }
}

function setAgencyPrice(div){
    let priceID = $(div).parent().attr("pid")
    $(".pe_APC_footer_save").attr("pid",priceID)
    let data = []

    let apg = $("."+priceID+"_byAgenciesBox").find(".pep_p_ag_box_agencies")
    for (let i = 0; i < apg.length; i++) {
        data.push([])
        for (let j = 0; j < $(apg).eq(i).children("p").length; j++) {
            data[i].push($(apg).eq(i).children("p").eq(j).html());
        }
    }


    let unassignedGroup = []
    for (let i = 0; i < agencyArray.length; i++) {
        unassignedGroup.push(agencyArray[i])
    }

    let txt = ""

    for (let i = 0; i < data.length; i++) {
        txt+='<p class="APC_title APC_group">Group '+i+'</p><div class="APC_box">'
        for (let j = 0; j < data[i].length; j++) {
            unassignedGroup.splice(unassignedGroup.indexOf(data[i][j]),1)
            txt+='<p class="APC_agency">'+data[i][j]+'</p>'
        }
        txt+='</div>'
    }
    $(".APC_groupZone").html(txt)

    let untxt = ""

    for (let i = 0; i < unassignedGroup.length; i++) {
        untxt+='<p class="APC_agency">'+unassignedGroup[i]+'</p>'
    }
    $(".APC_Unassigned").html(untxt)


    $(".insidePop").removeClass("hidden");
    $(".pe_APC").removeClass("hidden");

}

function agencySelect(div){
    if(!$(div).hasClass("APC_agency--dim")){
        $(div).toggleClass("APC_agency--selected")
    }
    if($(".APC_agency--selected").length>0){
        $(".APC_group").addClass("APC_group--shine")
    }else{
        $(".APC_group").removeClass("APC_group--shine")
    }
}
function agencyMove(div){
    let txt=""
    for (let i = 0; i < $(".APC_agency--selected").length; i++) {
        txt+='<p class="APC_agency">'+$(".APC_agency--selected").eq(i).html()+'</p>'
    }
    $(div).next().append(txt)
    $(".APC_agency--selected").remove()
    if($(".APC_agency--selected").length>0){
        $(".APC_group").addClass("APC_group--shine")
    }else{
        $(".APC_group").removeClass("APC_group--shine")
    }
}
function APCClose(){
    $(".insidePop").addClass("hidden");
    $(".pe_APC").addClass("hidden");
}
function setAPC(){
    let groupArray = []
    let pid = $(".pe_APC_footer_save").attr("pid")
    let txt = ""
    for (let i = 0; i < $(".APC_group").length; i++) {
        txt=""
        for (var j = 0; j < $(".APC_group").eq(i).next().children(".APC_agency").length; j++) {
            txt+='<p>'+$(".APC_group").eq(i).next().children(".APC_agency").eq(j).html()+'</p>'
        }
        $("."+pid+"_byAgenciesBox").find(".pep_p_ag_box_agencies").eq(i).html(txt)
    }
    $(".insidePop").addClass("hidden");
    $(".pe_APC").addClass("hidden");
}
function addOption(){
    let optionTxt = ''

    optionTxt+='<div class="pep_p_op"><img class="pep_p_op_close" src="./assets/icon-close.svg"/><div class="ov_hidden"><input class="pep_p_op_name" value="OPTION NAME"/>'
    optionTxt+='<input class="pep_p_op_price" value="0"/><p class="pep_p_op_currency">WON</p></div><div class="ov_hidden"><p class="pep_p_op_potitle">Possibles</p><input class="pep_p_op_possibles" spellcheck="false"></input></div></div>'

    $(".pep_p_op_box").append(optionTxt)
}
function addAsset(){
    let costTxt = '';
    let i = $(".pep_p_as").length

    costTxt +='<div class="pep_p_as"><img class="pep_p_as_remove" src="./assets/icon-close.svg" /><div class="ov_hidden"><input class="pep_p_as_title" placeholder="New Item"/><div class="pep_p_as_pre">'
    costTxt += '<checkbox class="pep_p_as_pre_cb cb_checked"></checkbox><p>PURCHASE IN ADVANCE</p></div></div><table class="pep_p_as_price">'
    costTxt+='<tr><th></th><th>ADULT</th><th>YOUNG</th><th>KID</th><th>BABY</th></tr><tr><td>AGE</td>'
    costTxt+='<td><input class="pei_age_adult_'+i+'" value="19-65"/></td><td><input class="pei_age_young_'+i+'" value="9-18"/></td>'
    costTxt+='<td><input class="pei_age_kid_'+i+'" value="3-8"/></td><td><input class="pei_age_free_'+i+'" value="-"/></td>'
    costTxt+='</tr><tr><td>PRICE</td>'
    costTxt+='<td><input class="pei_price_adult_'+i+'" value="10000"/></td><td><input class="pei_price_young_'+i+'" value="10000"/></td>'
    costTxt+='<td><input class="pei_price_kid_'+i+'" value="10000"/></td><td><input class="pei_price_free_'+i+'" value="0"/></td>'
    costTxt+='</tr></table></div>'

    $(".pep_p_as_box").append(costTxt)
}
function addBus(){
    let busTxt = '';

    let i = $(".pep_p_bus").length
    busTxt+='<div class="pep_p_bus"><img class="pep_p_bus_remove" src="./assets/icon-close.svg"/><input class="pep_p_bus_name" value="NEW BUS"><table class="pep_p_bus_price" border="1"><tr><th>PEOPLE</th><th>PRICE</th></tr>';

    for (let j = 0; j < 2; j++) {
        busTxt+='<tr class="pei_bus_'+i+'"><th><input class="pei_bus_'+i+'_people_'+j+'" value="0-0"/></th><th><input class="pei_bus_'+i+'_price_'+j+'" value="0"/></th></tr>'
    }
    busTxt+='<tr><th class="pep_p_bus_price_add"  colspan="2">+ ADD CELL</th></tr></table></div>'

    $(".pep_p_bus_box").append(busTxt)
}
function addBusCell(no){
    let number = $(".pei_bus_"+no).length - 1;
    if(number<4){
        let txt = '<tr class="pei_bus_'+no+'"><th><input class="pei_bus_'+no+'_people_'+(number+1)+'" value="0-0"/></th><th><input class="pei_bus_'+no+'_price_'+(number+1)+'" value="0"/></th></tr>'
        $(".pei_bus_"+no).eq(number).after(txt)
    }
}

function addPriceTab(){
    let pdata = {
        byAgencies:[{
            adultAge_max:0,
            adultAge_min:0,
            adult_gross:10000,
            adult_net:10000,
            agency:[],
            currency:"KRW",
            infantAge_max:0,
            infantAge_min:0,
            infant_gross:10000,
            infant_net:10000,
            kidAge_max:0,
            kidAge_min:0,
            kid_gross:10000,
            kid_net:10000,
        }],
        description:"description field",
        forAll:false,
        reservationDate_from:datestring.today(),
        reservationDate_to:datestring.today(),
        tourDate_from:datestring.today(),
        tourDate_to:datestring.today(),
        title:"New PriceSet"
    }

    let key = firebase.database().ref().push().key;

    let tabTxt='<div class="pep_p_tab_box"><input class="pep_p_tab pep_title_'+key+'" tid="'+key+'" spellcheck="false" value="'+pdata.title.toUpperCase()+'"/><img class="pep_p_tab_remove" src="./assets/icon-close-small.svg" /></div><p class="pep_p_tab pep_p_tab_add"></p>'
    $(".pep_p_tab_add").remove();
    $(".pep_p_tabGroup").append(tabTxt);

    let tabInfoTxt = "";
    tabInfoTxt+='<div class="pep_p" id="'+key+'"><div class="pep_p_gen"><div class="pep_p_gen_line"><p class="pep_p_gen_title">DESCRIPTION</p>';
    tabInfoTxt+='<input value="" class="pep_p_gen_input pep_p_gen_input pep_description_'+key+'"/></div><div class="pep_p_gen_line">';
    tabInfoTxt+='<p class="pep_p_gen_title">RESERVATION DATE</p><input value="'+datestring.today()+' - '+datestring.today()+'" class="pep_p_gen_input pep_p_gen_reservation pep_p_gen_input--dropdown '+key+'_reservation"/><checkbox class="pei_forall"></checkbox><p class="pei_forall_txt">For All Date</p>';
    tabInfoTxt+='</div><div class="pep_p_gen_line"><p class="pep_p_gen_title">TOUR DATE</p><input value="'+datestring.today()+' - '+datestring.today()+'" class="pep_p_gen_input pep_p_gen_tour pep_p_gen_input--dropdown '+key+'_tour"/>';
    tabInfoTxt+='</div></div><div class="pep_p_ag"><div class="pep_p_ag_setZone" pid="'+key+'"><p class="pep_p_ag_set btn">AGENCY PRICE SET</p></div>'
    tabInfoTxt+='<div class="'+key+'_byAgenciesBox">'

    let i = 0

    tabInfoTxt+='<div class="pep_p_ag_box '+key+'_pep_p_ag_box_'+i+'"><p class="pep_p_ag_box_title pep_pricegroup_'+key+'">PRICE GROUP '+i+'</p>'
    tabInfoTxt+='<img class="pep_p_ag_box_close" cid="'+key+"_"+i+'" src="./assets/icon-close.svg"/><div class="pep_p_ag_box_currency"><p class="pep_p_ag_box_currency_title">CURRENCY UNIT</p>'
    tabInfoTxt+='<div class="pep_p_ag_box_currency_rbox pei_price_currency pep_currency_'+key+'_'+i+'" rstat="KRW"><div class="dw_radio">USD</div><div class="dw_radio">KRW</div><div class="dw_radio">CNY</div>'
    tabInfoTxt+='</div></div><div class="pep_p_ag_box_agencies '+key+'_pep_p_ag_box_agencies_'+i+'">'


    tabInfoTxt+='</div><table class="pep_p_ag_box_price"><tr><th></th><th>ADULT</th><th>YOUNG</th><th>BABY</th></tr>'
    tabInfoTxt+='<tr><td>AGE</td><td><input value="20-99" class="'+key+'_pei_price_age_adult_'+i+'"/></td>';
    tabInfoTxt+='<td><input value="3-19" class="'+key+'_pei_price_age_kid_'+i+'"/></td>';
    tabInfoTxt+='<td><input value="0-2" class="'+key+'_pei_price_age_infant_'+i+'"/></td></tr>';

    tabInfoTxt+='<tr><td>GROSS</td><td><input value="30000" class="'+key+'_pei_price_gross_adult_'+i+'"/></td>';
    tabInfoTxt+='<td><input value="15000" class="'+key+'_pei_price_gross_kid_'+i+'"/></td>';
    tabInfoTxt+='<td><input value="0" class="'+key+'_pei_price_gross_infant_'+i+'"/></td></tr>';

    tabInfoTxt+='<tr><td>NET</td><td><input value="20000" class="'+key+'_pei_price_net_adult_'+i+'"/></td>';
    tabInfoTxt+='<td><input value="10000" class="'+key+'_pei_price_net_kid_'+i+'"/></td>';
    tabInfoTxt+='<td><input value="0" class="'+key+'_pei_price_net_infant_'+i+'"/></td></tr>';

    tabInfoTxt+='<tr><td>COMMISION</td><td><input readonly class="'+key+'_pei_price_commision_adult_'+i+'"/></td>'
    tabInfoTxt+='<td><input readonly class="'+key+'_pei_price_commision_kid_'+i+'"/></td>';
    tabInfoTxt+='<td><input readonly class="'+key+'_pei_price_commision_infant_'+i+'"/></td></tr></table></div>';


    tabInfoTxt+='</div><div class="ov_hidden"><div class="longbtn pep_p_ag_add" pid="'+key+'"><img src="./assets/icon-add.svg"/>'
    tabInfoTxt+='<p>ADD NEW PRICE GROUP</p></div></div></div></div>'


    $(".pep_p_tabinfo").append(tabInfoTxt)

}

function removePriceTab(div){
    let i = $(".pep_p_tab_box").index($(div).parent());
    $(".pep_p_tab_box").eq(i).remove()
    $(div).parent().remove().then(function(){
        $(".pep_p_tab_box").removeClass("pep_p_tab--selected")
        $(".pep_p_tab_box").eq(0).addClass("pep_p_tab--selected");
        $(".pep_p").addClass("hidden");
        $(".pep_p").eq(0).removeClass("hidden")
    })

}
