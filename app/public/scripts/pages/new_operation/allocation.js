function allocation_show_total(){
    lastRendering.bus = 0;
    $(".ol_bus_box").removeClass("ol_bus_box--selected")
    $(".ol_bus_total").addClass("ol_bus_box--selected")
    inflate_reservation()
}

function allocation_show_indi(div){
    $(".ol_bus_box").removeClass("ol_bus_box--selected")
    $(div).addClass("ol_bus_box--selected")
    inflate_reservation()
}
