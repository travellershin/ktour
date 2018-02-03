$(".toggleGuide").click(function(){
    if($(this).html()==="VIEW ASSET"){
        $(this).html("VIEW INFO");
        $(".g_filter_wrapper").addClass("hidden")
        $(".g_wrapper_info").addClass("hidden")
        $(".g_wrapper_asset").removeClass("hidden")
        $(".g_add").addClass("hidden")
    }else{
        $(this).html("VIEW ASSET");
        $(".g_filter_wrapper").removeClass("hidden")
        $(".g_wrapper_info").removeClass("hidden")
        $(".g_wrapper_asset").addClass("hidden")
        $(".g_add").removeClass("hidden")
    }
})
