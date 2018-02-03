let product = new Product();
let pd_save = new Product_save();
let pd_edit = new Product_edit();
let pickArray = []
let product_filter = {
    total : {},
    status : {
        on : {},
        ready : {},
        stop : {}
    },
    category : {
        regular : {},
        spring : {},
        strawberry : {},
        summer : {},
        autumn : {},
        maple : {},
        winter : {},
        ski : {},
        season : {}
    }
}

$(document).ready(function(){
    product.listing();
})
$('.p_set_add').click(function(){
    product.add();
})
$(document).on("click", ".pc", function(){
    product.edit($(this).attr('id'));
})
$('.pe_header_close').click(function(){
    $('.lightBox_shadow').addClass('hidden');
})
$('.pi_header_close').click(function(){
    $('.lightBox_shadow').addClass('hidden');
})
$('.pi_footer_delete').click(function(){
    product.delete();
})
$('.pi_footer_edit').click(function(){
    product.edit();
})
$(".pe_save").click(function(){
    product.save();
})
$(".pi_nav").children().click(function(){
    show.tab_info($(this));
})
$(".pe_nav").children().click(function(){
    show.tab_edit($(this));
})
$(".closeContext").click(function(){
    if(confirm("Are you sure you want to delete this priceSet?")){
        firebase.database().ref("product/"+$(".pe").attr("productname")+"/price/"+$(this).attr("tid")).remove().then(function(){
            firebase.database().ref("product/"+$(".pe").attr("productname")+"/price").once("value", snap => {
                let data = snap.val();
                pd_edit.price(data)
            })
        })
    }
})
$(document).on("click",".pep_p_tab",function(){
    if(!$(this).hasClass("pep_p_tab_add")){
        $(".pep_p_tab").removeClass("pep_p_tab--selected")
        $(this).addClass("pep_p_tab--selected")
        $(".pep_p").addClass("hidden");
        $("#"+$(this).attr("tid")).removeClass("hidden")
    }
})
$(document).on("contextmenu",".pep_p_tab",function(){
    if(!$(this).hasClass("pep_p_tab_add")){
        event.preventDefault();
        $(".closeContext").removeClass("hidden")
        $(".closeContext").html("Delete PriceSet : "+$(this).val())
        $(".closeContext").attr("tid",$(this).attr("tid"))
        $(".closeContext").css({top: event.pageY + "px", left: event.pageX + "px"});
        $(document).bind("click", function(event) {
            $(".closeContext").addClass("hidden")
        });
    }
})
$(document).on("click",".pep_p_tab_add",function(){
    if($(".pep_p_tab").length<7){
        price_addTab($(".pe").attr("productname"));
    }else{
        alert("최대 상품 갯수를 초과했습니다")
    }
})
$(document).on("click",".pep_p_ag_add",function(){
    makePriceGroup($(this).attr("pid"))
})
$(document).on("click",".pep_p_ag_setZone",function(){
    setAgencyPrice($(this).attr("pid"));
})
$(".pe_APC_header_close").click(function(){
    $(".insidePop").addClass("hidden");
    $(".pe_APC").addClass("hidden");
})
$(document).on("click",".pe_APC_footer_save",function(){
    saveAgencyPrice($(".pep_p_tab--selected").attr("tid"));
})
$(document).on("click",".pep_p_op_add",function(){
    addOption($(".pe").attr("productname"))
})
$(document).on("click",".pep_p_as_add",function(){
    addAsset($(".pe").attr("productname"))
})
$(document).on("click",".pep_p_bus_price_add",function(){
    let index = $(".pep_p_bus_price_add").index(this);
    addBusCell(index);
})
$(document).on("click",".pep_p_bus_add",function(){
    addBus();
})
$(".pei_location_add").click(function(){
    let picktxt = ""
    picktxt+='<div class="ov_hidden mt_20"><p class="pei_meeting_no">'+($(".pei_pickupLocationZone input").length+1)+'.</p><input readonly spellcheck="false" class="dw_dropdown fl_left pe_mid pei_meeting pei_meeting_'+$(".pei_pickupLocationZone input").length+1+'" id="pei_meeting_'+$(".pei_pickupLocationZone input").length+1+'" dropitem="'+pickArray+'" value="Not Selected"></div>'
    $(".pei_pickupLocationZone").append(picktxt)
})




$('.pei_language').click(function(){
    if($(this).hasClass('pei_language_selected')){
        $(this).removeClass('pei_language_selected')
        $(".pei_language_cb").eq($(".pei_language").index(this)).removeClass('cb_checked')
    }else{
        $(this).addClass('pei_language_selected')
        $(".pei_language_cb").eq($(".pei_language").index(this)).addClass('cb_checked')
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

$(document).on("click",".pep_p_ag_box_close",function(){ //priceGroup 삭제
    removePriceGroup($(this).attr("cid"))
})


function Product(){

    this.productKey = "";

    this.languagesArray = ["Korean","Thai","English","Vietnamese","Chinese","Tagalog","Cantonese","French","Japanese","Spanish","Indonesian","German"];

    this.listing = function(){

        firebase.database().ref("product").on("value", snap => {
            let data = snap.val();
            let txt = ""
            console.log(data)

            for (var keys in data) {

                product_filter.total[keys] = data[keys];
                product_filter.status[data[keys].info.status.toLowerCase()][keys] = data[keys];
                product_filter.category[data[keys].info.category.toLowerCase()][keys] = data[keys];

                let area = data[keys].info.area;
                let category = data[keys].info.category;
                let name = data[keys].info.name;
                let inf_status = data[keys].info.status;
                let bgco = ""
                if(inf_status.toLowerCase() === "on"){
                    bgco = "green";
                }else if(inf_status.toLowerCase() === "ready"){
                    bgco = "orange";
                }else{
                    bgco = "red";
                }
                let start = '17-08-23';
                let end = '17-08-23';
                let price_adult = '132,000'
                let price_child = '32,000'
                let net_adult = '132,000'
                let net_child = '32,000'
                let agency_total = Object.keys(data[keys].agency).length;
                let agency_ongoing = 0;
                let agency_screening = 0;
                let agency_rejected = 0;
                for (let agency_status in data[keys].agency) {
                    if(data[keys].agency[agency_status] === "Ongoing"){
                        agency_ongoing++
                    }else if(data[keys].agency[agency_status] === "Screening"){
                        agency_screening++
                    }else{
                        agency_rejected++
                    }
                }

                $(".p_st_total_no").html(Object.keys(data).length);
                $(".p_stno_on").html(Object.keys(product_filter.status.on).length);
                $(".p_stno_ready").html(Object.keys(product_filter.status.ready).length);
                $(".p_stno_stop").html(Object.keys(product_filter.status.stop).length);

                //만들어지는 html은 product.html 구조 파악용 샘플 데이터 -1 참고
                // TODO: bgco_green부분과 ON에 데이터 넣기
                txt+= '<div class="pc" id="'+keys+'"><div class="pc_status"><div class="bgco_'+bgco+'">'+inf_status.toUpperCase()+'</div></div><p class="pc_area">'+area+'</p><p class="pc_category">'
                txt+= category+'</p><div class="pc_product"><p>'+name+'</p></div><p class="pc_start">'+start+'</p><p class="pc_end">'+end+'</p>'
                txt+= '<div class="pc_price"><p>adult '+price_adult+'won</p><p>child '+price_child+'won</p></div><div class="pc_net"><p>adult '+net_adult+'won</p><p>child '+net_child+'won</p></div>'
                txt+= '<div class="pc_agency"><p>'+agency_total+'개</p><p class="font_grey">(진행'+agency_ongoing+' 심사'+agency_screening+' 거절'+agency_rejected+')</p></div></div>'
            }
            $('.pc_box').html(txt)

        })
    }

    this.add = function(){

        let data = {};
        data.price = {default:{
            byAgencies:[{
                adultAge_max:0,
                adultAge_min:0,
                adult_gross:10000,
                adult_net:10000,
                agency:["not selected"],
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
            pickup:["Myungdong Station"],
            status:"on"
        };
        data.option = [],
        data.possibles = ["Not written Yet"]
        data.agency = {}
        firebase.database().ref("agency").once("value",snap =>{
            let agency = snap.val();
            for (let key in agency) {
                data.agency[agency[key].name] = "Screening"
            }
            let key = firebase.database().ref("product").push(data).key;
            this.edit(key);

        })

    }

    this.detail = function(cid){

        localStorage["product_tab"]="info"

        firebase.database().ref("product/"+cid).once("value", snap => {
            let data = snap.val();

            let strArray = ["area","category","period","status","description","itinerary","cancellation","include","exclude","others"]
            $('.pii_name').html(data.info.name);
            $('.pi_header_title').html(data.info.name);

            for (var i = 0; i < strArray.length; i++) {
                $('.pii_'+strArray[i]).html(data.info[strArray[i]])
            }

            let status = data.info.status
            if(status === "ONGOING"){
                statusColor.green();
            }else if(status === "STOP"){
                statusColor.red();
            }else{
                statusColor.orange();
            }

            let langShowTxt = "";
            for (var i = 0; i < data.info.language.length; i++) {
                if(data.info.language[i]){
                    langShowTxt+=this.languagesArray[i]+", "
                }
            }
            langShowTxt = langShowTxt.slice(0,-2);
            $('.pii_language').html(langShowTxt)

            let availShowTxt = "Every "
            let dayInWeekArray = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday","<br>*Except holiday"]
            for (var i = 0; i < 7; i++) {
                if(data.info.available[i])
                availShowTxt+= dayInWeekArray[i] + ", "
            }
            availShowTxt = availShowTxt.slice(0,-2);
            if(data.info.available[7]){
                availShowTxt+= dayInWeekArray[7]
            }

            $('.pii_available').html(availShowTxt)

            $('.pii_deadline').html(data.info.deadline +' day(s) before')

            let meetTxt = ""
            for (var i = 0; i < data.info.pickup.length; i++) {
                meetTxt += (i+1)+". "+data.info.pickup[i]+"<br>"
            }
            meetTxt = meetTxt.slice(0,-4);

            $('.pii_meeting').html(meetTxt)
            $('.pi_footer_edit').attr('cid',cid)
            $('.pi_footer_delete').attr('cid',cid)


            //agency부분 시작


            firebase.database().ref("agency").once("value", snap => {
                let agencyDB = snap.val();
                let ongoing = "";
                let screening = "";
                let refused = "";
                let unassigned = "";

                let agencyCheckArray = [];

                for (var name in data.agency) {
                    agencyCheckArray.push(name)
                }

                for (var key in agencyDB) {
                    if(agencyCheckArray.indexOf(agencyDB[key].name)>-1){ //db상 agency네임에 대한 assign 정보가 있는 경우
                        let status = data.agency[agencyDB[key].name].toLowerCase();
                        if(status === "ongoing"){
                            ongoing += '<p class="pi_tab_agency_name">'+agencyDB[key].name+'</p>'
                        }else if(status === "screening"){
                            screening += '<p class="pi_tab_agency_name">'+agencyDB[key].name+'</p>'
                        }else{
                            refused += '<p class="pi_tab_agency_name">'+agencyDB[key].name+'</p>'
                        }
                    }else{
                        unassigned += '<p class="pi_tab_agency_name">'+agencyDB[key].name+'</p>'
                    }
                }

                $(".pi_tab_agency_ongoing").html(ongoing);
                $(".pi_tab_agency_screening").html(screening);
                $(".pi_tab_agency_refused").html(refused);
                $(".pi_tab_agency_unassigned").html(unassigned);

                show.info(); //팝업창을 띄우고 info 탭을 표시한다. textarea들의 높이를 조정한다.
            })

        })
    }

    this.delete = function(){
        let cid = $(".pi_footer_delete").attr("cid");
        $('.lightBox_shadow').addClass('hidden');
        $('.pi').addClass('hidden');
        firebase.database().ref("product/"+cid).remove();
        this.show();
    }

    this.edit = function(cid){
        $(".pe").attr("productname",cid)
        this.productKey = cid;

        firebase.database().ref("place/city").once("value", snap => {
            let pickdata = snap.val();
        }).then(function(){
            firebase.database().ref("product/"+cid).once("value", snap => {

                let data = snap.val();
                let info = data.info;

                $(".pe_tab").addClass("hidden");
                $(".pe_tab_info").removeClass("hidden")
                $(".pe_header_title").html(data.id.split("_")[2] + " EDIT")


                let inputStringArray = ["code","possibles","area","period","category","status"];
                let htmlStringArray = ["description","cancellation","itinerary","include","exclude","others","category","status"]

                for (var i = 0; i < inputStringArray.length; i++) {
                    $(".pei_"+inputStringArray[i]).val(info[inputStringArray[i]])
                }

                $('.pei_name').val(info.name)

                let inputNumArray = ["deadline"];

                for (var i = 0; i < inputNumArray.length; i++) {
                    $(".pei_"+inputNumArray[i]).val(info[inputNumArray[i]]*1)
                }

                let possiblesTxt = ""
                for (var i = 0; i < data.possibles.length; i++) {
                    possiblesTxt += data.possibles[i].trim() + ";"
                }
                possiblesTxt = possiblesTxt.slice(0,-1);
                $('.pei_possibles').val(possiblesTxt);

                for (var i = 0; i < info.available.length; i++) {
                    if(info.available[i]){
                        $(".pei_available_cb").eq(i).addClass('cb_checked')
                        $(".pei_available").eq(i).addClass('pei_available_selected')
                    }else{
                        $(".pei_available_cb").eq(i).removeClass('cb_checked')
                        $(".pei_available").eq(i).removeClass('pei_available_selected')
                    }
                }
                let picktxt = ""
                for (var i = 0; i < info.pickup.length; i++) {
                    picktxt+='<div class="ov_hidden mt_20"><p class="pei_meeting_no">'+(i+1)+'.</p><input readonly spellcheck="false" class="dw_dropdown fl_left pe_mid pei_meeting pei_meeting_'+(i+1)+'" id="pei_meeting_'+(i+1)+'" dropitem="'+pickArray+'" value="'+info.pickup[i]+'"></div>'
                }
                $(".pei_pickupLocationZone").html(picktxt)

                for (var i = 0; i < info.language.length; i++) {
                    if(info.language[i]){
                        $(".pei_language_cb").eq(i).addClass('cb_checked')
                        $(".pei_language").eq(i).addClass('pei_language_selected')
                    }else{
                        $(".pei_language").eq(i).removeClass('pei_language_selected')
                        $(".pei_language_cb").eq(i).removeClass('cb_checked')
                    }
                }

                pd_edit.agency(data)
                pd_edit.price(data.price)
                pd_edit.option(data)
                pd_edit.cost(data.cost)

                $(".lightBox_shadow").removeClass("hidden");
                $(".pe").removeClass("hidden");
                $(".pe_tab").addClass("hidden");
                $(".pe_tab_info").removeClass("hidden");
                $(".pe_nav>p").removeClass("pe_nav--selected");
                $(".pe_nav_info").addClass("pe_nav--selected")
            })
        });
    }

    this.save = function(){

        let pkey = ""

        if(this.productKey === "new"){
            pkey = firebase.database().ref().push().key;
        }else{
            pkey = this.productKey;
        }

        pd_save.info(pkey);
        pd_save.agency(pkey);
        pd_save.price(pkey);
        pd_save.option(pkey);
        pd_save.cost(pkey);

        //$('.pe').addClass('hidden')
        //this.listing()
        //this.detail(pkey);
    }
}

function Product_save(){
    this.info = function(pkey){
        let product_info  = {
            area:"",
            category:"",
            status:"",
            language:[0,0,0,0,0,0,0,0,0,0,0,0],
            period:"",
            available:[0,0,0,0,0,0,0,0],
            description:"",
            deadline:0,
            pickup:[],
            cancellation:"",
            itinerary:"",
            include:"",
            exclude:"",
            others:"",
            id:"",
            name:""
        };

        for (var keys in product_info) {
            switch (keys) {
                case "language":
                    for (let i = 0; i < $(".pei_language_cb").length; i++) {
                        product_info.language[i] = $(".pei_language_cb").eq(i).hasClass("cb_checked");
                    }
                    break;

                case "available":
                    for (let i = 0; i < $(".pei_available_cb").length; i++) {
                            product_info.available[i] = $(".pei_available_cb").eq(i).hasClass("cb_checked");
                    }
                    break;

                case "pickup":

                    for (var i = 0; i < $(".pei_meeting").length; i++) {
                        product_info.pickup.push($(".pei_meeting").eq(i).val())
                    }

                    break;

                case "id":

                    product_info.id = $(".pei_area").val() + "_" + $(".pei_category").val() + "_" + $(".pei_name").val()

                    break;

                default:product_info[keys] = $('.pei_'+keys).val()

            }
        }

        let possibles = $(".pei_possibles").val().split(";");
        for (let i = 0; i < possibles.length; i++) {
            possibles[i] = possibles[i].trim();
        }

        firebase.database().ref("product/"+pkey+"/info").set(product_info);
        firebase.database().ref("product/"+pkey+"/possibles").set(possibles);

    }

    this.agency = function(pkey){ //product_save임

        let product_agency = {}

        for (var i = 0; i < $(".pea_title").length; i++) {
            let agencyName = $(".pea_title").eq(i).html();
            product_agency[agencyName] = $(".pea_"+agencyName).attr("rstat")
        }

        firebase.database().ref("product/"+pkey+"/agency").set(product_agency);
    }

    this.price = function(pkey){ //product_save임
        let product_price = {}

        for (let i = 0; i < ($(".pep_p_tab").length - 1); i++) { //마지막 탭은 close기 때문에 1을 빼줌
            let key = $(".pep_p_tab").eq(i).attr("tid");
            let reservationDate = $("."+key+"_reservation").val().split("-");
            let tourDate = $("."+key+"_tour").val().split("-");

            product_price[key] = {
                byAgencies:[],
                description:$(".pep_description_"+key).val(),
                forAll:false,
                reservationDate_from:reservationDate[0]+"-"+reservationDate[1]+"-"+reservationDate[2],
                reservationDate_to:reservationDate[3]+"-"+reservationDate[4]+"-"+reservationDate[5],
                title:$(".pep_title_"+key).val(),
                tourDate_from:tourDate[0]+"-"+tourDate[1]+"-"+tourDate[2],
                tourDate_to:tourDate[3]+"-"+tourDate[4]+"-"+tourDate[5]
            }

            for (let no = 0; no < $("."+key+"_byAgenciesBox>div").length; no++) {

                let age_adult = $("."+key+"_pei_price_age_adult_"+no).val().split("-");
                let age_kid = $("."+key+"_pei_price_age_kid_"+no).val().split("-");
                let age_infant = $("."+key+"_pei_price_age_infant_"+no).val().split("-");
                let agencyArray = [];
                for (let j = 0; j < $("."+key+"_pep_p_ag_box_agencies_"+no+">p").length; j++) {
                    agencyArray.push($("."+key+"_pep_p_ag_box_agencies_"+no+">p").eq(j).html())
                }

                product_price[key].byAgencies.push({
                    adultAge_min:age_adult[0].trim()*1,
                    adultAge_max:age_adult[1].trim()*1,
                    kidAge_min:age_kid[0].trim()*1,
                    kidAge_max:age_kid[1].trim()*1,
                    infantAge_min:age_infant[0].trim()*1,
                    infantAge_max:age_infant[1].trim()*1,
                    adult_gross:$("."+key+"_pei_price_gross_adult_"+no).val(),
                    kid_gross:$("."+key+"_pei_price_gross_kid_"+no).val(),
                    infant_gross:$("."+key+"_pei_price_gross_infant_"+no).val(),
                    adult_net:$("."+key+"_pei_price_net_adult_"+no).val(),
                    kid_net:$("."+key+"_pei_price_net_kid_"+no).val(),
                    infant_net:$("."+key+"_pei_price_net_infant_"+no).val(),
                    agency:agencyArray,
                    currency:$(".pep_currency_"+key+"_"+no).attr("rstat")
                })
            }
        }
        firebase.database().ref("product/"+pkey+"/price").set(product_price);
    }

    this.option = function(pkey){ //product_save임
        let optdata = [];

        for (let i = 0; i < $(".pep_p_op").length; i++) {
            let optname = $(".pep_p_op_name").eq(i).val()
            let optprice = $(".pep_p_op_price").eq(i).val()

            optdata.push({
                option:optname,
                price:optprice,
                possibles:[optname]
            })
        }

        firebase.database().ref("product/"+pkey+"/option").set(optdata);

    }

    this.cost = function(pkey){ //product_save임
        let data = []

        for (let i = 0; i < $(".pep_p_as").length; i++) {
            let itemData = {};
            let adultAge = $(".pei_age_adult_"+i).val().split("-")
            itemData.adultAge_max = adultAge[1].trim()*1;
            itemData.adultAge_min = adultAge[0].trim()*1;
            let youngAge = $(".pei_age_young_"+i).val().split("-")
            itemData.youngAge_max = youngAge[1].trim()*1;
            itemData.youngAge_min = youngAge[0].trim()*1;
            let kidAge = $(".pei_age_young_"+i).val().split("-")
            itemData.kidAge_max = kidAge[1].trim()*1;
            itemData.kidAge_min = kidAge[0].trim()*1;
            itemData.adult_cost = $(".pei_price_adult_"+i).val()*1;
            itemData.young_cost = $(".pei_price_young_"+i).val()*1;
            itemData.kid_cost = $(".pei_price_kid_"+i).val()*1;
            console.log($(".pep_p_as_title").eq(i).val())
            itemData.item = $(".pep_p_as_title").eq(i).val();
            itemData.free_cost = 0;
            itemData.pre = false;

            data.push(itemData)
            console.log(data)
        }

        firebase.database().ref("product/"+pkey+"/cost/item").set(data);


        let bus = [];
        for (let i = 0; i < $(".pep_p_bus").length; i++) {
            let busData = {};
            busData.name = $(".pep_p_bus_name").eq(i).val();
            busData.size = [];

            for (let j = 0; j < $(".pei_bus_"+i).length; j++) {
                let indata = {}
                let people = $(".pei_bus_"+i+"_people_"+j).val().split("-");
                indata.max = people[1].trim()*1;
                indata.min = people[0].trim()*1;
                indata.cost = $(".pei_bus_"+i+"_price_"+j).val();
                busData.size.push(indata)
            }
            let maxArray = []
            for (let no = 0; no < busData.size.length; no++) {
                maxArray.push(busData.size[no].max)
            }
            busData.max = Math.max.apply(null,maxArray)
            bus.push(busData)
        }

        firebase.database().ref("product/"+pkey+"/cost/bus").set(bus);

    }
}


function Product_edit(){
    this.agency = function(data){
        let agencyObj = data.agency

        firebase.database().ref("agency").once("value", snap => {
            let agency = snap.val();

            let agencyTxt = ""
            for (var key in agency) {

                let agencyName_total = agency[key].name

                agencyTxt+='<p class="pea_title">'+agencyName_total+'</p><div class="pea_agency pea_'+agencyName_total+'" rstat="';
                if(agencyObj && agencyObj[agencyName_total]){
                    agencyTxt+=agencyObj[agencyName_total]+'"><div class="dw_radio">Ongoing</div><div class="dw_radio">Screening</div><div class="dw_radio">Refused</div></div>'
                }else{
                    agencyTxt+='Screening"><div class="dw_radio">Ongoing</div><div class="dw_radio">Screening</div><div class="dw_radio">Refused</div></div>'
                }
            }

            $(".pe_tab_agency").html(agencyTxt)

            for (let key in agency) {
                let agencyName = agency[key].name
                let rstat = $(".pea_"+agencyName).attr("rstat").toLowerCase();
                if(rstat === "ongoing"){
                    $(".pea_"+agencyName).children('.dw_radio').eq(0).addClass("dw_radio_selected");
                }else if(rstat === "refused"){
                    $(".pea_"+agencyName).children('.dw_radio').eq(2).addClass("dw_radio_selected");
                }else{
                    $(".pea_"+agencyName).children('.dw_radio').eq(1).addClass("dw_radio_selected");
                }
            }
        })
    }

    this.price = function(data){ //product edit임

        let price = data

        let tabTxt = ""
        for (let priceCode in price) {
            let pdata = price[priceCode]

            tabTxt+='<input class="pep_p_tab pep_title_'+priceCode+'" tid="'+priceCode+'" spellcheck="false" value="'+pdata.title.toUpperCase()+'"/>'
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

        $(".pep_p_tab").eq(0).addClass("pep_p_tab--selected");

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
    }

    this.option = function(data){ //product edit임
        let optionTxt = ''
        if(data.option){
            for (var i = 0; i < data.option.length; i++) {
                let opt = data.option[i]
                optionTxt+='<div class="pep_p_op"><img class="pep_p_op_close" src="./assets/icon-close.svg"/><input class="pep_p_op_name" value="'+opt.option+'"/>'
                optionTxt+='<input class="pep_p_op_price" value="'+opt.price+'"/><p class="pep_p_op_currency">WON</p></div>'
            }
        }


        $(".pep_p_op_box").html(optionTxt)
    }

    this.cost = function(cost){ //product edit임
        let costTxt = '';
        if(cost.item){
            for (let i = 0; i < cost.item.length; i++) {
                costTxt +='<div class="pep_p_as"><input class="pep_p_as_title"/><table class="pep_p_as_price">'
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

    }
}


function removePriceGroup(cid){
    let address = cid.split("_")
    firebase.database().ref("product/"+$(".pe").attr("productname")+"/price/"+address[0]+"/byAgencies/"+address[1]).remove();
    product.edit($(".pe").attr("productname"));
}

$(document).on('focus',".pep_p_gen_reservation", function(){
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

function price_addTab(pname){

    let dataSet = {
        byAgencies:[{
            adultAge_max:0,
            adultAge_min:0,
            adult_gross:10000,
            adult_net:10000,
            agency:["not selected"],
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
        title:"new priceset"
    }

    let key = firebase.database().ref("product/"+pname+"/price").push().key;

    firebase.database().ref("product/"+pname+"/price/"+key).set(dataSet).then(function(){
        firebase.database().ref("product/"+pname+"/price").once("value", snap => {
            let data = snap.val();
            pd_edit.price(data)
            $(".pep_p").addClass("hidden");
            $("#"+key).removeClass("hidden")
        })
    })
}

function makePriceGroup(pid){
    let info = {
        adultAge_max:0,
        adultAge_min:0,
        adult_gross:10000,
        adult_net:10000,
        agency:["not selected"],
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

    firebase.database().ref("product/"+$(".pe").attr("productname")+"/price/"+pid+"/byAgencies").once("value", snap => {
        let data = snap.val();
        let i = data.length //배열의 요기에 저장될것
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
    })
}

function setAgencyPrice(pid){
    firebase.database().ref("product/"+$(".pe").attr("productname")).once("value", snap => {
        let data = snap.val();
        let agencyDB = [];

        for (let key in data.agency) {
            if(data.agency[key].toLowerCase() ==="ongoing"){
                agencyDB.push(key)
            }
        }

        let txt = ""

        data = data.price[pid].byAgencies

        for (let agency in agencyDB) {
            let agencyName = agencyDB[agency]

            txt+='<div class="pe_APC_agency" aid="'+agencyName+'"><p class="pe_APC_title">'+agencyName+'</p>'
            txt+='<div><input class="pe_APC_drop dw_dropdown" id="APC_'+agencyName+'" readonly dropitem="'
            for (let i = 0; i < $(".pep_pricegroup_"+pid).length; i++) {
                if(i===$(".pep_pricegroup_"+pid).length-1){
                    txt+='PRICE GROUP ' + i
                }else{
                    txt+='PRICE GROUP ' + i + ","
                }
            }
            for (let i = 0; i < $(".pep_pricegroup_"+pid).length; i++) {
                if(data[i].agency){
                    if(data[i].agency.indexOf(agencyName)>-1){
                        txt+='" value="PRICE GROUP '+i+'"/></div></div>'
                    }
                }
            }

        }

        $(".pe_APC_contents").html(txt)
        $(".insidePop").removeClass("hidden");
        $(".pe_APC").removeClass("hidden");

    })
}

function saveAgencyPrice(pid){

    firebase.database().ref("product/"+$(".pe").attr("productname")+"/price/"+pid+"/byAgencies").on("value", snap => {
        let data = snap.val();
        for (var i = 0; i < data.length; i++) {
            data[i].agency = []
        }

        for (let i = 0; i < $(".pe_APC_agency").length; i++) {
            let agencyName = $(".pe_APC_agency").eq(i).attr("aid");
            let priceGroup = $("#APC_"+agencyName).val().split(" ")
            priceGroup = priceGroup[2]*1
            data[priceGroup].agency.push(agencyName)

        }

        firebase.database().ref("product/"+$(".pe").attr("productname")+"/price/"+pid+"/byAgencies").set(data);

        for (let i = 0; i < data.length; i++) {

            $("."+pid+"_pep_p_ag_box_agencies_"+i).html("")

            if(data[i].agency){
                for (let j = 0; j < data[i].agency.length; j++) {
                    $("."+pid+"_pep_p_ag_box_agencies_"+i).append("<p>"+data[i].agency[j]+"</p>");
                }
            }
        }
        $(".insidePop").addClass("hidden");
        $(".pe_APC").addClass("hidden");
    })

    firebase.database().ref("product/"+$(".pe").attr("productname")+"/memo").set($(".pe_memo_txt").html());
}

function addOption(key){
    let optionTxt = ''

    optionTxt+='<div class="pep_p_op"><img class="pep_p_op_close" src="./assets/icon-close.svg"/><input class="pep_p_op_name" value="OPTION NAME"/>'
    optionTxt+='<input class="pep_p_op_price" value="0"/><p class="pep_p_op_currency">WON</p></div>'

    $(".pep_p_op_box").append(optionTxt)
}

function addAsset(pname){
    let costTxt = '';
    let i = $(".pep_p_as").length

    costTxt +='<div class="pep_p_as"><input class="pep_p_as_title" value="asset_name"/><table class="pep_p_as_price">'
    costTxt+='<tr><th></th><th>ADULT</th><th>TEEN</th><th>YOUNG</th><th>BABY</th></tr><tr><td>AGE</td>'
    costTxt+='<td><input class="pei_age_adult_'+i+'"/></td><td><input class="pei_age_young_'+i+'"/></td>'
    costTxt+='<td><input class="pei_age_kid_'+i+'"/></td><td><input class="pei_age_free_'+i+'"/></td>'
    costTxt+='</tr><tr><td>PRICE</td>'
    costTxt+='<td><input class="pei_price_adult_'+i+'"/></td><td><input class="pei_price_young_'+i+'"/></td>'
    costTxt+='<td><input class="pei_price_kid_'+i+'"/></td><td><input class="pei_price_free_'+i+'"/></td>'
    costTxt+='</tr></table></div>'

    $(".pep_p_as_box").append(costTxt)
}

function addBusCell(no){
    let number = $(".pei_bus_"+no).length - 1;
    if(number<4){
        let txt = '<tr class="pei_bus_'+no+'"><th><input class="pei_bus_'+no+'_people_'+(number+1)+'" value="0-0"/></th><th><input class="pei_bus_'+no+'_price_'+(number+1)+'" value="0"/></th></tr>'
        $(".pei_bus_"+no).eq(number).after(txt)
    }
}

function addBus(){
    let busTxt = '';

    let i = $(".pep_p_bus").length
    busTxt+='<div class="pep_p_bus"><input class="pep_p_bus_name" value="NEW BUS"><table class="pep_p_bus_price" border="1"><tr><th>PEOPLE</th><th>PRICE</th></tr>';

    for (let j = 0; j < 2; j++) {
        busTxt+='<tr class="pei_bus_'+i+'"><th><input class="pei_bus_'+i+'_people_'+j+'" value="0-0"/></th><th><input class="pei_bus_'+i+'_price_'+j+'" value="0"/></th></tr>'
    }
    busTxt+='<tr><th class="pep_p_bus_price_add"  colspan="2">+ ADD CELL</th></tr></table></div>'

    $(".pep_p_bus_box").append(busTxt)

}
