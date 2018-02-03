let order = [];
let orderAuth = new OrderAuth;

$(".m_people_title_name").click(function(){
    if(order[order.length-1]==="nameAsc"){
        order.push("nameDes")
    }else{
        order.push("nameAsc")
    }
    inflate()
})
$(".m_people_title_grade").click(function(){
    if(order[order.length-1]==="gradeAsc"){
        order.push("gradeDes")
    }else{
        order.push("gradeAsc")
    }
    inflate()
})

function OrderAuth(){
    this.nameDes = function(){
        iArray.sort(function(a,b){
            return a.name < b.name ? 1 : a.name > b.name ? -1 : 0;
        })
    }
    this.nameAsc = function(){
        iArray.sort(function(a,b){
            return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
        })
    }
    this.gradeDes = function(){
        iArray.sort(function(a,b){
            return a.grade < b.grade ? -1 : a.grade > b.grade ? 1 : 0;
        })
    }
    this.gradeAsc = function(){
        iArray.sort(function(a,b){
            return a.grade < b.grade ? 1 : a.grade > b.grade ? -1 : 0;
        })
    }
}

function inflate(){
    console.log(iArray)
    let txt = "";
    for (let i = 0; i < order.length; i++) {
        orderAuth[order[i]]();
    }
    for (var i = 0; i < iArray.length; i++) {
        let d = iArray[i];
        txt+='<div class="MP_liner" id='+d.key+'><div class="MP_top"><p class="MP_name">'+d.name+'</p>'
        if(d.grade){
            txt+='<input spellcheck="false" class="MP_grade" type="number" value="'+d.grade+'"></div>'
        }else{
            txt+='<input spellcheck="false" class="MP_grade" type="number" value="0"></div>'
        }
        txt+='<div class="MP_bottom"><input spellcheck="false" class="MP_mail" value="'+d.mail+'">'
        txt+='<input spellcheck="false" class="MP_password" value="'+d.password+'"></div></div>'

    }
    $(".m_people_data").html(txt)
}
