let operationData = {};
let opForInflate = {};
let date = ""
let guidedata = {};
let isEditing = false;
let reservation = {}
let viewing = ""
let teamlist = []
let op_rev = []

$(document).ready(function(){
    init_op_datepicker();
    getOperationData(datestring.today())
    firebase.database().ref("guide").on("value",snap => {
        guidedata = snap.val();
    })
    firebase.database().ref("reservation").orderByChild("date").equalTo(datestring.today()).on("value",snap => {
        reservation[datestring.today()] = snap.val();
        console.log(reservation)
    })
})

$(document).on("click",".omp_team",function(){ //팀 상세정보 보기
    teamPop($(this));
})
$(".omp_edit").click(function(){
    editTeam($(this));
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
$(document).on("click",".obe_footer_save",function(){
    saveTeam($(this));
})
$(document).on("click",".omp_list",function(){
    showList($(this).attr("pid"));
    $(".ol_bus_total").addClass("ol_bus_box--selected");
})
$(document).on("click",".ol_bus_total",function(){
    filter_init();
    inflate_reservation(op_rev)
    console.log(op_rev)
    $(".ol_bus_box").removeClass("ol_bus_box--selected")
    $(this).addClass("ol_bus_box--selected")
})
$(document).on("click",".ol_bus_team",function(){
    filter_init();
    inflate_reservation(teamlist[$(".ol_bus_team").index($(this))])
    $(".ol_bus_box").removeClass("ol_bus_box--selected")
    $(this).addClass("ol_bus_box--selected")
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
$(".o_header_quick_yesterday").click(function(){
    date = datestring.yesterday();
    quickSelectOpdata($(this));
})
$(".o_header_quick_today").click(function(){
    date = datestring.today();
    quickSelectOpdata($(this));
})
$(".o_header_quick_tomorrow").click(function(){
    date = datestring.tomorrow();
    quickSelectOpdata($(this));
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
    console.log(date)
    addbus();

})


function getOperationData(date){
    if(operationData[date]){
        inflate_data()
    }else{
        firebase.database().ref("operation/"+date).on("value",snap => {
            operationData[date] = snap.val();

            if(operationData){
                inflate_data();
            }else{
                $(".om").html("해당일 예약은 아직 잡히지 않았습니다.")
            }
        });
    }
}

function inflate_data(){
    for (let product in operationData[date]) {

        let productPeople = 0
        operationData[date][product].teamArgArray = []
        for (let team in operationData[date][product].teams) {

            operationData[date][product].teamArgArray.push({name:team,time:operationData[date][product].teams[team].time})
            //전체 상품, 팀의 인원을 합산한다.
            let teamPeople = 0
            for (let reservation in operationData[date][product].teams[team].reservations) {
                teamPeople+=operationData[date][product].teams[team].reservations[reservation].people
                productPeople+=operationData[date][product].teams[team].reservations[reservation].people
            }
            operationData[date][product].teams[team].people = teamPeople
        }

        operationData[date][product].teamArgArray.sort(function(a, b) {
            return a.time - b.time;
        });
        for (let i = 0; i < operationData[date][product].teamArgArray.length; i++) {
            operationData[date][product].teamArgArray[i] = operationData[date][product].teamArgArray[i].name
        }
        operationData[date][product].people = productPeople

    }

    let txt = ""

    for (let product in operationData[date]) {
        let domdata = operationData[date][product]

        txt+='<div class="om_box_pd" pid="'+product+'"><p class="omp_name">'+product.split("_")[2]+'</p>'
        txt+='<div class="omp_people"><p class="omp_people_txt">PEOPLE</p><p class="omp_people_number">'+domdata.people+'</p></div>'
        txt+='<div class="omp_bus"><p class="omp_bus_txt">BUS</p><p class="omp_bus_number">'+Object.keys(domdata.teams).length+'</p></div>'

            for (let i = 0; i < operationData[date][product].teamArgArray.length; i++) {
                let tid = operationData[date][product].teamArgArray[i]

                txt+='<div class="omp_team" pid="'+product+'" tid="'+tid+'"><div class="omp_team_names"><p class="omp_team_names_bus">BUS '+(i+1)+'</p>'
                if(domdata.teams[tid].guide){
                    txt+='<p class="omp_team_names_guide">'+domdata.teams[tid].guide.toString()+'</p></div>'
                }else{
                    txt+='<p class="omp_team_names_guide">Unassigned</p></div>'
                }

                txt+='<p class="omp_team_people">'+domdata.teams[tid].people+'</p></div>'

            }

        txt+='<div class="omp_list" pid="'+product+'"><img src="./assets/icon-list.svg"/><p>VIEW LIST</p></div></div>'
    }

    $(".om").html(txt)
    for (let product in operationData[date]) {
        firebase.database().ref("operation/"+date+"/"+product+"/people").set(operationData[date][product].people);
        for (let team in operationData[date][product].teams) {
            firebase.database().ref("operation/"+date+"/"+product+"/teams/"+team+"/people").set(operationData[date][product].teams[team].people);
        }
    }

    if(viewing.length>0){
        showList(viewing)
    }
}

function teamPop(div){
    let tid = div.attr("tid");
    let pid = div.parent().attr("pid");
    let teamObj = operationData[date][pid].teams[tid]
    let busno = operationData[date][pid].teamArgArray.indexOf(tid)
    $(".om_pop").css("left",event.pageX +10 + "px")
                .css("top",event.pageY -120 + "px");
    $(".om_pop").toggleClass("hidden");

    $(".om_pop_company").html(teamObj.bus_name);
    $(".om_pop_people").html(teamObj.people);
    $(".om_pop_cost").html(teamObj.bus_cost);
    $(".om_pop_message").html(teamObj.message);
    if(teamObj.guide){
        $(".om_pop_guide").html(teamObj.guide.toString());
    }else{
        $(".om_pop_guide").html("Unassigned");
    }
    $(".omp_edit").attr("tid",tid);
    $(".omp_edit").attr("pid",pid);
    $(".omp_edit").attr("busno",busno);
}


function editTeam(div){
    $(".dw_dropdown").removeClass("drop_appended")
    let tid = div.attr("tid");
    let pid = div.attr("pid");
    let busno = div.attr("busno");
    let teamdata = operationData[date][pid].teams[tid];
    firebase.database().ref("product").orderByChild("id").equalTo(pid).on("value",snap => {
        let data = snap.val();
        let productdata = {}
        for (let key in data) {
            productdata = data[key]
        }
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
        $("#op_bus_company").attr("dropitem",busnameArray.toString())
        $("#op_bus_size").attr("dropitem",bussizeArray.toString())
        $(".om_pop").addClass("hidden")
        $(".pop_blackScreen").removeClass("hidden");
        $(".obe").removeClass("hidden");
        $(".obe_footer_save").attr("tid",tid);
        $(".obe_footer_save").attr("pid",pid);
        $(".obe_header_title").html([pid.split("_")[2]]+" "+busno);
        $("#op_bus_company").val(teamdata.bus_name);
        if(teamdata.bus_size){
            $("#op_bus_size").val(teamdata.bus_size + "인승(" + teamdata.bus_cost + "원)");
        }else{
            $("#op_bus_size").val("Unknown Bus Size")
        }
        let guidetxt = "";
        if(teamdata.guide){
            let guidenumber = 0
            for (let i = 0; i < teamdata.guide.length; i++) {
                guidetxt+='<input class="obe_body_input dw_dropdown op_guide'+i+'" value="'+teamdata.guide[i]+'" id="op_guide'+i+'" readonly/>'
                guidenumber++
            }
            guidetxt+='<input class="obe_body_input dw_dropdown op_guide'+(guidenumber)+'" value="Unassigned" id="op_guide'+(guidenumber)+'" readonly/>'

        }else{
            guidetxt+='<input class="obe_body_input dw_dropdown op_guide0" value="Unassigned" id="op_guide0" readonly/>'
            $("#op_guide").val("Unassigned");
        }
        $(".obe_body_guide").html(guidetxt);

        $("#op_message").val(teamdata.message);
        let guidenameArray = []
        guidenameArray.push("Unassigned")
        for (let guidekey in guidedata) {
            guidenameArray.push(guidedata[guidekey].name)
        }
        op_revdata = teamdata.reservations

        $(".obe_body_guide>input").attr("dropitem",guidenameArray.toString())

    })
}

function changeBusCompany(busname){
    let pid = $(".omp_edit").attr("pid");
    console.log(pid)
    firebase.database().ref("product").orderByChild("id").equalTo(pid).on("value",snap => {
        let data = snap.val();
        let productdata = {}
        for (let key in data) {
            productdata = data[key]
        }
        console.log(productdata)
        let bussizeno = 0;
        let busnameArray = [];
        let bussizeArray = [];
        for (let i = 0; i < productdata.cost.bus.length; i++) {
            if(busname === productdata.cost.bus[i].name){
                console.log(busname + "얍얍")
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

function saveTeam(div){
    let tid = div.attr("tid");
    let pid = div.attr("pid");
    let busname = $("#op_bus_company").val();
    let bussize = $("#op_bus_size").val().split("인승(")[0]*1;
    let buscost = $("#op_bus_size").val().split("인승(")[1].slice(0,-2)*1;
    let guidef = [];
    for (var i = 0; i < $(".obe_body_guide>input").length; i++) {
        if($(".obe_body_guide>input").eq(i).val() !== "Unassigned"){
            guidef.push($(".obe_body_guide>input").eq(i).val())
        }
    }
    let messagef = $("#op_message").val()
    opteamdata = {
        bus_name:busname,
        bus_size:bussize,
        bus_cost:buscost,
        guide:guidef,
        message:messagef,
        reservations:op_revdata
    }
    firebase.database().ref("operation/"+date+"/"+pid+"/teams/"+tid).set(opteamdata)
    $(".pop_blackScreen").addClass("hidden");
    $(".obe").addClass("hidden");
}

function init_op_datepicker(){
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
        firebase.database().ref("reservation").orderByChild("date").equalTo(date).on("value",snap => {
            reservation[date] = snap.val();
            console.log(reservation)
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
    console.log(operationData)

    for (let i = 0; i < data.teamArgArray.length; i++) {
        busEditTxt += '<p class="ol_busEdit_bus" tid="'+data.teamArgArray[i]+'">BUS '+(i+1)+'</p>'
        console.log(data.teams[data.teamArgArray[i]].reservations)

        for (let revkey in data.teams[data.teamArgArray[i]].reservations) {

            console.log(data.teams[data.teamArgArray[i]].reservations[revkey])

            let reservation_data = {
                id:revkey,
                pickupPlace:data.teams[data.teamArgArray[i]].reservations[revkey].pickupPlace,
                people:data.teams[data.teamArgArray[i]].reservations[revkey].people,
                option:data.teams[data.teamArgArray[i]].reservations[revkey].option,
                clientName:data.teams[data.teamArgArray[i]].reservations[revkey].clientName,
                nationality:"",
                agency:data.teams[data.teamArgArray[i]].reservations[revkey].agency,
                busNumber:(i+1),
                memo:data.teams[data.teamArgArray[i]].reservations[revkey].memo,
                team:data.teamArgArray[i]
            }
            if(data.teams[data.teamArgArray[i]].reservations[revkey].nationality){
                reservation_data.nationality = data.teams[data.teamArgArray[i]].reservations[revkey].nationality
            }else{
                reservation_data.nationality = "Unknown"
            }

            op_rev.push(reservation_data)

            if(teamlist[i]){
                teamlist[i].push(reservation_data)
            }else{
                teamlist[i] = [reservation_data]
            }
        }

        bustxt+='<div class="ol_bus_team ol_bus_box" tid="'+data.teamArgArray[i]+'"><div class="ol_bus_team_left"><p class="ol_bus_team_busno">BUS '+(i+1)+'</p>'
        if(data.teams[data.teamArgArray[i]].guide){
            bustxt+='<p class="ol_bus_team_guide" title="'+data.teams[data.teamArgArray[i]].guide.toString()+'">'+data.teams[data.teamArgArray[i]].guide.toString()+'</p></div>'
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
    let domTxt = ""
    console.log(rev)
    for (let i = 0; i < rev.length; i++) {
        domTxt += '<div class="rv_content" tid="'+rev[i].team+'" id="'+rev[i].id+'"><img class="rv_content_star" src="./assets/icon-star-off.svg"/>'
        domTxt += '<p class="op_content_bus">'+rev[i].busNumber+'</p><p class="rv_content_date">';
        domTxt += '<p class="op_content_memo">'+rev[i].memo+'</p><p class="rv_content_pickup">';
        domTxt += rev[i].pickupPlace + '</p><p class="rv_content_people">';
        domTxt += rev[i].people +'</p><p class="rv_content_option">'
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
    console.log(filter)
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
        for (let i = 0; i < reservation.length; i++) {
            if(adjusted[filterName].indexOf(reservation[i][filterName])>-1){
                filteredRev[filterName].push(reservation[i])
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
    console.log(pid)
    let tid = firebase.database().ref("operation/"+date+"/"+pid+"/teams").push().key;
    let time = new Date();
    time = time.getTime()
    $(".omp_edit").attr("pid",pid);


    let teamdata = {};
    firebase.database().ref("product").orderByChild("id").equalTo(pid).on("value",snap => {
        let data = snap.val();
        console.log(data)
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
function quickSelectOpdata(div){
    getOperationData(datestring.yesterday());
    $(".o_header_quick>p").removeClass("drp_quick--selected");
    div.addClass("drp_quick--selected")
    $(".o_header_date_txt").data('daterangepicker').setStartDate(date)
    $(".o_header_date_txt").data('daterangepicker').setEndDate(date)
    firebase.database().ref("reservation").orderByChild("date").equalTo(date).on("value",snap => {
        reservation[date] = snap.val();
    })
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
