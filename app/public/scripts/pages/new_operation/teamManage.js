function teamPop(div,event){
    event.stopPropagation();

    let tid = div.attr("tid");
    let pid = div.attr("pid");
    let teamObj = operation[pid].teams[tid]
    let busno = operation[pid].teamArgArray.indexOf(tid)
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

    $(".om_pop_memofrom").html(memotxt);
}

let old_guide = [];
let new_guide = [];

let guideTotal = [];//guide 중복 배치를 체크하기 위한 array. 안의 키는 inflate.js에서 데이터를 불러오며 담김
let guideTeam = {} //{key:[product,teamID, team넘버, guide Array 몇번째인지] 형태}. 중복배치를 하면 product team에서 제거합니다가 뜰것이다


function editCasset(div){
    $("body").css("overflow","hidden");
    let tid = div.attr("tid");
    let pid = div.attr("pid");
    let busno = div.attr("busno");
    $(".casset_header_title").html(pid.split("_")[2]+" BUS "+busno)
    $(".casset_blackBoard").removeClass("hidden");
    let teamdata = operation[pid].teams[tid];

    let cashTxt = ""
    if(teamdata.guide){
        for (let i = 0; i < teamdata.guide.length; i++) {
            let gd = guideData[teamdata.guide[i]]

            cashTxt+='<div class="casset_line"><p class="casset_name">'+gd.name+'</p>'
            cashTxt+='<input class="casset_cash" type="number" value="'+gd.cash+'"/><p class="casset_won">WON</p></div>'
            console.log(gd)
        }
        
    }
    $(".casset_cash_div").html(cashTxt)
    console.log(teamdata)
}

function editTeam(div){
    $(".dw_dropdown").removeClass("drop_appended")
    let tid = div.attr("tid");
    let pid = div.attr("pid");
    let busno = div.attr("busno");
    let teamdata = operation[pid].teams[tid];
    $("body").css("overflow","hidden")

    new_guide = []

    if(teamdata.guide){
        old_guide = teamdata.guide
    }else{
        old_guide = []
    }

    console.log(old_guide)

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
                guidetxt+='<input class="obe_body_input dw_dropdown op_guide'+i+'" value="'+guideData[teamdata.guide[i]].name+'" id="op_guide'+i+'" readonly/>'
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
        for (let guidekey in guideData) {
            guidenameArray.push(guideData[guidekey].name)
        }
        op_revdata = teamdata.reservations

        $(".obe_body_guide>input").attr("dropitem",guidenameArray.toString())

    })
}

function closeCasset(){
    $(".casset_blackBoard").addClass("hidden");
    $("body").css("overflow","auto")
}

function closeTeam(){
    $(".pop_blackScreen").addClass("hidden");
    $(".obe").addClass("hidden");
    $("body").css("overflow","auto")
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

function arrangeGuide(div){
    let length = $(".obe_body_guide>input").length;
    let selectedNo = $(div).attr("did").charAt($(div).attr("did").length-1)*1+1
    let guidenameArray = []
    guidenameArray.push("Unassigned")
    for (let guidekey in guideData) {
        guidenameArray.push(guideData[guidekey].name)
    }
    if(length ===selectedNo){
        $(".obe_body_guide").append('<input class="obe_body_input dw_dropdown" id="op_guide'+length+'" value="Unassigned" readonly dropitem="'+guidenameArray.toString()+'"/>')
    }
}

function saveTeam(div){

    let tid = div.attr("tid");
    let pid = div.attr("pid");
    let busname = $("#op_bus_company").val();
    let bussize = ""
    let buscost = ""
    if($("#op_bus_size").val().indexOf("인승")>0){
        bussize = $("#op_bus_size").val().split("인승(")[0]*1;
        buscost = $("#op_bus_size").val().split("인승(")[1].slice(0,-2)*1;
    }

    let guidef = [];
    for (var i = 0; i < $(".obe_body_guide>input").length; i++) {
        if($(".obe_body_guide>input").eq(i).val() !== "Unassigned"){
            guidef.push(guideViaName[$(".obe_body_guide>input").eq(i).val()])
        }
    }
    let messagef = $("#op_message").val()
    if(operation[pid].teams[tid]){
        opteamdata = {
            bus_name:busname,
            bus_size:bussize,
            bus_cost:buscost,
            guide:guidef,
            message:messagef,
            reservations:operation[pid].teams[tid].reservations
        }
    }else{
        opteamdata = {
            bus_name:busname,
            bus_size:bussize,
            bus_cost:buscost,
            guide:guidef,
            message:messagef
        }
    }

    for (let i = 0; i < old_guide.length; i++) {
        if(!guidef.includes(old_guide[i])){
            firebase.database().ref("guide/"+old_guide[i]+"/schedule/"+date).remove();
            console.log(old_guide[i] + "제거")
        }
    }
    let toastGuideName = ""
    for (let i = 0; i < guidef.length; i++) {
        if(!old_guide.includes(guidef[i])){
            firebase.database().ref("guide/"+guidef[i]+"/schedule/"+date).set({
                product:pid,
                team:tid
            })
            console.log(guidef[i] + "추가")
            if(guideTotal.includes(guidef[i])){
                if(toastGuideName.length>0){
                    toastGuideName+=", "+guideData[guidef[i]].name
                }else{
                    toastGuideName+=guideData[guidef[i]].name
                }
                let old_pid = guideTeam[guidef[i]][0];
                let old_team = guideTeam[guidef[i]][1];
                let old_no = guideTeam[guidef[i]][3];

                firebase.database().ref("operation/"+date+"/"+old_pid+"/teams/"+old_team+"/guide/"+old_no).remove();
                // TODO: 해당 팀에서 제거하기
            }
        }
    }
    if(toastGuideName.length>0){
        toast(toastGuideName+" 가이드가 재배치되었습니다.")
    }

    firebase.database().ref("operation/"+date+"/"+pid+"/teams/"+tid).set(opteamdata)
    $(".pop_blackScreen").addClass("hidden");
    $(".obe").addClass("hidden");
    $("body").css("overflow","auto")

    if(lastRendering.product.length>0){
        inflate_listTop()
    }
}
