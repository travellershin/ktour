
function inflate(){
    console.log(iArray)
    let txt = "";
    for (var i = 0; i < iArray.length; i++) {
        let d = iArray[i]
        txt+='<div class="MP_liner" id='+d.key+'><p class="MP_name">'+d.name+'</p><input spellcheck="false" class="MP_mail" value="'+d.mail+'">'
        txt+='<input spellcheck="false" class="MP_password" value="'+d.password+'">'
        if(d.grade){
            txt+='<input spellcheck="false" class="MP_grade" type="number" value="'+d.grade+'"></div>'
        }else{
            txt+='<input spellcheck="false" class="MP_grade" type="number" value="0"></div>'
        }
    }
    $(".m_people_data").html(txt)
}
