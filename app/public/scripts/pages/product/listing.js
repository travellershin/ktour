let agencyArray = []; //Agency Dropdown에 쓰일 Array
let cityArray = []; //City Dropdown에 쓰일 Array
let pickupObj = {}; //pickupPlace Dropdown에 쓰일 Array들이 모인 객체(도시별)

let filter = {} //어떤 필터가 있나
let filter_adjusted = { //사용자가 어떤 필터를 선택했나
    status:[],
    area:[],
    category:[]
}
let product_filtered = { //사용자가 선택한 필터에 맞는 product들 모음
    status:[],
    area:[],
    category:[]
}
let inflateArray = []; //필터링 완료된 product

let order = []; //정렬순서


$(".p_header").on("click",".drop_item",function(){ //드롭다운 하위 선택지(필터) 클릭
    set_filter($(this));
    return false;
})
$("body").click(function(){
    $(".p_header_drop").addClass("hidden")
})
$(".p_header_dropbtn").click(function(){
    let fname = $(this).parent().children("p").html().toLowerCase();
    console.log(fname)
    $("#drop_"+fname).toggleClass("hidden");
    return false;
})
$(".p_header_align").click(function(){
    order.push($(this).html().toLowerCase())
    console.log(order)
})



function set_filter(div){
    inflateArray = []
    product_filtered = { //사용자가 선택한 필터에 맞는 product들 모음 초기화
        status:[],
        area:[],
        category:[]
    }

    let kind = $(div).parent().attr("id").split("_")[1] //어떤 종류의 필터가 선택되었는가!
    $(div).toggleClass("drop_item--selected"); //필터를 선택한 상황인지 해제한 상황인지 체크
    if($(div).hasClass("drop_item--selected")){
        if(filter_adjusted[kind].length === filter[kind].length){ //모두 선택된 상태(=아무것도 선택 안 된 상태)에서 필터를 선택했다
            filter_adjusted[kind] = [$(div).html()]; //하나만 선택된 것으로
        }else{
            filter_adjusted[kind].push($(div).html()); //기존 선택되어 있던 필터들에 추가
        }
    }else{
        filter_adjusted[kind].splice(filter_adjusted[kind].indexOf($(div).html()),1); //기존 선택되어 있던 필터들에서 제거
    }
    for (let filters in filter_adjusted) {
        if(filter_adjusted[filters].length === 0){ //만약에 필터를 해제해서 선택된 것이 하나도 없게 된다면
            filter_adjusted[filters] = filter[filters]; //모두 다 선택한 것으로 간주함
        }
    }
    for (let filters in filter_adjusted) {
        for (let key in product) {
            if(filter_adjusted[filters].indexOf(product[key].info[filters])>-1){ //product 내의 필터 관련정보를 확인
                product_filtered[filters].push(key)  //각 필터에 맞게 넣음
            }
        }
    }

    for (let i = 0; i < product_filtered.area.length; i++) {
        if(product_filtered.status.indexOf(product_filtered.area[i])>-1&&product_filtered.category.indexOf(product_filtered.area[i])>-1){
            inflateArray.push(product_filtered.area[i])  //현재 선택된 필터에 맞게 보여줄 내용을 결정
        }
    }

    inflate_product(inflateArray);
}

let iArray = []

function inflate_product(pArray){
    pArray.sort();
    iArray = [];
    let txt = "";
    for (let i = 0; i < pArray.length; i++) {
        iArray.push(product[pArray[i]]);
    }
    for (let i = 0; i < order.length; i++) {

    }
    console.log(iArray)

    $(".p_set_list").html("<p class='bold fl_left'>"+pArray.length + "</p><p class='fl_left'>&nbsp;/ " + Object.keys(product).length + " Product</p>")
    for (let i = 0; i < pArray.length; i++) {
        let data = product[pArray[i]]
        let area = data.info.area;
        let category = data.info.category;
        let name = data.info.name;
        let inf_status = data.info.status;
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
        let agency_ongoing = 0;
        let agency_screening = 0;
        let agency_rejected = 0;
        for (let agency_status in data.agency) {
            if(data.agency[agency_status] === "Ongoing"){
                agency_ongoing++
            }else if(data.agency[agency_status] === "Screening"){
                agency_screening++
            }else if(data.agency[agency_status] === "Rejected"){
                agency_rejected++
            }
        }
        let agency_total = agency_ongoing + agency_screening + agency_rejected
        txt+= '<div class="pc" id="'+pArray[i]+'"><div class="pc_status"><div class="bgco_'+bgco+'">'+inf_status.toUpperCase()+'</div></div><p class="pc_area">'+area+'</p><p class="pc_category">'+category+'</p><p class="pc_product">'+name+'</p>'
        txt+= '<p class="pc_start">'+start+'</p><p class="pc_end">'+end+'</p><div class="pc_agency"><p>'+agency_total+'개</p><p class="font_grey">(진행'+agency_ongoing+' 심사'+agency_screening+' 거절'+agency_rejected+')</p></div>'
        if(data.info.memo){
            txt+= '<p title="'+data.info.memo+'" class="pc_memo">' + data.info.memo + '</p></div>'
        }else{
            txt+= '<p class="pc_memo">-</p></div>'
        }

    }
    $('.pc_box').html(txt)
}
