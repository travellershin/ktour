let natdata = {}

$(document).ready(function(){
    inflate_nationality();
})
$(document).on("click",".pickup_addCountry",function(){
    add_nationality();
});
$(document).on("keydown",".input_nat_possible_new",function(){
    if(event.which === 13){
        add_possible($(this));
    }
})
$(document).on("click",".input_nat_possible_close",function(){
    $(this).parent().addClass("hidden")
})
$(".pickup_save").click(function(){
    nationality_save();
})
$(document).on("click",".input_nat_possibleDiv",function(){
    $(this).find(".input_nat_possible_new").focus()
})

function inflate_nationality(){
    firebase.database().ref("place/nationality").on("value", snap => {
        natdata = snap.val();
        let txt = ""

        for (let nat in natdata) {
            txt+='<div class="nat_box"><input class="input_nat" nid="'+nat+'" value="'+natdata[nat].place+'" placeholder="Nationality" spellcheck="false"/>';
            txt+='<div class="input_nat_possibleDiv"><div class="input_nat_possibleBox">'

            for (let i = 0; i < natdata[nat].possibles.length; i++) {
                txt+='<div class="input_nat_possible"><p class="input_nat_possible_txt">'+natdata[nat].possibles[i]+'</p>'
                txt+='<img class="input_nat_possible_close" src="./assets/icon-close.svg"/></div>'
            }

            txt+='</div><input class="input_nat_possible_new"/></div></div>'
        }

        $(".nat").html(txt)
    });
}

function add_possible(div){
    if($(div).val().length>0){
        let txt = ""
        txt+='<div class="input_nat_possible"><p class="input_nat_possible_txt">'+$(div).val()+'</p>'
        txt+='<img class="input_nat_possible_close" src="./assets/icon-close.svg"/></div>'

        $(div).siblings(".input_nat_possibleBox").append(txt);
        $(div).val("")
    }
}

function add_nationality(){
    let txt = "";
    let key = firebase.database().ref().push().key

    txt+='<div class="nat_box"><input class="input_nat" nid="'+key+'" value="" placeholder="Nationality" spellcheck="false"/>'
    txt+='<div class="input_nat_possibleDiv"><div class="input_nat_possibleBox"></div><input class="input_nat_possible_new"/></div>'

    $(".nat").append(txt)

    $(".input_nat").eq($(".input_nat").length-1).focus()
}


function nationality_save(){
    for (let i = 0; i < $(".input_nat").length; i++) {
        let nat = $(".input_nat").eq(i).attr("nid")
        natdata[nat] = {place:"",possibles:[]};
        natdata[nat].place =$(".input_nat").eq(i).val()

        for (let j = 0; j < $(".nat_box").eq(i).find(".input_nat_possible").length; j++) {

            if(!$(".nat_box").eq(i).find(".input_nat_possible").eq(j).hasClass("hidden")){
                let possibles = $(".nat_box").eq(i).find(".input_nat_possible_txt").eq(j).html();
                natdata[nat].possibles.push(possibles)
            }
        }
    }
    firebase.database().ref("place/nationality").set(natdata).then(function(){
        alert("저장 완료")
    });
}
