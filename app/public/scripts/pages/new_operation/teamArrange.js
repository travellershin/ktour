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

    let moveData = []

    for (let i = 0; i < $(".omp_team--selected").length; i++) {
        let pid_from = $(".omp_team--selected").eq(i).attr("pid")
        let tid = $(".omp_team--selected").eq(i).attr("tid")
        let teamData = operation[pid_from].teams[tid]
        delete operation[pid_from].teams[tid]
        operation[pid_from].teamArgArray.splice(operation[pid_from].teamArgArray.indexOf(tid),1)

        moveData.push([pid_from,tid,teamData])
    }

    for (let i = 0; i < moveData.length; i++) {
        let pid_from = moveData[i][0]
        let tid = moveData[i][1]
        let teamData = moveData[i][2]

        console.log(teamData)

        for (let rev in teamData.reservations) {
            teamData.reservations[rev].memo = "["+pid_from.split("_")[2]+ "] "+ teamData.reservations[rev].memo;
            teamData.reservations[rev].product = pid_to;
        }

        firebase.database().ref("operation/"+date+"/"+pid_from+"/teams/"+tid).remove();
        firebase.database().ref("operation/"+date+"/"+pid_to+"/teams/"+tid).set(teamData);
    }

    normalMode()
}
