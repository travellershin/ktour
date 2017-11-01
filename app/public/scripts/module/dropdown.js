
$(document).on("click",".dw_dropdown",function(event){
    let did = $(this).attr("id"); //드롭다운에 쭉 쓰일 id값

    if($(this).hasClass("drop_appended")){
        //dropdown이 달린 경우 - 열었다닫았다만

        $("#drop_"+did).toggleClass("display_none")

    }else{
        //dropdown 초기화
        $(this).addClass("drop_appended") //초기화되었음을 표시

        //overflow_hidden을 없애고 같은 역할을 하는 clearfix를 부여해 드롭다운이 보여질 수 있게 함
        $(this).parent().addClass("clearfix");
        $(this).parent().css("position","relative");
        $(this).parent().css("overflow","visible");

        //드롭다운 아이템들을 얻어서 append. item들은 이벤트 리스너를 위한 drop_item 클래스, 구분을 위한 did attr을 가지고있음
        let item = $(this).attr("dropitem").split(",")
        let appendTxt = "<div class='dropbox' id='drop_"+did+"'>"
        for (var i = 0; i < item.length; i++) {
            item[i] = item[i].trim();
            appendTxt+="<p class='drop_item' did='"+did+"'>"+item[i]+"</p>"
        }
        appendTxt+="</div>"
        $(this).after(appendTxt)
        console.log($(this).position().left)
        $("#drop_"+did).css({
            "left":$(this).position().left +"px",
            "top":$(this).position().top +40 +"px",
            "width":$(this).css("width").slice(0,-2)*1+"px"
        })
    }
})

$(document).on("click",".dw_dndropdown",function(){
    let did = $(this).attr("id"); //드롭다운에 쭉 쓰일 id값
    $("#drop_"+did).toggleClass("display_none")
})

function dynamicDrop(div,item){
    let did = $(div).attr("id"); //드롭다운에 쭉 쓰일 id값

    $(div).addClass("drop_appended") //초기화되었음을 표시

    //overflow_hidden을 없애고 같은 역할을 하는 clearfix를 부여해 드롭다운이 보여질 수 있게 함
    $(div).parent().addClass("clearfix");
    $(div).parent().css("position","relative");
    $(div).parent().css("overflow","visible");

    //드롭다운 아이템들을 얻어서 append. item들은 이벤트 리스너를 위한 drop_item 클래스, 구분을 위한 did attr을 가지고있음

    let appendTxt = "<div class='dropbox display_none' id='drop_"+did+"'>"
    for (var i = 0; i < item.length; i++) {
        item[i] = item[i].trim();
        appendTxt+="<p class='drop_item' did='"+did+"'>"+item[i]+"</p>"
    }
    appendTxt+="</div>"
    $(div).after(appendTxt)

    $("#drop_"+did).css({
        "left":$(div).position().left +"px",
        "top":"40px"
    })

    //요 프로젝트에서만 쓰는녀석
    if($(div).hasClass("r_hbot_product")){
        $("#drop_"+did).css({
            "left":"190px"
        })
    }else if($(div).hasClass("r_hbot_nationality")){
        $("#drop_"+did).css({
            "left":"1000px"
        })
    }

}

$(document).on("click",".drop_item",function(){
    let did = $(this).attr("did");
    if(!$("#"+did).hasClass("multiselect")){
        $("#drop_"+did).addClass("display_none");
        $("#"+did).val($(this).html());
        $("#"+did).attr("value",$(this).html());
    }

})

$(document).on("click",".dw_radio",function(){
    $(this).parent().children(".dw_radio").removeClass("dw_radio_selected")
    $(this).addClass("dw_radio_selected");
    $(this).parent().attr("rstat",$(this).html())
})
