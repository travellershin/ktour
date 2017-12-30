let change = {};
let old = {};

$(".m_people_data").on("keyup","input",function(){
    change = {
        key:$(this).parent().attr("id"),
        mail:$(this).parent().children(".MP_mail").val(),
        password:$(this).parent().children(".MP_password").val(),
        grade:$(this).parent().children(".MP_grade").val()
    };
    old = m_authData[change.key];
    if(old.mail===change.mail&&old.password===change.password&&old.grade===change.grade*1){
        $("#m_c_"+change.key).remove();
    }else{
        if($("#m_c_"+change.key).length === 0){
            let txt = "<div class='m_c_box' id='m_c_"+change.key+"'><p class='m_c_save'>SAVE</p><p class='m_c_return'>CANCEL</p></div>";
            $("#"+change.key).append(txt);
        }
    }
})
