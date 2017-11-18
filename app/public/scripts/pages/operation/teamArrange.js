$(".o_header_change").click(function(){
    if($(this).html()==="팀 이동"){
        teamChangeMode();
    }else{
        normalMode();
    }
})

$(document).on("click",".omp_name--blueColor",function(){
    moveTeam($(this).parent().attr("pid"))
})

function teamChangeMode(){
    $(".o_header_change").html("팀 이동 완료")
    $(".om_box_pd").addClass("om_box_pd--changeMode")
    $(".omp_name").addClass("omp_name--blueColor")
    $(".omp_list").addClass("hidden")
    $(".o_header_quick").addClass("hidden")
    $(".o_header_date").addClass("hidden")
}

function normalMode(){
    $(".o_header_change").html("팀 이동")
    $(".om_box_pd").removeClass("om_box_pd--changeMode")
    $(".omp_name").removeClass("omp_name--blueColor")
    $(".omp_list").removeClass("hidden")
    $(".o_header_quick").removeClass("hidden")
    $(".o_header_date").removeClass("hidden")
}


function selectTeamForMove(div){
    $(div).toggleClass("omp_team--selected")
}

function moveTeam(pid_to){
    for (let i = 0; i < $(".omp_team--selected").length; i++) {
        let pid_from = $(".omp_team--selected").eq(i).attr("pid")
        let tid = $(".omp_team--selected").eq(i).attr("tid")
        let teamData = operationData[pid_from].teams[tid]
        delete operationData[pid_from].teams[tid]
        operationData[pid_from].teamArgArray.splice(operationData[pid_from].teamArgArray.indexOf(tid),1)
        console.log(operationData)
        firebase.database().ref("operation/"+date+"/"+pid_from+"/teams/"+tid).remove();
        firebase.database().ref("operation/"+date+"/"+pid_to+"/teams/"+tid).set(teamData);
        normalMode()
    }
}
