$(document).ready(function(){
    if(window.localStorage["ktlkey"]){
        let loginKey = window.localStorage["ktlkey"];
        let loginToken = window.localStorage["ktltoken"];
        firebase.database().ref("auth").once("value", snap => {
            adata = snap.val();
            if(adata[loginKey].token === loginToken && adata[loginKey].validdate === datestring.today() && adata[loginKey].grade>0){
                inflate_pickup();
                console.log("login okay");
                if(adata[loginKey].grade === 4){
                    $(".header>ul").append("<li class='header_pageLinks header_singlelink'>MASTERPAGE</li>")
                }
            }else{
                location.href = './index.html'
            }
        });
    }else{
        location.href = './index.html'
    }
})
$(document).on("click",".pickup_addCity",function(){
    add_city();
});
$(document).on("click",".pickup_place_possibleBox",function(){
    $(this).children(".pickup_possible_new").focus()
})
$(document).on("keydown",".pickup_possible_new",function(){
    if(event.which === 13){
        add_possible($(this));
    }
})
$(document).on("click",".pickup_possible_close",function(){
    $(this).parent().addClass("hidden")
})
$(document).on("click",".pickup_place_new",function(){
    add_place($(this))
})
$(".pickup_save").click(function(){
    pickup_save();
})

let citydata = {}

function inflate_pickup(){
    firebase.database().ref("place/city").on("value", snap => {
        citydata = snap.val();
        let txt = ""

        for (let city in citydata) {
            txt+='<div class="pickup_cityBox"><input class="pickup_cityName" value="'+city+'" placeholder="City Name" spellcheck="false"/><div class="pickup_placebox2">';

            for (let place in citydata[city]) {
                txt+='<div class="pickup_placeBox"><input class="pickup_place" value="'+place+'" placeholder="Pickup Place" spellcheck="false"/><div class="pickup_place_possibleBox"><div class="pickup_place_possibleBox2">'

                for (var i = 0; i < citydata[city][place].length; i++) {
                    txt+='<div class="pickup_possible"><p class="pickup_possible_txt">'+citydata[city][place][i]+'</p>'
                    txt+='<img class="pickup_possible_close" src="./assets/icon-close.svg"/></div>'
                }

                txt+='</div><input class="pickup_possible_new" city="'+city+'" place="'+place+'"/></div></div>'
            }
            txt+='</div><p class="pickup_place_new">+ Add Pickup Place</p></div>'
        }

        $(".pickup").html(txt)

    });
}

function add_possible(div){
    if($(div).val().length>0){
        let txt = ""
        txt+='<div class="pickup_possible"><p class="pickup_possible_txt">'+$(div).val()+'</p>'
        txt+='<img class="pickup_possible_close" src="./assets/icon-close.svg"/></div>'

        $(div).siblings(".pickup_place_possibleBox2").append(txt);
        $(div).val("")
    }
}

function add_city(){
    let txt = "";

    txt+='<div class="pickup_cityBox"><input class="pickup_cityName" value="" placeholder="City Name" spellcheck="false"/>';
    txt+='<div class="pickup_placebox2"><div class="pickup_placeBox"><input class="pickup_place" value="" placeholder="Pickup Place" spellcheck="false"/><div class="pickup_place_possibleBox">'
    txt+='<div class="pickup_place_possibleBox2"></div><input class="pickup_possible_new"/></div></div><p class="pickup_place_new">+ Add Pickup Place</p></div></div>'

    $(".pickup").append(txt)
}

function add_place(div){
    let txt = "";

    txt+='<div class="pickup_placeBox"><input class="pickup_place" value="" placeholder="Pickup Place" spellcheck="false"/><div class="pickup_place_possibleBox"><div class="pickup_place_possibleBox2">'
    txt+='</div><input class="pickup_possible_new"/></div></div>'

    $(div).siblings(".pickup_placebox2").append(txt)
}

function pickup_save(){
    for (let i = 0; i < $(".pickup_cityName").length; i++) {
        let city = $(".pickup_cityName").eq(i).val()
        citydata[city] = {};

        for (var j = 0; j < $(".pickup_placebox2").eq(i).find(".pickup_place").length; j++) {
            let pickupPlace = $(".pickup_placebox2").eq(i).find(".pickup_place").eq(j).val();

            if(pickupPlace.length>0){
                citydata[city][pickupPlace] = [];

                for (var k = 0; k < $(".pickup_placebox2").eq(i).find(".pickup_place_possibleBox").eq(j).find(".pickup_possible_txt").length; k++) {
                    if(!$(".pickup_placebox2").eq(i).find(".pickup_place_possibleBox").eq(j).find(".pickup_possible").eq(k).hasClass("hidden")){
                        let possibles = $(".pickup_placebox2").eq(i).find(".pickup_place_possibleBox").eq(j).find(".pickup_possible_txt").eq(k).html();
                        citydata[city][pickupPlace].push(possibles)
                    }
                }
            }
        }
    }
    firebase.database().ref("place/city").set(citydata).then(function(){
        alert("저장 완료")
    });
}
