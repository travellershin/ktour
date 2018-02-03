$(document).on("click",".obe_footer_save",function(){
    saveTeam($(this));
})

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
    opteamdata = {
        bus_name:busname,
        bus_size:bussize,
        bus_cost:buscost,
        guide:guidef,
        message:messagef,
        reservations:op_revdata
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
                    toastGuideName+=", "+guidedata[guidef[i]].name
                }else{
                    toastGuideName+=guidedata[guidef[i]].name
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
}
