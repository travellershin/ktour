
$(document).on("click", ".pc", function(){ //개별 프로덕트 클릭 -> Edit창 열기
    show_detail($(this).attr('id'));
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


function addNewProduct(){
    let key = firebase.database().ref().push().key
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
    $(".pe").attr("pid",pid);
    $(".pe_header_title").html(data.id.split("_")[2] + " EDIT");

    let info = ["name","area","category","status","period","description","deadline","itinerary",
                "cancellation","include","exclude","others"] //db에서 input text 형태로 입력된 data들을 정의

    for (let i = 0; i < info.length; i++) { //input text 형태의 data들을 집어넣음
        $(".input_info_"+info[i]).val(data.info[info[i]]);
    }

    if(data.info.memo){ //메모 내용은 없을수도 있어서...?
        $(".input_info_memo").val(data.info.memo)
    }else{
        $(".input_info_memo").val("")
    }

    $(".arraydata_possibles").val(data.possibles.join(";\n")); //possibles는 ;으로 분리해 보여줌

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
    for (var i = 0; i < data.info.pickup.length; i++) {
        picktxt+='<div class="ov_hidden mt_20"><p class="pei_meeting_no">'+(i+1)+'.</p><input readonly spellcheck="false" class="dw_dropdown fl_left pe_mid pei_meeting pei_meeting_'+(i+1)+'" id="pei_meeting_'+(i+1)+'" dropitem="'+pickArray+'" value="'+data.info.pickup[i]+'"><img class="p_ml_remove" src="./assets/icon-close-small.svg"/></div>'
    }
    $(".pei_pickupLocationZone").html(picktxt)
    //info 탭 내용 draw가 끝났다

    let agencyTxt = ""
    for (let i = 0; i < agencyArray.length; i++) {
        agencyTxt+='<p class="pea_title">'+agencyArray[i]+'</p><div class="pea_agency pea_'+agencyArray[i]+'" rstat="';
        if(data.agency[agencyArray[i]]){
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
        tabInfoTxt+='<input value="'+pdata.description+'" class="pep_p_gen_input pep_p_gen_input pep_description_'+priceCode+'"/></div><div class="pep_p_gen_line">';
        tabInfoTxt+='<p class="pep_p_gen_title">RESERVATION DATE</p><input value="'+pdata.reservationDate_from.trim()+' - '+pdata.reservationDate_to.trim()+'" class="pep_p_gen_input pep_p_gen_reservation pep_p_gen_input--dropdown '+priceCode+'_reservation"/>';
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
    if(cost.item){
        for (let i = 0; i < cost.item.length; i++) {
            costTxt +='<div class="pep_p_as"><img class="pep_p_as_remove" src="./assets/icon-close.svg" /><input class="pep_p_as_title"/><table class="pep_p_as_price">'
            costTxt+='<tr><th></th><th>ADULT</th><th>TEEN</th><th>YOUNG</th><th>BABY</th></tr><tr><td>AGE</td>'
            costTxt+='<td><input class="pei_age_adult_'+i+'"/></td><td><input class="pei_age_young_'+i+'"/></td>'
            costTxt+='<td><input class="pei_age_kid_'+i+'"/></td><td><input class="pei_age_free_'+i+'"/></td>'
            costTxt+='</tr><tr><td>PRICE</td>'
            costTxt+='<td><input class="pei_price_adult_'+i+'"/></td><td><input class="pei_price_young_'+i+'"/></td>'
            costTxt+='<td><input class="pei_price_kid_'+i+'"/></td><td><input class="pei_price_free_'+i+'"/></td>'
            costTxt+='</tr></table></div>'
        }
    }

    $(".pep_p_as_box").html(costTxt)

    if(cost.item){
        for (let i = 0; i < cost.item.length; i++) {
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

    let busTxt = '';

    for (let i = 0; i < cost.bus.length; i++) {
        busTxt+='<div class="pep_p_bus"><input class="pep_p_bus_name"><table class="pep_p_bus_price" border="1"><tr><th>PEOPLE</th><th>PRICE</th></tr>';

        for (let j = 0; j < cost.bus[i].size.length; j++) {
            busTxt+='<tr class="pei_bus_'+i+'"><th><input class="pei_bus_'+i+'_people_'+j+'"/></th><th><input class="pei_bus_'+i+'_price_'+j+'"/></th></tr>'
        }
        busTxt+='<tr><th class="pep_p_bus_price_add"  colspan="2">+ ADD CELL</th></tr></table></div>'
    }
    $(".pep_p_bus_box").html(busTxt)

    for (let i = 0; i < cost.bus.length; i++) {
        $(".pep_p_bus_name").eq(i).val(cost.bus[i].name);
        for (let j = 0; j < cost.bus[i].size.length; j++) {
            $(".pei_bus_"+i+"_people_"+j).val(cost.bus[i].size[j].min +"-"+cost.bus[i].size[j].max);
            $(".pei_bus_"+i+"_price_"+j).val(cost.bus[i].size[j].cost);
        }
    }



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

    let priceGroup = {
        agencyStatUnassigned:[],
        Refused:[],
        Screening:[],
        Unassigned:[]
    }


    for (let i = 0; i < $(".pea_agency").length; i++) {
        if($(".pea_agency").eq(i).attr("rstat")==="Refused"){
            priceGroup.Refused.push($(".pea_title").eq(i).html())
        }else if($(".pea_agency").eq(i).attr("rstat")==="Unassigned"){
            priceGroup.agencyStatUnassigned.push($(".pea_title").eq(i).html())
        }else if($(".pea_agency").eq(i).attr("rstat")==="Screening"){
            priceGroup.Screening.push($(".pea_title").eq(i).html())
        }else{
            priceGroup.Unassigned.push($(".pea_title").eq(i).html())
        }
    }

    let apg = $("."+priceID+"_byAgenciesBox").find(".pep_p_ag_box_agencies")

    for (let i = 0; i < apg.length; i++) {
        priceGroup["Group"+(i)] = []
        for (let j = 0; j < $(apg).eq(i).children("p").length; j++) {
            priceGroup["Group"+(i)].push($(apg).eq(i).children("p").eq(j).html());
            priceGroup.Unassigned.splice(priceGroup.Unassigned.indexOf($(apg).eq(i).children("p").eq(j).html()),1)
        }
    }

    let txt = ""
    let groupTxt = ""
    for (let group in priceGroup) {
        if(group==="agencyStatUnassigned"){
            txt+='<p class="APC_title">Agency Status Unassigned</p><div class="APC_box APC_agencyStatUnassigned">'
            for (let i = 0; i < priceGroup[group].length; i++) {
                txt+='<p class="APC_agency APC_agency--dim">'+priceGroup[group][i]+'</p>'
            }
            txt+='</div>'
        }else if(group==="Screening"){
            txt+='<p class="APC_title">Screening</p><div class="APC_box APC_Screening">'
            for (let i = 0; i < priceGroup[group].length; i++) {
                txt+='<p class="APC_agency APC_agency--dim">'+priceGroup[group][i]+'</p>'
            }
            txt+='</div>'
        }else if(group==="Refused"){
            txt+='<p class="APC_title">Refused</p><div class="APC_box APC_Refused">'
            for (let i = 0; i < priceGroup[group].length; i++) {
                txt+='<p class="APC_agency APC_agency--dim">'+priceGroup[group][i]+'</p>'
            }
            txt+='</div>'
        }else if(group==="Unassigned"){
            groupTxt+='<p class="APC_title">Price Group Unassigned</p><div class="APC_box APC_Unassigned">'
            for (let i = 0; i < priceGroup[group].length; i++) {
                groupTxt+='<p class="APC_agency">'+priceGroup[group][i]+'</p>'
            }
            groupTxt+='</div>'
        }else{
            groupTxt+='<p class="APC_title APC_group">'+group+'</p><div class="APC_box APC_'+group+'">'
            for (let i = 0; i < priceGroup[group].length; i++) {
                groupTxt+='<p class="APC_agency">'+priceGroup[group][i]+'</p>'
            }
            groupTxt+='</div>'
        }
    }

    $(".APC_groupZone").html(groupTxt);
    $(".APC_otherZone").html(txt);

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
}
function addOption(){
    let optionTxt = ''

    optionTxt+='<div class="pep_p_op"><img class="pep_p_op_close" src="./assets/icon-close.svg"/><input class="pep_p_op_name" value="OPTION NAME"/>'
    optionTxt+='<input class="pep_p_op_price" value="0"/><p class="pep_p_op_currency">WON</p></div>'

    $(".pep_p_op_box").append(optionTxt)
}
function addAsset(){
    let costTxt = '';
    let i = $(".pep_p_as").length

    costTxt +='<div class="pep_p_as"><img class="pep_p_as_remove" src="./assets/icon-close.svg" /><input class="pep_p_as_title" value="asset_name"/><table class="pep_p_as_price">'
    costTxt+='<tr><th></th><th>ADULT</th><th>TEEN</th><th>YOUNG</th><th>BABY</th></tr><tr><td>AGE</td>'
    costTxt+='<td><input class="pei_age_adult_'+i+'"/></td><td><input class="pei_age_young_'+i+'"/></td>'
    costTxt+='<td><input class="pei_age_kid_'+i+'"/></td><td><input class="pei_age_free_'+i+'"/></td>'
    costTxt+='</tr><tr><td>PRICE</td>'
    costTxt+='<td><input class="pei_price_adult_'+i+'"/></td><td><input class="pei_price_young_'+i+'"/></td>'
    costTxt+='<td><input class="pei_price_kid_'+i+'"/></td><td><input class="pei_price_free_'+i+'"/></td>'
    costTxt+='</tr></table></div>'

    $(".pep_p_as_box").append(costTxt)
}