
let operation = {};
let opdate = "";
let teamObj = {};
let guidedata = {};
let op_revdata = {}
let teamlist = [] //list보기에서 team별로 reservation이 들어갈 배열
let reservation = []
let adjusted = {
    pickupPlace : [],
    nationality : [],
    agency : []
}
let totaldata = {}
let isEditing = false;
let selectArray = []

$(".ol_editBus").click(function(){
    isEditing = true;
    $(this).addClass("hidden");
    $(".ol_unSelect").removeClass("hidden");
    $(".ol_selectAll").removeClass("hidden");
    $(".ol_busEdit").removeClass("hidden")
    $(".rv_box").css("padding-bottom","200px")
    selectArray = []
})

$(document).on("click",".ol_busEdit_bus",function(){
    let target_team = $(this).attr("tid") // 선택된(옮겨질) team id
    let s_product = $(".ol_title").html(); // 프로덕트명
    for (let i = 0; i < selectArray.length; i++) {
        let s_team = selectArray[i][0];  //원 소속 팀
        let s_rev = selectArray[i][1];  //reservation id
        console.log("원 소속팀: "+s_team);
        console.log("옮겨질 팀: "+target_team);
        console.log("예약 번호: "+s_rev);

        console.log(totaldata)

        let reservationData = totaldata[s_product].teams[s_team].reservations[s_rev] //복사해둠
        delete totaldata[s_product].teams[s_team].reservations[s_rev] // 지움
        totaldata[s_product].teams[target_team].reservations[s_rev] = reservationData //붙여넣기

        console.log(totaldata)


        // TODO: 해당일 상품 전체를 변수에 담는다. 옮길 reservation을 복사해둔다. 기존 팀에 있는 reservation을 삭제한다. 변수에 합친다. firebase에 set한다.
        //firebase.database().ref("operation/"+opdate+"/"+s_product+"/teams/"+s_team+"/reservations/"+s_rev).remove()
        //console.log(totaldata[s_product].teams[s_team].reservations[s_rev])
        //firebase.database().ref("operation/"+opdate+"/"+s_product+"/teams/"+target_team+"/reservations/"+s_rev).set(totaldata[s_product].teams[s_team].reservations[s_rev])
    }
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
        console.log(selectArray)

    }

})

$(document).ready(function(){
    $(".o_header_date_txt").val(datestring.today());
    getOpData(datestring.today())
    opdate = datestring.today();
    firebase.database().ref("guide").on("value",snap => {
        guidedata = snap.val();
    })
})

$(document).on("click",".omp_list",function(){
    showList($(this).attr("pname"));
    $(".ol_bus_total").addClass("ol_bus_box--selected");
})
$(document).on("click",".ol_bus_total",function(){
    filter_init();
    inflate_reservation(reservation)
    $(".ol_bus_box").removeClass("ol_bus_box--selected")
    $(this).addClass("ol_bus_box--selected")
})
$(document).on("click",".ol_bus_team",function(){
    filter_init();
    inflate_reservation(teamlist[$(".ol_bus_team").index($(this))])
    $(".ol_bus_box").removeClass("ol_bus_box--selected")
    $(this).addClass("ol_bus_box--selected")
})

$(document).on("click", ".obe_header_close",function(){
    $(".pop_blackScreen").addClass("hidden");
    $(".obe").addClass("hidden");
})

$(document).on("click",".omp_team",function(){ //팀 상세정보 보기
    teamPop($(this));
})

$(document).on("click",".drop_item",function(){
    if($(this).attr("did") === "op_bus_company"){
        let busname = $(this).html()
        changeBusCompany(busname)
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

$(".omp_edit").click(function(){
    editTeam($(this));
})

$(".ol_return").click(function(){
    $(this).addClass("hidden");
    $(".ol").addClass("hidden");
    $(".om").removeClass("hidden")
    $(".ol_busEdit").addClass("hidden")
})

$(document).on("click",".obe_footer_save",function(){
    saveTeam($(this));
})
$(".o_header_quick_yesterday").click(function(){
    getOpData(datestring.yesterday())
    opdate = datestring.yesterday();
    $(".o_header_date_txt").val(datestring.yesterday());
    $(".o_header_quick>p").removeClass("drp_quick--selected");
    $(this).addClass("drp_quick--selected")
})
$(".o_header_quick_today").click(function(){
    getOpData(datestring.today())
    opdate = datestring.today();
    $(".o_header_date_txt").val(datestring.today());
    $(".o_header_quick>p").removeClass("drp_quick--selected");
    $(this).addClass("drp_quick--selected")
})
$(".o_header_quick_tomorrow").click(function(){
    getOpData(datestring.tomorrow())
    opdate = datestring.tomorrow();
    $(".o_header_date_txt").val(datestring.tomorrow());
    $(".o_header_quick>p").removeClass("drp_quick--selected");
    $(this).addClass("drp_quick--selected")
})



function teamPop(div){
    let tid = div.attr("tid");
    let pname = div.attr("pname");
    let busno = div.attr("busno");
    $(".om_pop").css("left",event.pageX +10 + "px")
                .css("top",event.pageY -120 + "px");
    $(".om_pop").toggleClass("hidden");
    console.log(teamObj[tid]);
    $(".om_pop_company").html(teamObj[tid].bus_name);
    $(".om_pop_people").html(teamObj[tid].people);
    $(".om_pop_cost").html(teamObj[tid].bus_cost);
    $(".om_pop_message").html(teamObj[tid].message);
    if(teamObj[tid].guide){
        $(".om_pop_guide").html(teamObj[tid].guide.toString());
    }else{
        $(".om_pop_guide").html("Unassigned");
    }
    $(".omp_edit").attr("tid",tid);
    $(".omp_edit").attr("pname",pname);
    $(".omp_edit").attr("busno",busno);
}

function editTeam(div){
    $(".dw_dropdown").removeClass("drop_appended")
    let tid = div.attr("tid");
    let pname = div.attr("pname");
    let busno = div.attr("busno");
    $("#obe_footer_save").attr("tid",tid);
    $("#obe_footer_save").attr("pname",pname);
    let teamdata = operation[opdate][pname.split("_")[0]][pname.split("_")[2]].teams[tid];
    firebase.database().ref("product").orderByChild("id").equalTo(pname).on("value",snap => {
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
        $(".obe_footer_save").attr("pname",pname);
        $(".obe_header_title").html([pname.split("_")[2]]+" "+busno);
        $("#op_bus_company").val(teamdata.bus_name);
        if(teamdata.bus_size){
            $("#op_bus_size").val(teamdata.bus_size + "인승(" + teamdata.bus_cost + "원)");
        }else{
            $("#op_bus_size").val("Unknown Bus Size")
        }
        if(teamdata.guide){
            let guidetxt = "";
            let guidenumber = 0
            for (let i = 0; i < teamdata.guide.length; i++) {
                guidetxt+='<input class="obe_body_input dw_dropdown" value="'+teamdata.guide[i]+'" id="op_guide'+i+'" readonly/>'
                guidenumber++
            }
            guidetxt+='<input class="obe_body_input dw_dropdown" value="Unassigned" id="op_guide'+(guidenumber)+'" readonly/>'
            $(".obe_body_guide").html(guidetxt);
        }else{
            $("#op_guide").val("Unassigned");
        }




        $("#op_message").val(teamdata.message);
        let guidenameArray = []
        guidenameArray.push("Unassigned")
        for (let guidekey in guidedata) {
            guidenameArray.push(guidedata[guidekey].name)
        }
        op_revdata = teamdata.reservations

        $(".obe_body_guide>input").attr("dropitem",guidenameArray.toString())

        console.log(operation[opdate][pname.split("_")[0]][pname.split("_")[2]].teams[tid])
    })
}

function changeBusCompany(busname){
    let pname = $(".omp_edit").attr("pname");
    firebase.database().ref("product").orderByChild("id").equalTo(pname).on("value",snap => {
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
    let pname = div.attr("pname");
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
    firebase.database().ref("operation/"+opdate+"/"+pname+"/teams/"+tid).set(opteamdata)
    $(".pop_blackScreen").addClass("hidden");
    $(".obe").addClass("hidden");
}

function inflate_op(data){
    let txt = "";
    for (let place in data) {
        for (let productName in data[place]) {
            let people_total = 0
            let teams_no = 0
            let product = data[place][productName];
            for (let team in product.teams) {
                teamObj[team] = product.teams[team]
                let people_team = 0
                for (let reservation in product.teams[team].reservations) {
                    people_total+=product.teams[team].reservations[reservation].people
                    people_team += product.teams[team].reservations[reservation].people
                }
                teams_no++
                product.teams[team].people = people_team
            }
            product.bus = teams_no
            product.people = people_total
        }
    }


    for (let place in data){
        txt+='<div class="om_city om_city_'+place+'"><p class="om_city_name">'+place.toUpperCase()+'</p>'
        txt+='<div class="om_box">'

        for (let product in data[place]) {
            txt+='<div class="om_box_pd"><p class="omp_name">'+product+'</p>'
            txt+='<div class="omp_people"><p class="omp_people_txt">PEOPLE</p><p class="omp_people_number">'+data[place][product].people+'</p></div>'
            txt+='<div class="omp_bus"><p class="omp_bus_txt">BUS</p><p class="omp_bus_number">'+data[place][product].bus+'</p></div>';
            let pnametxt = "";

            let i = 1;
            for (let team in data[place][product].teams) {
                pnametxt = data[place][product].teams[team].productName
                txt+='<div class="omp_team" busno="BUS '+i+'" pname="'+data[place][product].teams[team].productName+'" tid="'+team+'"><div class="omp_team_names"><p class="omp_team_names_bus">BUS '+i+'</p>'
                if(data[place][product].teams[team].guide){
                    txt+='<p class="omp_team_names_guide">'+data[place][product].teams[team].guide+'</p>'
                }else{
                    txt+='<p class="omp_team_names_guide">Unassigned</p>'
                }
                txt+='</div><p class="omp_team_people">'+data[place][product].teams[team].people+'</p></div>'
                i++
                // TODO: ㅁㅈㄷㅊㄱㅈㄷ
            }


            txt+='<div class="omp_list" pname="'+pnametxt+'" ><img src="./assets/icon-list.svg"/><p>VIEW LIST</p></div></div>'
        }


        txt+='</div></div>'
    }

    $(".om").html(txt);
}

function showList(pname){
    $(".om").addClass("hidden");
    $(".ol_return").removeClass("hidden")
    $(".ol").removeClass("hidden")
    firebase.database().ref("operation/"+opdate+"/"+pname).on("value",snap => {
        let data = snap.val();
        console.log(data)
        reservation = []
        teamlist = []
        $(".ol_title").html(pname)


        let bustxt = ""

        bustxt+='<div class="ol_bus_total ol_bus_box"><p class="ol_bus_total_txt">TOTAL</p><p class="ol_bus_total_number"></p></div>'

        let totalNumber = 0
        let busno = 0
        let busEditTxt = "";

        for (let key in data.teams) {
            let team = data.teams[key];
            busno++
            let teamNumber = 0

            busEditTxt += '<p class="ol_busEdit_bus" tid="'+key+'">BUS '+busno+'</p>'


            firebase.database().ref("operation/"+opdate+"/"+pname+"/teams/"+key+"/busno").set(busno)
            for (let rev in team.reservations) {

                let reserv = team.reservations[rev];
                teamNumber += reserv.people;
                totalNumber += reserv.people;
                let reservation_data = {
                    id:reserv.id,
                    pickupPlace:reserv.pickupPlace,
                    people:reserv.people,
                    option:reserv.option,
                    clientName:reserv.clientName,
                    nationality:"",
                    agency:reserv.agency,
                    busNumber:busno,
                    memo:reserv.memo,
                    team:key
                }
                if(reservation.nationality){
                    reservation_data.nationality = reserv.nationality
                }else{
                    reservation_data.nationality = "Unknown"
                }
                reservation.push(reservation_data)

                if(teamlist[busno-1]){
                    teamlist[busno-1].push(reservation_data)
                }else{
                    teamlist[busno-1] = [reservation_data]
                }
            }
            console.log(reservation)
            console.log(teamlist)

            bustxt+='<div class="ol_bus_team ol_bus_box" tid="'+key+'"><div class="ol_bus_team_left"><p class="ol_bus_team_busno">BUS '+busno+'</p>'
            if(team.guide){
                bustxt+='<p class="ol_bus_team_guide" title="'+team.guide.toString()+'">'+team.guide.toString()+'</p></div>'
            }else{
                bustxt+='<p class="ol_bus_team_guide">Unassigned</p></div>'
            }


            bustxt+='<p class="ol_bus_team_number">'+teamNumber+"/"+team.bus_size+'</p></div>'

        }

        $(".ol_busEdit_busbox_box").html(busEditTxt)

        bustxt+='<div class="ol_bus_add ol_bus_box"><img src="./assets/icon-add.svg"/><p>ADD NEW BUS</p></div>'
        $(".ol_bus").html(bustxt)

        $(".ol_bus_total_number").html(totalNumber);
        filterOut_rev(reservation);
        inflate_reservation(reservation);
    })
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
