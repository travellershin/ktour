let GIArray = ["name","start","end","email","phone","account","address","card","memo"]//가이드 정보 중 string 형태로 저장되는 정qh
let file = {}
let fileChanged = false;

$(".g_e_lang").click(function(){
    $(this).toggleClass("g_e_lang--checked")
})
$(".g_e_prefer").click(function(){
    $(this).toggleClass("g_e_prefer--checked")
})
$(".g_e_header_close").click(function(){
    $("body").css("overflow","auto")
    $(".pop_blackScreen").addClass("hidden");
})
$(".g_card_box").on("click",".g_card",function(){
    gInfo_detail($(this).attr("gid"))
})
$(".g_e_footer_save").click(function(){
    gInfo_save($(this).attr("gid"))
})
$(".g_e_footer_delete").click(function(){
    gInfo_delete($(".g_e_footer_save").attr("gid"))
})
$(".g_add").click(function(){
    gInfo_new();
})
$(".toggleGuide").click(function(){
    if($(this).html()==="VIEW ASSET"){
        $(".ga_box").removeClass("hidden");
        $(".g_card_box").addClass("hidden");
        $(".g_filter").addClass("hidden");
        $(".orderAsset").removeClass("hidden");
        $(this).html("VIEW INFO");
    }else{
        $(".ga_box").addClass("hidden");
        $(".g_card_box").removeClass("hidden");
        $(".g_filter").removeClass("hidden");
        $(".orderAsset").addClass("hidden");
        $(this).html("VIEW ASSET");
    }
})
$(".orderAsset").click(function(){
    $(".lightbox_guide").removeClass("hidden");
})
$(".lightbox_guide").click(function(){
    $(this).addClass("hidden");
})
$(".ga_filter").click(function(){
    return false;
})

function gInfo_detail(gid){
    $("body").css("overflow","hidden")
    $(".pop_blackScreen").removeClass("hidden");
    $(".g_e_body").scrollTop(0);
    $(".g_e_footer_save").attr("gid",gid)

    let data = guideData[gid]

    for (let i = 0; i < GIArray.length; i++) {
        $(".g_e_input_"+GIArray[i]).html(data[GIArray[i]])
    }
    $(".g_e_lang").removeClass("g_e_lang--checked");
    $(".g_e_prefer").removeClass("g_e_prefer--checked");

    if(data.language){
        $(".g_e_lang_box").html(data.language.toString())
    }
    if(data.preferDay){
        $(".g_e_prefer_box").html(data.preferDay.toString())
    }
    if(data.driver){
        $(".g_e_input_driver").html("O")
    }else{
        $(".g_e_input_driver").html("X")
    }

}

function gInfo_new(){
    $("body").css("overflow","hidden")
    let gid = firebase.database().ref().push().key
    $(".g_e_footer_save").attr("gid",gid)
    $(".pop_blackScreen").removeClass("hidden");
    $(".g_e_body").scrollTop(0);

    $(".g_e_face").attr("src","")

    for (let i = 0; i < GIArray.length; i++) {
        $(".g_e_input_"+GIArray[i]).val("")
    }
    $(".g_e_lang").removeClass("g_e_lang--checked");
    $(".g_e_prefer").removeClass("g_e_prefer--checked");
    $(".g_e_input_driver").val("X");

    guideData[gid] = {}

}

function gInfo_delete(gid){

    console.log(gid)

    if(prompt("정말 삭제하시려면 가이드 이름을 다시 한 번 입력해주세요") === guideData[gid].name){
        firebase.storage().ref("guides/"+gid).delete();
        firebase.database().ref("guide/"+gid).remove();
        toast("가이드 정보가 삭제되었습니다.");
        $(".pop_blackScreen").addClass("hidden");
        $("body").css("overflow","auto")
    }else{
        toast("이름을 잘못 입력했습니다.")
    }
}

function gInfo_save(gid){

    for (let i = 0; i < GIArray.length; i++) {
        guideData[gid][GIArray[i]] = $(".g_e_input_"+GIArray[i]).val();
    }
    guideData[gid].language = [];
    guideData[gid].preferDay = [];

    if($(".g_e_number").val().length === 0){
        guideData[gid].vNo = 100;
    }else{
        guideData[gid].vNo = $(".g_e_number").val();
    }

    guideData[gid].key = gid;

    for (let i = 0; i < $(".g_e_lang--checked").length; i++) {
        guideData[gid].language.push($(".g_e_lang--checked").eq(i).attr("id").split("_")[1])
    }
    for (let i = 0; i < $(".g_e_prefer--checked").length; i++) {
        guideData[gid].preferDay.push($(".g_e_prefer--checked").eq(i).html())
    }

    if(guideData[gid].language.length ===0 ){
        delete guideData[gid].language
    }
    if(guideData[gid].preferDay.length ===0 ){
        delete guideData[gid].preferDay
    }

    if($(".g_e_input_driver").val()==="O"){
        guideData[gid].driver = true
    }else{
        guideData[gid].driver = false
    }

    delete guideData[gid].schedule

    console.log(guideData[gid])

    let forAuth = {
        mail:guideData[gid].email,
        name:guideData[gid].name
    }


    if(fileChanged){
        toast("이미지를 업로드 중입니다");

        firebase.storage().ref("guides/"+gid).put(file).then(function(snapshot) {
            firebase.storage().ref("guides/"+gid).getDownloadURL().then(function(url){
                guideData[gid].imgUrl = url
                firebase.database().ref("guide/"+gid).update(guideData[gid]);
                firebase.database().ref("auth/"+gid).update(forAuth);
                fileChanged = false;
                toast("정보 저장 완료");
                $(".pop_blackScreen").addClass("hidden");
                $("body").css("overflow","auto")
            })
        });

    }else{
        firebase.database().ref("guide/"+gid).update(guideData[gid]);
        firebase.database().ref("auth/"+gid).update(forAuth);
        toast("정보 저장 완료");
        $(".pop_blackScreen").addClass("hidden");
        $("body").css("overflow","auto");
    }
}

let faceCap = {}

function uploadGuide(files) {

    file = files[0];
    let reader = new FileReader();

    reader.onload = function (e) {
            $(".g_e_face").attr("src",e.target.result);
            fileChanged = true;
    }
    reader.readAsDataURL(file);
}
