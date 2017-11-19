function allocation_show_total(){
    lastRendering.bus = 0;
    inflate_reservation(r_totalArray)
    $(".ol_bus_box").removeClass("ol_bus_box--selected")
    $(".ol_bus_total").addClass("ol_bus_box--selected")
}

function allocation_show_indi(div){
    inflate_reservation(teamlist[$(".ol_bus_team").index($(div))])
    $(".ol_bus_box").removeClass("ol_bus_box--selected")
    $(div).addClass("ol_bus_box--selected")
}
