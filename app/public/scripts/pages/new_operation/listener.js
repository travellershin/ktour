//Operation Main Page 상단부터//

$(".o_header_quick>p").click(function(){ //date quick select
    getQuickDate($(this).attr("id"),$(this)) //dataCollect.js
})

$(".om").on("click",".omp_team",function(){ //product 내부의 각 팀(버스)를 클릭
    if($(".o_header_change").html() === "팀 이동"){
        teamPop($(this),event); //팀 상세정보 teamManage.js
    }else{
        selectTeamForMove($(this)); //팀 옮기기 위해 선택 teamManage.js
    }
})
$(".om_pop").click(function(){ //team popup창 내부 클릭
    return false; //메모 등을 복붙할 때 창이 꺼지지 않게 하기 위해 이벤트 전파 방지
})
$(".omp_edit").click(function(){
    editTeam($(this)); //teamManage.js
})
$(".obe_header_close").click(function(){
    closeTeam(); //teamManage.js
})
$(".obe_body").on("click",".drop_item",function(){
    if($(this).attr("did") === "op_bus_company"){
        changeBusCompany($(this).html())
    }
    if($(this).attr("did").slice(0,-1) === "op_guide"){
        arrangeGuide($(this));
    }
})
$(document).on("click",".obe_footer_save",function(){
    saveTeam($(this));
})


$(document).on("click",".drop_item",function(){

    if($(this).attr("did").split("_")[0] === "r"){
        filter_set($(this))
        $(".ol_bus_box").removeClass("ol_bus_box--selected")
        $(".ol_bus_total").addClass("ol_bus_box--selected")
    }
})



$(".om").on("click",".omp_list",function(){ //product list 보러가기(배차화면)
    show_list($(this).attr("pid")); //list_init.js (함수명과 파일명 앞뒤가 달라서 유감)
})



//list Page 상단부터
$(".ol_return").click(function(){
    viewOperationMain(); //list 보기를 중단하고 메인으로 돌아옴 list_init.js
})
$(".ol_bus").on("click",".ol_bus_total",function(){
    allocation_show_total();
})
$(".ol_bus").on("click",".ol_bus_team",function(){
    if($(this).hasClass("ol_bus_box--selected")){ //버스정보 보기
        $(this).attr("pid",$(".ol_title").html())
        $(this).attr("busno",$(".ol_bus_team").index($(this))+1)
        editTeam($(this))
    }else{
        lastRendering.bus = $(".ol_bus_team").index($(this))+1
        allocation_show_indi($(this)); //개별 팀의 예약정보 보기
    }
})

//정렬 클릭
$(".r_hbot_people").click(function(){
    if(lastRendering.order[lastRendering.order.length-1]==="peopleAsc"){
        lastRendering.order.push("peopleDes")
    }else{
        lastRendering.order.push("peopleAsc")
    }
    inflate_reservation()
})
$(".r_hbot_name").click(function(){
    if(lastRendering.order[lastRendering.order.length-1]==="nameAsc"){
        lastRendering.order.push("nameDes")
    }else{
        lastRendering.order.push("nameAsc")
    }
    inflate_reservation()
})
$(".op_hbot_bus").click(function(){
    if(lastRendering.order[lastRendering.order.length-1]==="busAsc"){
        lastRendering.order.push("busDes")
    }else{
        lastRendering.order.push("busAsc")
    }
    inflate_reservation()
})





$("body").click(function(){
    closePops();
})
function closePops(){
    $(".om_pop").addClass("hidden");
}
