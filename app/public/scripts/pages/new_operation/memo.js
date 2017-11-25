$(".o_memo").keyup(function(){
    firebase.database().ref("memo/"+date).set($(".o_memo_first").val()+"^&*&^"+$(".o_memo_second").val())
})

function inflateMemo(memo){
    if(memo){
        let txt = memo.split("^&*&^");
        $(".o_memo_first").val(txt[0]);
        $(".o_memo_second").val(txt[1]);
    }else{
        $(".o_memo_first").val("");
        $(".o_memo_second").val("");
    }
}
