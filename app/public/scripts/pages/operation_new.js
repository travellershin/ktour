let operationData = {};
let opForInflate = {};
let date = ""
let isEditing = false;
let viewing = ""
let teamlist = []
let op_rev = []
let adjusted = {
    pickupPlace : [],
    nationality : [],
    agency : []
}
let o_order = {
    name:false, //false = 내림차순
    bus:false,
    people:false
}
let filteredRev = {
    pickupPlace : [],
    nationality : [],
    agency : [],
    total : []
}

$(".r_hbot_name").click(function(){
    sortByName();
})
$(".op_hbot_bus").click(function(){
    sortByBus();
})
$(".r_hbot_people").click(function(){
    sortByPeople()
})

$(".ri_footer_gmail").click(function(){
    window.open("https://mail.google.com/mail/u/0/#inbox/"+$(this).attr("id").split("-")[0])
})

$(document).on("click",".op_content_oCheck",function(){
    $(this).toggleClass("oCkeck--checked");
    let pid = $(".ol_title").html()
    let tid = $(this).parent().attr("tid")
    let id = $(this).parent().attr("id")
    if($(this).hasClass("oCkeck--checked")){
        firebase.database().ref("operation/"+date+"/"+pid+"/teams/"+tid+"/reservations/"+id+"/oCheck").set(true)
    }else{
        firebase.database().ref("operation/"+date+"/"+pid+"/teams/"+tid+"/reservations/"+id+"/oCheck").set(false)
    }
    return false
})
$(".ol").on("click",".rv_content_star",function(){
    $(this).parent().children(".rv_content_star").toggleClass("rv_content_star--on");
    let pid = $(".ol_title").html()
    let tid = $(this).parent().attr("tid")
    let id = $(this).parent().attr("id")
    if($(this).parent().children(".rv_content_star").hasClass("rv_content_star--on")){
        firebase.database().ref("operation/"+date+"/"+pid+"/teams/"+tid+"/reservations/"+id+"/star").set(true)
    }else{
        firebase.database().ref("operation/"+date+"/"+pid+"/teams/"+tid+"/reservations/"+id+"/star").set(false)
    }
    return false
})
$(document).on("click",".op_content_gCheck",function(){
    $(this).parent().children(".op_content_oCheck").toggleClass("oCkeck--checked");
    let pid = $(".ol_title").html()
    let tid = $(this).parent().attr("tid")
    let id = $(this).parent().attr("id")
    if($(this).parent().children(".op_content_oCheck").hasClass("oCkeck--checked")){
        firebase.database().ref("operation/"+date+"/"+pid+"/teams/"+tid+"/reservations/"+id+"/oCheck").set(true)
    }else{
        firebase.database().ref("operation/"+date+"/"+pid+"/teams/"+tid+"/reservations/"+id+"/oCheck").set(false)
    }
    return false
})

$(".ri_header_close").click(function(){
    $(".lightBox_shadow").addClass("hidden")
})
$(".lightBox_shadow").click(function(){
    if($(".re").hasClass("hidden")){
        $(".lightBox_shadow").addClass("hidden")
    }
})
$(".ri").click(function(event){
    event.stopPropagation();
})

$(document).on("click",".omp_team",function(){
    if($(".o_header_change").html() === "팀 이동"){
        teamPop($(this));//팀 상세정보 보기
    }else{
        selectTeamForMove($(this)); //팀 옮기기 위해 선택(teamArrange.js에 있음)
    }
})


$(document).on("click",".ol_bus_total",function(){
    filter_init();
    inflate_reservation(op_rev)
    $(".ol_bus_box").removeClass("ol_bus_box--selected")
    $(this).addClass("ol_bus_box--selected")
})
$(document).on("click",".ol_bus_team",function(){
    if($(this).hasClass("ol_bus_box--selected")){
        //버스정보 보기
        $(this).attr("pid",$(".ol_title").html())
        $(this).attr("busno",$(".ol_bus_team").index($(this))+1)
        editTeam($(this))
    }else{
        filter_init();
        inflate_reservation(teamlist[$(".ol_bus_team").index($(this))])
        $(".ol_bus_box").removeClass("ol_bus_box--selected")
        $(this).addClass("ol_bus_box--selected")
    }
})

$(".ri_header_close").click(function(){
    $(".lightBox_shadow").addClass("hidden")
})
$(".ol_busEdit_done").click(function(){
    isEditing = false;
    $(".ol_editBus").removeClass("hidden");
    $(".ol_unSelect").addClass("hidden");
    $(".ol_selectAll").addClass("hidden");
    $(".ol_busEdit").addClass("hidden")
    $(".rv_box").css("padding-bottom","200px")
    selectArray = []
})

$(".ol_editBus").click(function(){
    isEditing = true;
    $(this).addClass("hidden");
    $(".ol_unSelect").removeClass("hidden");
    $(".ol_selectAll").removeClass("hidden");
    $(".ol_busEdit").removeClass("hidden")
    $(".rv_box").css("padding-bottom","200px")
    selectArray = []
})

$(document).on("click",".rv_content",function(){
    if(isEditing){
        selectArray = []

        $(this).toggleClass("rev--selected");
        for (let i = 0; i < $(".rv_content").length; i++) {
            if($(".rv_content").eq(i).hasClass("rev--selected")){
                selectArray.push([$(".rv_content").eq(i).attr("tid"),$(".rv_content").eq(i).attr("id")])
            }
        }
        $(".ol_busEdit_number_txt").html(selectArray.length)
    }else{
        rev_detail($(".rv_content").index(this))
        $(".ri_footer_gmail").attr("id",$(this).attr("id"));
        $(".re_footer_save").attr("id",$(this).attr("id"));
    }
})







function teamPop(div){
    let tid = div.attr("tid");
    let pid = div.attr("pid");
    let teamObj = operationData[pid].teams[tid]
    let busno = operationData[pid].teamArgArray.indexOf(tid)
    $(".om_pop").css("left",event.pageX +10 + "px")
                .css("top",event.pageY -120 + "px");
    $(".om_pop").toggleClass("hidden");
    $(".om_pop_company").html(teamObj.bus_name);
    $(".om_pop_people").html(teamObj.people);
    $(".om_pop_cost").html(teamObj.bus_cost);
    $(".om_pop_message").html(teamObj.message);
    $(".om_pop_guide").html($(div).find(".omp_team_names_guide").html());
    $(".omp_edit").attr("tid",tid);
    $(".omp_edit").attr("pid",pid);
    $(".omp_edit").attr("busno",busno+1);

    let memotxt = ""
    if(teamObj.memo){
        for (let guidekey in teamObj.memo) {
            memotxt+=guideData[guidekey].name+" : " + teamObj.memo[guidekey] +"<br>"
        }
        memotxt = memotxt.slice(0,-4)
    }

    $(".om_pop_memofrom").html(memotxt)

}




function inflate_reservation(rev){
    console.log(rev)
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

let filter = {}

function filterOut_rev(rev){

    let filter_pickupPlace = new Set(); //필터 이름
    let filter_nationality = new Set(); //필터 이름
    let filter_agency = new Set(); //필터 이름

    for (let i = 0; i < rev.length; i++) {
        filter_pickupPlace.add(rev[i].pickupPlace)
        if(rev[i].nationality){
            filter_nationality.add(rev[i].nationality)
        }else{
            filter_nationality.add("Unknown")
        }
        filter_agency.add(rev[i].agency)
    }

    filter = {
        pickupPlace : Array.from(filter_pickupPlace),
        nationality : Array.from(filter_nationality) ,
        agency : Array.from(filter_agency)
    }
    dynamicDrop($("#r_filter_pickupPlace"),filter.pickupPlace);
    dynamicDrop($("#r_filter_nationality"),filter.nationality);
    dynamicDrop($("#r_filter_agency"),filter.agency);
}

function filter_set(div){
    filteredRev = {
        pickupPlace : [],
        nationality : [],
        agency : [],
        total : []
    }

    let kind = $(div).parent().attr("id").split("_")[3] //어떤 종류의 필터가 선택되었는가!
    $(div).toggleClass("drop_item--selected");
    if($(div).hasClass("drop_item--selected")){
        if(adjusted[kind].length === filter[kind].length){
            adjusted[kind] = [$(div).html()];
        }else{
            adjusted[kind].push($(div).html());
        }
    }else{
        adjusted[kind].splice(adjusted[kind].indexOf($(div).html()),1);
    }
    for (let filters in adjusted) {
        if(adjusted[filters].length === 0){
            adjusted[filters] = filter[filters];
        }
    }
    for (let filterName in adjusted) {
        for (let i = 0; i < op_rev.length; i++) {
            if(adjusted[filterName].indexOf(op_rev[i][filterName])>-1){
                filteredRev[filterName].push(op_rev[i])
            }
        }
    }

    for (let i = 0; i < filteredRev.pickupPlace.length; i++) {
        if(filteredRev.nationality.indexOf(filteredRev.pickupPlace[i])>-1&&filteredRev.agency.indexOf(filteredRev.pickupPlace[i])>-1){
            filteredRev.total.push(filteredRev.pickupPlace[i])
        }
    }

    inflate_reservation(filteredRev.total)
}



function filter_init(){
    $(".drop_item").removeClass("drop_item--selected")
    $(".dropbox").addClass("display_none");
    inflate_reservation(reservation);
    adjusted = {
        pickupPlace : [],
        nationality : [],
        agency : []
    }
}

function rev_detail(index){
    console.log(op_rev)
    console.log(index)
    let data = op_rev[index]
    console.log(data)
    for (var key in data) {
        if(data[key] == "N/A"){
            $('.rv_info_'+key).html("-");
            $('.rv_info_'+key).val("-");
        }else{
            $('.rv_info_'+key).html(data[key]);
            $('.rv_info_'+key).val(data[key]);
        }
    }
    console.log(data)
    if(data.agencyCode){$('.rv_info_agencyCode').html(data.agencyCode)}
    if(data.code){$('.rv_info_code').html(data.code)}
    if(data.agency){$('.rv_info_agency').html(data.agency)}

    if(data.adult === 0){ //db에 adult 항목이 비어있으면 people을 adult로 간주해 db에 넣음
        $('.rv_info_people').html(data.people+" (adult "+data.people+" / child 0)")
    }else{
        $('.rv_info_people').html(data.people+" (adult "+data.adult+" / child "+data.kid+")")
    }

    if(data.option){
        let txt = ""
        let edittxt = ""
        for (let i = 0; i < data.option.length; i++) {
            txt+=data.option[i].option+" : "
            txt+=data.option[i].people +"<br>"

            edittxt+='<div class="rec_co_option_box"><input class="rec_co_option_name" value="'+data.option[i].option+'" readonly>'
            edittxt+='<input type="number" value='+data.option[i].people+' class="rec_co_option_people" placeholder="people"/></div>'
        }
        txt = txt.slice(0,-4);
        $(".rv_info_option").html(txt)
        $(".rec_co_option").html(edittxt)
    }else{
        $(".rv_info_option").html("")
        $(".rec_co_option").html("")
    }

    //팝업창을 띄우고 높이를 조정
    $('.lightBox_shadow').removeClass('hidden');
    $('.ric_name').height($('.rv_info_clientName').height())
    $('.ric_product').height($('.rv_info_product').height())
    $('.ric_option').height($('.rv_info_option').height())
    $('.ric_pick').height($('.rv_info_pickupPlace').height())
    $('.rv_info_memo').width($('.ric').width())
}


function sortByName(){
    if(o_order.name){
        o_order.name = false;
        op_rev.sort(function(a, b) {
            return a.clientName.toLowerCase().trim() < b.clientName.toLowerCase().trim() ? 1 : a.clientName.toLowerCase().trim() > b.clientName.toLowerCase().trim() ? -1 : 0;
        });
    }else{
        o_order.name = true;
        op_rev.sort(function(a, b) {
            return a.clientName.toLowerCase().trim() < b.clientName.toLowerCase().trim() ? -1 : a.clientName.toLowerCase().trim() > b.clientName.toLowerCase().trim() ? 1 : 0;
        });
    }

    inflate_reservation(op_rev);
}

function sortByBus(){
    if(o_order.bus){
        o_order.bus = false;
        op_rev.sort(function(a, b) {
            return a.busNumber < b.busNumber ? 1 : a.busNumber > b.busNumber ? -1 : 0;
        });
    }else{
        o_order.bus = true;
        op_rev.sort(function(a, b) {
            return a.busNumber < b.busNumber ? -1 : a.busNumber > b.busNumber ? 1 : 0;
        });
    }
    inflate_reservation(op_rev);
}

function sortByPeople(){
    if(o_order.people){
        o_order.people = false;
        op_rev.sort(function(a, b) {
            return a.people < b.people ? 1 : a.people > b.people ? -1 : 0;
        });
    }else{
        o_order.people = true;
        op_rev.sort(function(a, b) {
            return a.people < b.people ? -1 : a.people > b.people ? 1 : 0;
        });
    }
    inflate_reservation(op_rev);
}
