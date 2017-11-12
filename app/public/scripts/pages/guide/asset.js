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


function draw_guide_asset(data){
    console.log(data)
    let txt = ""
    for (let key in data) {
        let guideName = data[key].name
        txt+='<div class="ga_div"><p class="ga_name">'+guideName+'</p><p class="ga_asset">'
        if(data[key].asset){
            for (let assetName in data[key].asset) {
                txt+=assetName+" "+data[key].asset[assetName].left+"/"+data[key].asset[assetName].got+" "
            }
        }
        txt+='</p></div>'
    }
    $(".g_wrapper_asset").html(txt)
}
