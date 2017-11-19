function init_list(pid){
    inflate_listTop(pid)
    inflate_reservation(r_totalArray)
}


function inflate_listTop(pid){
    $(".om").addClass("hidden");
    $(".ol_return").removeClass("hidden")
    $(".ol").removeClass("hidden")
    $(".ol_title").html(pid)
    $(".o_header_date").addClass("hidden");
    $(".o_header_quick").addClass("hidden");
    $(".o_header_change").addClass("hidden")
    viewing = pid;

    let data = operation[pid]
    let bustxt = "";
    let busEditTxt = "";

    r_obj = {}
    r_teamArray = []
    r_totalArray = []

    bustxt+='<div class="ol_bus_total ol_bus_box"><p class="ol_bus_total_txt">TOTAL</p><p class="ol_bus_total_number">'+data.people+'</p></div>'

    for (let i = 0; i < data.teamArgArray.length; i++) {
        busEditTxt += '<p class="ol_busEdit_bus" tid="'+data.teamArgArray[i]+'">BUS '+(i+1)+'</p>'

        for (let revkey in data.teams[data.teamArgArray[i]].reservations) {
            let reservation_data = data.teams[data.teamArgArray[i]].reservations[revkey];

            reservation_data.team = data.teamArgArray[i];
            reservation_data.busNumber = i+1;

            r_obj[revkey] = reservation_data;
            r_totalArray.push(reservation_data)

            if(r_teamArray[i]){
                r_teamArray[i].push(reservation_data)
            }else{
                r_teamArray[i] = [reservation_data]
            }
        }


        bustxt+='<div class="ol_bus_team ol_bus_box" tid="'+data.teamArgArray[i]+'"><div class="ol_bus_team_left"><p class="ol_bus_team_busno">BUS '+(i+1)+'</p>'
        if(data.teams[data.teamArgArray[i]].guide){
            bustxt+='<p class="ol_bus_team_guide" title="'
            for (let j = 0; j < data.teams[data.teamArgArray[i]].guide.length; j++) {
                bustxt+=guideData[data.teams[data.teamArgArray[i]].guide[j]].name + ", "
            }
            bustxt = bustxt.slice(0,-2) +'">'
            for (let j = 0; j < data.teams[data.teamArgArray[i]].guide.length; j++) {
                bustxt+=guideData[data.teams[data.teamArgArray[i]].guide[j]].name + ", "
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

    console.log(r_obj)
    console.log(r_totalArray)
    console.log(r_teamArray)
}



function viewOperationMain(){
    $(this).addClass("hidden");
    $(".ol").addClass("hidden");
    $(".om").removeClass("hidden");
    $(".ol_busEdit").addClass("hidden");
    $(".ol_unSelect").addClass("hidden");
    $(".ol_selectAll").addClass("hidden");
    $(".ol_editBus").removeClass("hidden");
    $(".o_header_date").removeClass("hidden");
    $(".o_header_quick").removeClass("hidden");
    $(".o_header_change").removeClass("hidden")
    $(".ol_bus_total").addClass("ol_bus_box--selected");
    isEditing = false;
    viewing = ""
}
