let change = {};
let old = {};

$(".m_people_data").on("keyup","input",function(){
    change = {
        key:$(this).parent().attr("id"),
        mail:$(this).parent().children(".MP_mail").val(),
        password:$(this).parent().children(".MP_password").val(),
        grade:$(this).parent().children(".MP_grade").val()*1
    };
    old = m_authData[change.key];
    if(old.mail===change.mail&&old.password===change.password&&old.grade===change.grade){
        $("#m_c_"+change.key).remove();
    }else{
        if($("#m_c_"+change.key).length === 0){
            let txt = "<div class='m_c_box' id='m_c_"+change.key+"'><p class='m_c_save'>SAVE</p><p class='m_c_return'>CANCEL</p></div>";
            $("#"+change.key).append(txt);
        }
    }
    if(change.grade*1>2&&old.grade<3){
        toast("경고. 높은 등급이 부여되었습니다.")
    }
})

$(".m_people_data").on("click",".m_c_save",function(){
    let key = $(this).parent().attr("id").slice(4);
    if(key in gData){
        if(old.mail!==change.mail){
            if(confirm("가이드의 메일이 변경되었습니다. 정말 저장할까요?")){
                save_guide(key);
            }
        }else{
            save_auth(key);
        }
    }else{
        save_auth(key);
    }
})

function save_guide(key){
    firebase.database().ref("guide/"+key+"/email").set(change.mail);
    save_auth(key);
}

function save_auth(key){
    firebase.database().ref("auth/"+key).update(change);
    toast("저장되었습니다")
}

$(".m_people_data").on("click",".m_c_return",function(){
    console.log(old);
    $(this).parent().parent().children(".MP_mail").val(old.mail);
    $(this).parent().parent().children(".MP_password").val(old.password);
    $(this).parent().parent().children(".MP_grade").val(old.grade);
    $(this).parent().remove();

})
