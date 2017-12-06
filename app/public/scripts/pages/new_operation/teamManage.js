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

let old_guide = []; //원래 배차되어 있던 가이드

let cash_guide = []; //현재 cash를 들고 있는 가이드 배열(가이드가 팀 내에서 삭제시 cash 회수)
let asset_guide = []; //현재 asset을 들고 있는 가이드 배열(가이드 팀 내에서 삭제 뿐만 아니라 같은 팀 내에서 위치만이라도 변경시 asset을 회수)

let guideTotal = [];//guide 중복 배치를 체크하기 위한 array. 안의 키는 inflate.js에서 데이터를 불러오며 담김
let guideTeam = {} //{key:[product,teamID, team넘버, guide Array 몇번째인지] 형태}. 중복배치를 하면 product team에서 제거합니다가 뜰것이다

let old_asset_list = [];
let old_asset_obj = {};


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

        for (let guide in teamdata.cash) {
            cashTxt+='<div class="casset_line"><p class="casset_name">'+guideData[guide].name+'</p>'
            cashTxt+='<input class="casset_cash" type="number" value="'+teamdata.cash[guide]+'"/><p class="casset_won">WON</p></div>'
        }

        let assetTxt = ''
        old_asset_obj = {};
        old_asset_list = [];
        if(teamdata.asset){
            for (let name in teamdata.asset) {
                let size = teamdata.asset[name]
                old_asset_list.push(name);
                old_asset_obj[name] = size;
                assetTxt+='<div class="casset_line"><input class="casset_asset_name casset_asset_name--noUnderLine" spellcheck="false" value="'+name+'" readonly><input class="casset_asset" type="number" value="'+size+'"></div>'
            }
        }
        $(".casset_asset_div").html(assetTxt)
        $(".casset_cash_div").html(cashTxt)
    }else{
        toast("가이드가 배정되지 않아 Cash, Asset을 분배할 수 없습니다")
    }
}

function saveCasset(){
    let cash = {}; //team data의 cash 항목에 저장될 객체
    let asset = {}; //team data의 asset 항목에 저장될 객체
    let pid = $(".casset_footer_save").attr("pid");
    let tid = $(".casset_footer_save").attr("tid");
    let teamdata = operation[pid].teams[tid];

    for (let i = 0; i < $(".casset_cash").length; i++) {
        if($(".casset_cash").eq(i).val()*1 < 0){
            toast("현금은 음수로 입력할 수 없습니다")
            return false;
        }
    }
    for (let i = 0; i < $(".casset_asset").length; i++) {
        if($(".casset_asset").eq(i).val()*1 < 0){
            toast("Asset은 음수로 입력할 수 없습니다")
            return false;
        }
    }


    for (let i = 0; i < $(".casset_name").length; i++) {
        let guideName = $(".casset_name").eq(i).html();
        let guide = guideViaName[guideName]
        let newCash = $(".casset_cash").eq(i).val()*1

        if(newCash > 0){ //분배된 캐시가 있는 경우
            if(!cash_guide.includes(guide)){ //원래 cash를 안 가지고 있었던 경우
                cash_guide.push(guide); //신규 분배
                cashTransasction(guide, newCash)
            }else{
                if(newCash !== teamdata.cash[guide]){ //가지고 있던 cash 양이 달라진 경우
                    cashTransasction(guide, (newCash - teamdata.cash[guide]))
                }
            }

        }else{ //그 외 이상한 것을 입력했거나 아무것도 입력하지 않은 경우, 분배된 캐시가 0인 경우
            $(".casset_cash").eq(i).val(0) //입력된 값을 0으로 통일(이상한 값을 입력했거나 아무것도 입력하지 않았을 경우 대비)
            newCash = 0
            if(cash_guide.includes(guide)){ //원래 cash를 가지고 있었다면
                cash_guide.splice(cash_guide.indexOf(guide,1));  //cash를 가지고 있던 가이드 배열에서 제거
                cashTransasction(guide, -teamdata.cash[guide]) //가이드가 보유한 cash transaction으로 제거

                teamdata.cash[guide] = 0
            }
        }
        cash[guideViaName[guideName]] = newCash;
        firebase.database().ref("guide/"+guide+"/schedule/"+date+"/cash").set(newCash)
    }


    for (let i = 0; i < $(".casset_asset_name").length; i++) {
        let name = $(".casset_asset_name").eq(i).val();
        let size = $(".casset_asset").eq(i).val()*1
        let guide = guideViaName[$(".casset_name").eq(0).html()] //Asset에서 말하는 guide는 대장 가이드

        if(old_asset_list.length === 0){ //아무것도 없었다가 새로 Asset을 부여하는 경우
            asset_guide.push(guide) //대장 가이드를 Asset 보유자로 신규 지정한다!
        }

        if(size > 0){ //분배된 Asset이 있는 경우
            if(!old_asset_list.includes(name)){ //원래 안 가지고 있었던 Asset이다.
                assetTransaction(guide, name, size)
            }else{ //가지고 있던 Asset이더라도
                if(size !== teamdata.asset[name]){ //양이 달라진 경우
                    assetTransaction(guide, name, size - teamdata.asset[name])
                }
            }

        }else{ //그 외 이상한 것을 입력했거나 아무것도 입력하지 않은 경우, 분배된 캐시가 0인 경우
            $(".casset_asset").eq(i).val(0) //입력된 값을 0으로 통일(이상한 값을 입력했거나 아무것도 입력하지 않았을 경우 대비)
            size = 0

            if(old_asset_list.includes(name)){ //원래 기지고 있었던 Asset이라면.
                assetTransaction(guide, name, - teamdata.asset[name])
                delete teamdata.asset[name] //없애버리자
            }
        }

        if(size>0){
            asset[name] = size;
        }
    }

    firebase.database().ref("operation/"+date+"/"+pid+"/teams/"+tid+"/cash").set(cash);
    firebase.database().ref("operation/"+date+"/"+pid+"/teams/"+tid+"/asset").set(asset);

    $(".casset_blackBoard").addClass("hidden")
    $("body").css("overflow","auto")
}


function cashTransasction(guide,amount){ //어떤 가이드로부터 일정 amount의 cash를 더하거나 빼는 작업
    if(guideData[guide].cash){ //cash값이 null이 아닌 경우에만 transaction 사용
        firebase.database().ref("guide/"+guide+"/cash").transaction(function(currentCash){
            return currentCash + amount
        });
    }else{ //cash값이 null이면 cash 위치에 새로 set함
        firebase.database().ref("guide/"+guide+"/cash").set(amount)
    };
}

function assetTransaction(guide,name,size){
    if(guideData[guide].asset){
        if(guideData[guide].asset[name]){ //asset값이 null이 아닌 경우에만 transaction 사용
            firebase.database().ref("guide/"+guide+"/asset/"+name).transaction(function(currentAsset){
                return currentAsset + size
            })
        }else{
            guideData[guide].asset[name] = size
            firebase.database().ref("guide/"+guide+"/asset/"+name).set(size)
        }
    }else{
        guideData[guide].asset = {};
        guideData[guide].asset[name] = size
        firebase.database().ref("guide/"+guide+"/asset/"+name).set(size)
    }
}

function addAsset(){
    let txt = '';
    txt+='<div class="casset_line"><input class="casset_asset_name" spellcheck="false" value="ASSET NAME"><input class="casset_asset" type="number"></div>'

    $(".casset_asset_div").append(txt)
}

function editTeam(div){ //버스정보 -> edit을 누르면 호출됨(edit창 띄우기)
    $(".dw_dropdown").removeClass("drop_appended");
    let tid = div.attr("tid");
    let pid = div.attr("pid");
    let busno = div.attr("busno");
    let teamdata = operation[pid].teams[tid];
    $("body").css("overflow","hidden");

        console.log(pid)

    if(teamdata.guide){
        old_guide = teamdata.guide
    }else{
        old_guide = []
    }
    console.log(old_guide)

    firebase.database().ref("product").orderByChild("id").equalTo(pid).once("value",snap => { //but company와 type, 가격을 불러오기 위해 호출
        let data = snap.val();
        let productdata = {}
        for (let key in data) {
            productdata = data[key]
        }
        wage = productdata.cost.wage;
        console.log(wage)


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
    //한 가이드가 중복으로 들어가는지 여부를 체크
    let checkArray = []
    for (let i = 0; i < $(".obe_body_guide>input").length; i++) {
        console.log($(".obe_body_guide>input").eq(i).val())
        if(checkArray.includes($(".obe_body_guide>input").eq(i).val())){
            if($(".obe_body_guide>input").eq(i).val() !== "Unassigned"){
                toast($(".obe_body_guide>input").eq(i).val() + " 가이드가 중복 배차되었습니다");
                return false;
            }
        }else{
            checkArray.push($(".obe_body_guide>input").eq(i).val())
        }
    }

    let tid = div.attr("tid");
    let pid = div.attr("pid");
    let busname = $("#op_bus_company").val();
    let bussize = ""
    let buscost = ""
    if($("#op_bus_size").val().indexOf("인승")>0){ //몇인승 버스인지, 대여비가 얼마인지 저장
        bussize = $("#op_bus_size").val().split("인승(")[0]*1;
        buscost = $("#op_bus_size").val().split("인승(")[1].slice(0,-2)*1;
    }
    let cashdata = {};
    let assetdata = {};
    let wagedata = {};
    console.log(operation[pid])

    if(operation[pid].teams[tid]){
        if(operation[pid].teams[tid].cash){
            cashdata = operation[pid].teams[tid].cash;
        }
        if(operation[pid].teams[tid].asset){
            assetdata = operation[pid].teams[tid].asset;
        }
        if(operation[pid].teams[tid].wage){
            wagedata = operation[pid].teams[tid].wage
        }
    }
    let teamdata = operation[pid].teams[tid];

    let new_guide = [];
    for (var i = 0; i < $(".obe_body_guide>input").length; i++) {
        if($(".obe_body_guide>input").eq(i).val() !== "Unassigned"){
            let guide = guideViaName[$(".obe_body_guide>input").eq(i).val()];
            new_guide.push(guide)

            if(asset_guide.includes(guide)){//만일 해당 가이드가 이미 Asset을 가진 대표 가이드라면
                if(!old_guide.includes(guide)){//그런데 다른 팀에서 가지고 있는거라면
                    toast(guideData[guide].name + " 가이드는 다른 팀에서 Asset을 부여받은 대표 가이드 입니다.")
                    return false;
                }
            }
        }
    }
    let memo_to = $("#op_message").val()

    opteamdata = {
        bus_name:busname,
        bus_size:bussize,
        bus_cost:buscost,
        guide:new_guide,
        message:memo_to,
        cash:cashdata,
        asset:assetdata,
        wage:wagedata,
    }


    if(old_guide.length>0){ //원래 old_guide가 있었고
        if(new_guide.length>0){ //new_guide가 있다면
            if(old_guide[0] !== new_guide[0]){ //대장 guide가 혹시 바뀌었는지 비교

                if(operation[pid].teams[tid].asset){ //asset이 있었다면
                    for (let name in assetdata) {
                        let size = assetdata[name];
                        assetTransaction(old_guide[0], name, -size); //Asset을 옮겨주자
                        assetTransaction(new_guide[0], name, size);
                        toast("변경된 대표 가이드에게 Asset을 부여합니다")
                    }
                }
            }
        }else{ //가이드들이 모두 배차 해제되었다면
            if(operation[pid].teams[tid].asset){
                toast("분배된 Asset이 있어 최소 한 명의 가이드가 배치되어야 합니다.")
                return false;
            }
        }
    }

    for (let i = 0; i < old_guide.length; i++) { // 원래 배치되어 있던 가이드가
        if(!new_guide.includes(old_guide[i])){ //새로운 팀에서 빠졌다면
            console.log(guideData[old_guide[i]].name + " 가이드가 팀에서 제외되었습니다")
            console.log(teamdata.cash);

            firebase.database().ref("guide/"+old_guide[i]+"/schedule/"+date).remove(); //가이드 스케줄을 제거함
            cashTransasction(old_guide[i], -cashdata[old_guide[i]]) //가이드가 보유한 cash transaction으로 제거
            delete opteamdata.cash[old_guide[i]] //cash리스트에서 제거
            delete opteamdata.wage[old_guide[i]]

            if(cash_guide.includes(old_guide[i])){ //해당 가이드가 실제로 cash를 가지고 있었다면
                cash_guide.splice(cash_guide.indexOf(old_guide[i],1));  //cash를 가지고 있던 가이드 배열에서 제거
            }
        }
    }

    let toastGuideName = ""
    for (let i = 0; i < new_guide.length; i++) { //배치된 가이드가
        if(!old_guide.includes(new_guide[i])){ //팀에 원래 존재하던 가이드가 아니라면

            if(!opteamdata.wage){
                opteamdata.wage = {}
            }
            let bonus = 0
            if(guideData[new_guide[i]].bonus){
                bonus = guideData[new_guide[i]].bonus*1
            }
            opteamdata.wage[new_guide[i]] = wage + bonus
            let totalWage = opteamdata.wage[new_guide[i]]

            firebase.database().ref("guide/"+new_guide[i]+"/schedule/"+date).set({ //새로운 스케줄이 생겼다는 뜻이니 set해주고
                product:pid,
                team:tid,
                cash:0,
                wage:totalWage
            });

            if(!opteamdata.cash){
                opteamdata.cash = {}
            }
            opteamdata.cash[new_guide[i]] = 0




            if(guideTotal.includes(new_guide[i])){ //다른 팀에 있다가 옮겨온 것이라면
                if(toastGuideName.length>0){ //재배차되었다는것을 알리기 위한 문구를 작성함
                    toastGuideName+=", "+guideData[new_guide[i]].name
                }else{
                    toastGuideName+=guideData[new_guide[i]].name
                }
                let old_pid = guideTeam[new_guide[i]][0];
                let old_team = guideTeam[new_guide[i]][1];
                let old_no = guideTeam[new_guide[i]][3];

                operation[old_pid].teams[old_team].guide.splice(old_no,1) //원 소속팀에서 새로 배차된 가이드를 제거
                cashTransasction(new_guide[i], -operation[old_pid].teams[old_team].cash[new_guide[i]]) //가이드가 보유한 cash transaction으로 제거

                if(operation[old_pid].teams[old_team].cash){
                    if(operation[old_pid].teams[old_team].cash[new_guide[i]]){
                        delete operation[old_pid].teams[old_team].cash[new_guide[i]] //원 소속팀 cash분배 리스트에서 제거
                    }
                }
                if(operation[old_pid].teams[old_team].wage){
                    if(operation[old_pid].teams[old_team].wage[new_guide[i]]){
                        delete operation[old_pid].teams[old_team].wage[new_guide[i]] //원 소속팀 wage 리스트에서 제거
                        operation[old_pid].teams[old_team].wage_cost = 0

                        for (let money in operation[old_pid].teams[old_team].wage) {
                            operation[old_pid].teams[old_team].wage_cost += operation[old_pid].teams[old_team].wage[money]
                        }
                    }
                }

                firebase.database().ref("operation/"+date+"/"+old_pid+"/teams/"+old_team).update(operation[old_pid].teams[old_team]); //위의 두 정보를 업데이트함
            }
        }
    }

    opteamdata.wage_cost = 0
    if(opteamdata.wage){
        for (let money in opteamdata.wage) {
            opteamdata.wage_cost += opteamdata.wage[money]
        }
    }

    if(toastGuideName.length>0){
        toast(toastGuideName+" 가이드가 재배치되었습니다.")
    }

    firebase.database().ref("operation/"+date+"/"+pid+"/teams/"+tid).update(opteamdata);
    $(".pop_blackScreen").addClass("hidden");
    $(".obe").addClass("hidden");
    $("body").css("overflow","auto")

    if(lastRendering.product.length>0){
        inflate_listTop()
    }
}
