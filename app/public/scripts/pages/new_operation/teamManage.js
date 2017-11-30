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

    console.log(operation[pid].teams[tid])

    let memotxt = ""
    if(teamObj.memo){
        for (let guidekey in teamObj.memo) {
            memotxt+=guideData[guidekey].name+" : " + teamObj.memo[guidekey] +"<br>"
        }
        memotxt = memotxt.slice(0,-4)
    }

    $(".om_pop_memofrom").html(memotxt);
}

let old_guide = []; //현재 어디엔가 배치되어 있는 가이드 배열(가이드 팀 내에서 삭제시 배차 해제)
// TODO: cash_guide와 asset_guide는 모든 오퍼레이션 불러올 때 가져와야 할 듯

let cash_guide = []; //현재 cash를 들고 있는 가이드 배열(가이드가 팀 내에서 삭제시 cash 회수)
let asset_guide = []; //현재 asset을 들고 있는 가이드 배열(가이드 팀 내에서 삭제 뿐만 아니라 같은 팀 내에서 위치만이라도 변경시 asset을 회수)
let new_guide = [];

let guideTotal = [];//guide 중복 배치를 체크하기 위한 array. 안의 키는 inflate.js에서 데이터를 불러오며 담김
let guideTeam = {} //{key:[product,teamID, team넘버, guide Array 몇번째인지] 형태}. 중복배치를 하면 product team에서 제거합니다가 뜰것이다


function editCasset(div){

    let tid = div.attr("tid");
    let pid = div.attr("pid");
    let busno = div.attr("busno");
    let teamdata = operation[pid].teams[tid];

    if(teamdata.guide){
        $("body").css("overflow","hidden");
        $(".om_pop").addClass("hidden")
        $(".casset_footer_save").attr("pid",pid);
        $(".casset_footer_save").attr("tid",tid);
        $(".casset_footer_save").attr("busno",busno);
        $(".casset_header_title").html(pid.split("_")[2]+" BUS "+busno)
        $(".casset_blackBoard").removeClass("hidden");
        let cashTxt = ""

        if(teamdata.cash){
            for (let guide in teamdata.cash) {
                cashTxt+='<div class="casset_line"><p class="casset_name">'+guideData[guide].name+'</p>'
                cashTxt+='<input class="casset_cash" type="number" value="'+teamdata.cash[guide]+'"/><p class="casset_won">WON</p></div>'
            }
        }
        $(".casset_cash_div").html(cashTxt)
    }else{
        toast("가이드가 배정되지 않아 Cash, Asset을 분배할 수 없습니다")
    }
}

function saveCasset(){
    let cash = {}; //team data의 cash 항목에 저장될 객체
    let pid = $(".casset_footer_save").attr("pid");
    let tid = $(".casset_footer_save").attr("tid");
    let teamdata = operation[pid].teams[tid];

    for (let i = 0; i < $(".casset_name").length; i++) {
        let guideName = $(".casset_name").eq(i).html();
        let guide = guideViaName[guideName]
        let newCash = $(".casset_cash").eq(i).val()*1

        if(newCash > 0){ //분배된 캐시가 있는 경우
            if(!cash_guide.includes(guide)){ //원래 cash를 안 가지고 있었던 경우
                cash_guide.push(guide); //신규 분배
                cashTransasction(guide, newCash)
            }

            if(newCash !== teamdata.cash[guide]){ //cash 양이 달라진 경우
                cashTransasction(guide, (newCash - teamdata.cash[guide]))
            }

        }else if(newCash < 0){ //분배된 캐시에 음수를 입력한 경우
            toast("분배할 현금은 음수로 입력할 수 없습니다")
            return false;
        }else{ //그 외 이상한 것을 입력했거나 아무것도 입력하지 않은 경우, 분배된 캐시가 0인 경우
            $(".casset_cash").eq(i).val(0) //입력된 값을 0으로 통일(이상한 값을 입력했거나 아무것도 입력하지 않았을 경우 대비)
            newCash = 0
            if(cash_guide.includes(guide)){ //원래 cash를 가지고 있었다면
                cash_guide.splice(cash_guide.indexOf(guide,1));  //cash를 가지고 있던 가이드 배열에서 제거
                cashTransasction(guide, -teamdata.cash[guide]) //가이드가 보유한 cash transaction으로 제거

                // TODO: 팀정보 - cash 배열에서 해당 가이드 제거!!!!!!!!!!!!!!!!!!!(object - delete로)
            }
        }
        cash[guideViaName[guideName]] = newCash;
    }
    firebase.database().ref("operation/"+date+"/"+pid+"/teams/"+tid+"/cash").set(cash)
}


function cashTransasction(guide,amount){ //어떤 가이드로부터 일정 amount의 cash를 더하거나 빼는 작업

    if(guideData[guide].cash){ //cash값이 null이 아닌 경우에만 transaction 사용
        firebase.database().ref("guide/"+guide+"/cash").transaction(function(currentCash){
            return currentCash + amount
        })
    }else{ //cash값이 null이면 cash 위치에 새로 set함
        firebase.database().ref("guide/"+guide+"/cash").set(amount)
    }

}

function editTeam(div){ //버스정보 -> edit을 누르면 호출됨(edit창 띄우기)
    $(".dw_dropdown").removeClass("drop_appended");
    let tid = div.attr("tid");
    let pid = div.attr("pid");
    let busno = div.attr("busno");
    let teamdata = operation[pid].teams[tid];
    $("body").css("overflow","hidden");

    new_guide = []

    if(teamdata.guide){
        old_guide = teamdata.guide
    }else{
        old_guide = []
    }

    firebase.database().ref("product").orderByChild("id").equalTo(pid).once("value",snap => { //but company와 type, 가격을 불러오기 위해 호출
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

function arrangeGuide(div){ //edit Team 팝업에서 가이드를 할당했을 경우.
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
    if($("#op_bus_size").val().indexOf("인승")>0){ //몇인승 버스인지, 대여비가 얼마인지 저장
        bussize = $("#op_bus_size").val().split("인승(")[0]*1;
        buscost = $("#op_bus_size").val().split("인승(")[1].slice(0,-2)*1;
    }

    let newGuideArray = [];
    for (var i = 0; i < $(".obe_body_guide>input").length; i++) {
        if($(".obe_body_guide>input").eq(i).val() !== "Unassigned"){
            newGuideArray.push(guideViaName[$(".obe_body_guide>input").eq(i).val()])
        }
    }
    let memo_to = $("#op_message").val()

    opteamdata = {
        bus_name:busname,
        bus_size:bussize,
        bus_cost:buscost,
        guide:newGuideArray,
        message:memo_to
    }

    if(old_guide.length>0){ //원래 old_guide가 있었고
        if(newGuideArray.length>0){ //new_guide가 있다면
            if(old_guide[0] !== newGuideArray[0]){ //대장 guide가 혹시 바뀌었는지 비교
                // TODO: oldguide에게서 asset을 제거하고 asset transaction
            }
        }else{ //가이드들이 모두 배차 해제되었다면
            // TODO: oldguide에게서 asset을 제거하고 asset transaction
        }
    }else{ //원래 old_guide가 없었다가
        if(newGuideArray.length>0){ //새로 생겼다면
            // TODO: newGuide 0번에게 asset을 부여하고 asset transaction
        }
    }

    for (let i = 0; i < old_guide.length; i++) { //edit popup을 처음 열 때 확인한 old_guide정보를 확인해서
        if(!newGuideArray.includes(old_guide[i])){ //해당 가이드가 new guide 목록에서 빠졌다면

            firebase.database().ref("guide/"+old_guide[i]+"/schedule/"+date).remove(); //가이드 스케줄을 제거함

            if(cash_guide.includes(old_guide[i])){ //그런데 해당 가이드가 cash를 가지고 있기까지 했다면
                // TODO: cash분배를 0으로 하고 가이드에게서 cash transaction
                let old_pid = guideTeam[old_guide[i]][0];
                let old_tid = guideTeam[old_guide[i]][1];
                let teamdata = operation[old_pid].teams[old_tid];

                // TODO: 팀정보 - cash 배열에서 해당 가이드 제거!!!!!!!!!!!!!!!!!!!

                cash_guide.splice(cash_guide.indexOf(old_guide[i],1));  //cash를 가지고 있던 가이드 배열에서 제거
                cashTransasction(old_guide[i], -teamdata.cash[old_guide[i]]) //가이드가 보유한 cash transaction으로 제거
                console.log("가이드제거!!트랜젝션!!")
            }
        }
    }

    let toastGuideName = ""
    for (let i = 0; i < newGuideArray.length; i++) {
        if(!old_guide.includes(newGuideArray[i])){
            firebase.database().ref("guide/"+newGuideArray[i]+"/schedule/"+date).set({
                product:pid,
                team:tid
            })

            if(guideTotal.includes(newGuideArray[i])){
                if(toastGuideName.length>0){
                    toastGuideName+=", "+guideData[newGuideArray[i]].name
                }else{
                    toastGuideName+=guideData[newGuideArray[i]].name
                }
                let old_pid = guideTeam[newGuideArray[i]][0];
                let old_team = guideTeam[newGuideArray[i]][1];
                let old_no = guideTeam[newGuideArray[i]][3];

                operation[old_pid].teams[old_team].guide.splice(old_no,1) //원 소속팀에서 새로 배차된 가이드를 제거
                firebase.database().ref("operation/"+date+"/"+old_pid+"/teams/"+old_team+"/guide").set(operation[old_pid].teams[old_team].guide); //하고 그 정보를 set함
            }
        }
    }
    if(toastGuideName.length>0){
        toast(toastGuideName+" 가이드가 재배치되었습니다.")
    }

    firebase.database().ref("operation/"+date+"/"+pid+"/teams/"+tid).update(opteamdata)
    $(".pop_blackScreen").addClass("hidden");
    $(".obe").addClass("hidden");
    $("body").css("overflow","auto")

    if(lastRendering.product.length>0){
        inflate_listTop()
    }
}
