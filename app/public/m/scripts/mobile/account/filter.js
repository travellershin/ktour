$(".a_filter").click(function(){
    $(".a_lightBox").removeClass("hidden");
})
$(".a_lightBox").click(function(){
    $(this).addClass("hidden");
})
$(".a_hbot").click(function(){
    return false;
})

$(".a_hbot").on("click",".drop_item",function(){ //드롭다운 하위 선택지(필터) 클릭
    set_filter($(this))
})

$(".a_hbot_category").click(function(){
    $(".a_drop_category").toggleClass("hidden")
})
$(".a_hbot_writer").click(function(){
    $(".a_drop_writer").toggleClass("hidden")
})


let filter = { //전체필터
    writer : [],
    category : []
};

let selFilter = { //사용자가 선택한 필터
    writer : [],
    category : []
}


function filter_account(){

    let filter_writer = new Set(); //필터 이름
    let filter_category = new Set(); //필터 이름

    for (let i = 0; i < account.length; i++) {
        filter_writer.add(account[i].writer);
        filter_category.add(account[i].category);
    }
    filter.writer = Array.from(filter_writer)
    filter.category = Array.from(filter_category)


    let txt = "";
    for (let i = 0; i < filter.writer.length; i++) {
        if(selFilter.writer.includes(filter.writer[i])){
            txt+='<p class="drop_item af_selected">'+filter.writer[i]+'</p>';
        }else{
            txt+='<p class="drop_item">'+filter.writer[i]+'</p>';
        }
    }
    $(".a_drop_writer").html(txt);

    txt = "";
    for (let i = 0; i < filter.category.length; i++) {
        txt+='<p class="drop_item">'+filter.category[i]+'</p>';
    }
    $(".a_drop_category").html(txt);

    console.log(filter)
    set_for_inflate();
}


function set_filter(div){
    let fid = $(this).parent().attr("fid") //어떤 종류의 필터가 선택되었는가!
    $(div).toggleClass("af_selected"); //필터를 선택하거나 해제함

    selFilter.category = [];
    selFilter.writer = []

    for (let i = 0; i < $(".af_selected").length; i++) {
        selFilter[$(".af_selected").eq(i).parent().attr("fid")].push($(".af_selected").eq(i).html())
    }

    set_for_inflate()
}
