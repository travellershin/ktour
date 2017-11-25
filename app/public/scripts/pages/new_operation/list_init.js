function show_list(pid){
    lastRendering.product = pid
    lastRendering.order = []
    lastRendering.bus = 0

    console.log(operation)
    console.log(lastRendering)

    $(".om").addClass("hidden");
    $(".ol_return").removeClass("hidden")
    $(".ol").removeClass("hidden")
    $(".ol_title").html(pid)
    $(".o_header_date").addClass("hidden");
    $(".o_header_quick").addClass("hidden");
    $(".o_header_change").addClass("hidden")

    filter_selected = {
        agency:[],
        pickupPlace:[],
        nationality:[]
    }
    filter_adjusted = {
        agency:[],
        pickupPlace:[],
        nationality:[]
    }

    inflate_listTop()
    inflate_reservation()
}



function inflate_listTop(){

    console.log(lastRendering.product)

    let pid = $(".ol_title").html()

    // TODO: 어떤 버스를 보고있었는지에 따라 선택하기

    let data = operation[pid]
    let bustxt = "";
    let busEditTxt = "";
    console.log(data)
    if(lastRendering.bus===0){
        bustxt+='<div class="ol_bus_total ol_bus_box--selected ol_bus_box"><p class="ol_bus_total_txt">TOTAL</p><p class="ol_bus_total_number">'+data.people+'</p></div>'
    }else{
        bustxt+='<div class="ol_bus_total ol_bus_box"><p class="ol_bus_total_txt">TOTAL</p><p class="ol_bus_total_number">'+data.people+'</p></div>'
    }


    let filter_pickupPlace = new Set(); //필터 이름
    let filter_nationality = new Set(); //필터 이름
    let filter_agency = new Set(); //필터 이름

    for (let i = 0; i < data.teamArgArray.length; i++) {
        busEditTxt += '<p class="ol_busEdit_bus" tid="'+data.teamArgArray[i]+'">BUS '+(i+1)+'</p>'

        for (let revkey in data.teams[data.teamArgArray[i]].reservations) {
            let reservation_data = data.teams[data.teamArgArray[i]].reservations[revkey];

            reservation_data.team = data.teamArgArray[i];
            reservation_data.busNumber = i+1;

            filter_pickupPlace.add(reservation_data.pickupPlace)
            filter_nationality.add(reservation_data.nationality)
            filter_agency.add(reservation_data.agency)
        }

        if(lastRendering.bus===i+1){
            bustxt+='<div class="ol_bus_team ol_bus_box ol_bus_box--selected" tid="'+data.teamArgArray[i]+'"><div class="ol_bus_team_left"><p class="ol_bus_team_busno">BUS '+(i+1)+'</p>'
        }else{
            bustxt+='<div class="ol_bus_team ol_bus_box" tid="'+data.teamArgArray[i]+'"><div class="ol_bus_team_left"><p class="ol_bus_team_busno">BUS '+(i+1)+'</p>'
        }


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

    filter = {
        agency:Array.from(filter_agency.keys()),
        pickupPlace:Array.from(filter_pickupPlace.keys()),
        nationality:Array.from(filter_nationality.keys())
    }

    let txt = {
        agency:"",
        pickupPlace:"",
        nationality:""
    }

    $(".r_drop").html("")
    for (let kind in filter) {
        for (let i = 0; i < filter[kind].length; i++) {
            if(filter_selected[kind].includes(filter[kind][i])){
                txt[kind]+="<p class='rf_selected'>"+filter[kind][i]+"</p>"
            }else{
                txt[kind]+="<p>"+filter[kind][i]+"</p>"
            }
        }
        $(".r_drop_"+kind).html(txt[kind])
    }

    $(".ol_busEdit_busbox_box").html(busEditTxt)

    bustxt+='<div class="ol_bus_add ol_bus_box"><img src="./assets/icon-add.svg"/><p>ADD NEW BUS</p></div>'
    $(".ol_bus").html(bustxt)

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
    $(".ol_return").addClass("hidden");
    isEditing = false;
    viewing = ""
}
