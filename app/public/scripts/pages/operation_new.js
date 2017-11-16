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
let r_obj = {}

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

$(document).on("click",".omp_team",function(){
    if($(".o_header_change").html() === "팀 이동"){
        teamPop($(this));//팀 상세정보 보기
    }else{
        selectTeamForMove($(this)); //팀 옮기기 위해 선택(teamArrange.js에 있음)
    }

})

$(document).on("click", ".obe_header_close",function(){
    $(".pop_blackScreen").addClass("hidden");
    $(".obe").addClass("hidden");
})
$(document).on("click",".drop_item",function(){
    if($(this).attr("did") === "op_bus_company"){
        changeBusCompany($(this).html())
    }
    if($(this).attr("did").slice(0,-1) === "op_guide"){
        let length = $(".obe_body_guide>input").length;
        let selectedNo = $(this).attr("did").charAt($(this).attr("did").length-1)*1+1
        let guidenameArray = []
        guidenameArray.push("Unassigned")
        for (let guidekey in guidedata) {
            guidenameArray.push(guidedata[guidekey].name)
        }
        if(length ===selectedNo){
            $(".obe_body_guide").append('<input class="obe_body_input dw_dropdown" id="op_guide'+length+'" value="Unassigned" readonly dropitem="'+guidenameArray.toString()+'"/>')
        }
    }
    if($(this).attr("did").split("_")[0] === "r"){
        filter_set($(this))
        $(".ol_bus_box").removeClass("ol_bus_box--selected")
        $(".ol_bus_total").addClass("ol_bus_box--selected")
    }
})
$(document).on("click",".omp_list",function(){
    showList($(this).attr("pid"));
    $(".ol_bus_total").addClass("ol_bus_box--selected");
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
$(".ol_return").click(function(){
    $(this).addClass("hidden");
    $(".ol").addClass("hidden");
    $(".om").removeClass("hidden");
    $(".ol_busEdit").addClass("hidden");
    $(".ol_unSelect").addClass("hidden");
    $(".ol_selectAll").addClass("hidden");
    $(".ol_editBus").removeClass("hidden");
    $(".o_header_date").removeClass("hidden");
    $(".o_header_quick").removeClass("hidden");
    isEditing = false;
    viewing = ""
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

$(document).on("click",".ol_busEdit_bus",function(){
    let target_team = $(this).attr("tid") // 선택된(옮겨질) team id
    let s_product = $(".ol_title").html(); // 프로덕트명
    let reservationData = {}
    for (let i = 0; i < selectArray.length; i++) {
        let s_team = selectArray[i][0];  //원 소속 팀
        let s_rev = selectArray[i][1];  //reservation id

        reservationData = operationData[date][s_product].teams[s_team].reservations[s_rev] //복사해둠
        delete operationData[date][s_product].teams[s_team].reservations[s_rev] // 지움
        if(operationData[date][s_product].teams[target_team].reservations){
            operationData[date][s_product].teams[target_team].reservations[s_rev] = reservationData //붙여넣기
        }else{
            operationData[date][s_product].teams[target_team].reservations = {};
            operationData[date][s_product].teams[target_team].reservations[s_rev] = reservationData;
        }
    }
    toast("예약을 이동했습니다")
    firebase.database().ref("operation/"+date+"/"+s_product).set(operationData[date][s_product])
    showList(s_product)
})

$(".ol_busEdit_done").click(function(){
    let dataset = operationData[date][$(".ol_title").html()]
    for (let team in dataset.teams) {
        if(dataset.teams[team].people === 0){
            delete operationData[date][$(".ol_title").html()].teams[team];
            operationData[date][$(".ol_title").html()].teamArgArray.splice(operationData[date][$(".ol_title").html()].teamArgArray.indexOf(team),1)
        }
    }
    firebase.database().ref("operation/"+date+"/"+$(".ol_title").html()).set(operationData[date][$(".ol_title").html()])
    showList($(".ol_title").html())
})

$(document).on("click",".ol_bus_add",function(){
    let date = new Date();
    date = date.getTime()
    addbus();

})





function teamPop(div){
    let tid = div.attr("tid");
    let pid = div.attr("pid");
    let teamObj = operationData[date][pid].teams[tid]
    let busno = operationData[date][pid].teamArgArray.indexOf(tid)
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
            memotxt+=guidedata[guidekey].name+" : " + teamObj.memo[guidekey] +"<br>"
        }
        memotxt = memotxt.slice(0,-4)
    }

    $(".om_pop_memofrom").html(memotxt)

}


function changeBusCompany(busname){
    let pid = $(".omp_edit").attr("pid");
    firebase.database().ref("product").orderByChild("id").equalTo(pid).on("value",snap => {
        let data = snap.val();
        let productdata = {}
        for (let key in data) {
            productdata = data[key]
        }
        let bussizeno = 0;
        let busnameArray = [];
        let bussizeArray = [];
        for (let i = 0; i < productdata.cost.bus.length; i++) {
            if(busname === productdata.cost.bus[i].name){
                bussizeno = i
            }
        }
        let ditemtxt = ""
        for (let i = 0; i < productdata.cost.bus[bussizeno].size.length; i++) {
            bussizeArray.push(productdata.cost.bus[bussizeno].size[i].max + "인승(" + productdata.cost.bus[bussizeno].size[i].cost+"원)")
            ditemtxt+='<p class="drop_item" did="op_bus_size">'+productdata.cost.bus[bussizeno].size[i].max + '인승(' + productdata.cost.bus[bussizeno].size[i].cost+'원)<p>'
        }


        $("#op_bus_size").attr("dropitem",bussizeArray.toString());
        $("#drop_op_bus_size").html(ditemtxt)
    })
}



function init_op_datepicker(){
    for (let i = 0; i < $('.o_header_quick>p').length; i++) {

        let index = $('.o_header_quick>p').eq(i).attr("id").split("_")[2]
        if(index.length === 1){
            $('.o_header_quick>p').eq(i).html(datestring.add(index*1).split("-")[2])
        }else if(index === "today"){
            $('.o_header_quick>p').eq(i).html(datestring.today().split("-")[1]+"/"+datestring.today().split("-")[2])
        }else if(index === "yesterday"){
            $('.o_header_quick>p').eq(i).html(datestring.yesterday().split("-")[2])
        }else{
            $('.o_header_quick>p').eq(i).html(datestring.tomorrow().split("-")[2])
        }
    }
    $(".o_header_quick").removeClass("hidden")

    $('.o_header_date_txt').daterangepicker({
        "autoApply": true,
        singleDatePicker: true,
        locale: { format: 'YYYY-MM-DD'}
    },function(start,end,label){
        date = start.format('YYYY-MM-DD');
        getOperationData(start.format('YYYY-MM-DD'));
        $(".o_header_quick>p").removeClass("drp_quick--selected");
        if(start.format('YYYY-MM-DD') === datestring.today()){
            $(".o_header_quick_today").addClass("drp_quick--selected")
        };
        if(start.format('YYYY-MM-DD') === datestring.yesterday()){
            $(".o_header_quick_yesterday").addClass("drp_quick--selected")
        }
        if(start.format('YYYY-MM-DD') === datestring.tomorrow()){
            $(".o_header_quick_tomorrow").addClass("drp_quick--selected")
        }
        if(start.format('YYYY-MM-DD')===datestring.add(2)){
            $('#drp_quick_2').addClass('drp_quick--selected')
        }
        if(start.format('YYYY-MM-DD')===datestring.add(3)){
            $('#drp_quick_3').addClass('drp_quick--selected')
        }
        if(start.format('YYYY-MM-DD')===datestring.add(4)){
            $('#drp_quick_4').addClass('drp_quick--selected')
        }
        if(start.format('YYYY-MM-DD')===datestring.add(5)){
            $('#drp_quick_5').addClass('drp_quick--selected')
        }
        if(start.format('YYYY-MM-DD')===datestring.add(6)){
            $('#drp_quick_6').addClass('drp_quick--selected')
        }
        if(start.format('YYYY-MM-DD')===datestring.add(7)){
            $('#drp_quick_7').addClass('drp_quick--selected')
        }
        if(start.format('YYYY-MM-DD')===datestring.add(8)){
            $('#drp_quick_8').addClass('drp_quick--selected')
        }
        if(start.format('YYYY-MM-DD')===datestring.add(9)){
            $('#drp_quick_9').addClass('drp_quick--selected')
        }


        firebase.database().ref("reservation").off("value")
        firebase.database().ref("reservation").orderByChild("date").equalTo(date).on("value",snap => {
            reservation[date] = snap.val();
        })
    })
}

function showList(pid){
    $(".om").addClass("hidden");
    $(".ol_return").removeClass("hidden")
    $(".ol").removeClass("hidden")
    $(".ol_title").html(pid)
    $(".o_header_date").addClass("hidden");
    $(".o_header_quick").addClass("hidden");
    viewing = pid;

    let data = operationData[date][pid]
    let bustxt = "";
    let busEditTxt = "";

    teamlist = []
    op_rev = []

    bustxt+='<div class="ol_bus_total ol_bus_box"><p class="ol_bus_total_txt">TOTAL</p><p class="ol_bus_total_number">'+data.people+'</p></div>'

    for (let i = 0; i < data.teamArgArray.length; i++) {
        busEditTxt += '<p class="ol_busEdit_bus" tid="'+data.teamArgArray[i]+'">BUS '+(i+1)+'</p>'

        for (let revkey in data.teams[data.teamArgArray[i]].reservations) {
            let reservation_data = data.teams[data.teamArgArray[i]].reservations[revkey];
            reservation_data.team = data.teamArgArray[i];
            reservation_data.busNumber = i+1;

            if(data.teams[data.teamArgArray[i]].reservations[revkey].nationality){
                reservation_data.nationality = data.teams[data.teamArgArray[i]].reservations[revkey].nationality
            }else{
                reservation_data.nationality = "Unknown"
            }
            r_obj[revkey] = reservation_data
            op_rev.push(reservation_data)

            if(teamlist[i]){
                teamlist[i].push(reservation_data)
            }else{
                teamlist[i] = [reservation_data]
            }
        }

        bustxt+='<div class="ol_bus_team ol_bus_box" tid="'+data.teamArgArray[i]+'"><div class="ol_bus_team_left"><p class="ol_bus_team_busno">BUS '+(i+1)+'</p>'
        if(data.teams[data.teamArgArray[i]].guide){
            console.log(data.teams[data.teamArgArray[i]].guide)
            bustxt+='<p class="ol_bus_team_guide" title="'
            for (let j = 0; j < data.teams[data.teamArgArray[i]].guide.length; j++) {
                bustxt+=guidedata[data.teams[data.teamArgArray[i]].guide[j]].name + ", "
            }
            bustxt = bustxt.slice(0,-2) +'">'
            for (let j = 0; j < data.teams[data.teamArgArray[i]].guide.length; j++) {
                bustxt+=guidedata[data.teams[data.teamArgArray[i]].guide[j]].name + ", "
            }
            bustxt = bustxt.slice(0,-2) +'</p></div>'
        }else{
            bustxt+='<p class="ol_bus_team_guide">Unassigned</p></div>'
        }
        bustxt+='<p class="ol_bus_team_number">'+data.teams[data.teamArgArray[i]].people+"/"+data.teams[data.teamArgArray[i]].bus_size+'</p></div>'
    }

    $(".ol_busEdit_busbox_box").html(busEditTxt)

    bustxt+='<div class="ol_bus_add ol_bus_box"><img src="./assets/icon-add.svg"/><p>ADD NEW BUS</p></div>'
    $(".ol_bus").html(bustxt)

    filterOut_rev(op_rev);
    inflate_reservation(op_rev);
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
        domTxt += rev[i].people+' ('+rev[i].adult+'/'+rev[i].kid+')' +'</p><p class="rv_content_option">'
        //옵션여부를 검사하는 곳
        domTxt += 'OPTION' +'</p><p class="rv_content_name" title="'
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
    let filteredRev = {
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

function addbus(){
    $(".pop_blackScreen").removeClass("hidden");
    $(".obe").removeClass("hidden");
    $(".obe_header_title").html($(".ol_title").html().split("_")[2])

    let pid = $(".ol_title").html();
    let tid = firebase.database().ref("operation/"+date+"/"+pid+"/teams").push().key;
    let time = new Date();
    time = time.getTime()
    $(".omp_edit").attr("pid",pid);


    let teamdata = {};
    firebase.database().ref("product").orderByChild("id").equalTo(pid).on("value",snap => {
        let data = snap.val();
        let productdata = {}
        for (let key in data) {
            productdata = data[key]
        }
        let busno = $(".ol_bus_team").length + 1
        let busnameArray = []
        let bussizeno = 0;
        for (let i = 0; i < productdata.cost.bus.length; i++) {
            busnameArray.push(productdata.cost.bus[i].name);
            if($("#op_bus_company").val() === productdata.cost.bus[i].name){
                bussizeno = i
            }
        }
        let bussizeArray = []
        for (let i = 0; i < productdata.cost.bus[bussizeno].size.length; i++) {
            bussizeArray.push(productdata.cost.bus[bussizeno].size[i].max + "인승(" + productdata.cost.bus[bussizeno].size[i].cost+"원)")
        }
        $(".obe_footer_save").attr("tid",tid);
        $(".obe_footer_save").attr("pid",pid);
        $("#op_bus_company").attr("dropitem",busnameArray.toString())
        $("#op_bus_size").attr("dropitem",bussizeArray.toString())
        $(".pop_blackScreen").removeClass("hidden");
        $(".obe").removeClass("hidden");
        $(".obe_header_title").html([pid.split("_")[2]]+" "+busno);
        $("#op_bus_company").val("Not Selected Yet");
        $("#op_bus_size").val("Not Selected Yet")
        $("#op_guide").val("Unassigned");
        $("#op_message").val(teamdata.message);
        let guidenameArray = []
        guidenameArray.push("Unassigned")
        for (let guidekey in guidedata) {
            guidenameArray.push(guidedata[guidekey].name)
        }
        op_revdata = {}
        let guidetxt = '<input class="obe_body_input dw_dropdown op_guide0" value="Unassigned" id="op_guide0" readonly/>'
        $("#op_guide").val("Unassigned");
        $(".obe_body_guide").html(guidetxt);

        $(".obe_body_guide>input").attr("dropitem",guidenameArray.toString())

        showList(pid);
    });
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

    //팝업창을 띄우고 높이를 조정
    $('.lightBox_shadow').removeClass('hidden');
    $('.ric_name').height($('.rv_info_clientName').height())
    $('.ric_product').height($('.rv_info_product').height())
    $('.ric_option').height($('.rv_info_option').height())
    $('.ric_pick').height($('.rv_info_pickupPlace').height())
    $('.rv_info_memo').width($('.ric').width())
}

$(".o_header_quick>p").click(function(){
    o_quick($(this).attr("id"))
    $(".o_header_quick>p").removeClass("drp_quick--selected");
    $(this).addClass("drp_quick--selected")
})

$(".o_header_quick_yesterday").click(function(){
    date = datestring.yesterday();
    $(".drp_quick>p").removeClass("drp_quick--selected");
    $(this).addClass("drp_quick--selected")
    $(".o_header_date_txt").data('daterangepicker').setStartDate(date);
    $(".o_header_date_txt").data('daterangepicker').setEndDate(date);
    $(".o_header_date_txt").val(date)
    getOperationData(date);
})
$(".o_header_quick_today").click(function(){
    date = datestring.today();
    $(".drp_quick>p").removeClass("drp_quick--selected");
    $(this).addClass("drp_quick--selected")
    $(".o_header_date_txt").data('daterangepicker').setStartDate(date);
    $(".o_header_date_txt").data('daterangepicker').setEndDate(date);
    $(".o_header_date_txt").val(date)
    getOperationData(date);
})
$(".o_header_quick_tomorrow").click(function(){
    date = datestring.tomorrow();
    $(".drp_quick>p").removeClass("drp_quick--selected");
    $(this).addClass("drp_quick--selected")
    $(".o_header_date_txt").data('daterangepicker').setStartDate(date);
    $(".o_header_date_txt").data('daterangepicker').setEndDate(date);
    $(".o_header_date_txt").val(date)
    getOperationData(date);
})

function o_quick(index){
    if(index.split("_")[2].length === 1){
        let no = index.split("_")[2]*1
        $(".o_header_date_txt").val(datestring.add(no))
        date = datestring.add(no);
        $(".o_header_date_txt").data('daterangepicker').setStartDate(datestring.add(no));
        $(".o_header_date_txt").data('daterangepicker').setEndDate(datestring.add(no));
    }

    getOperationData(date);
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
