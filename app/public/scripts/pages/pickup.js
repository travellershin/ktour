$(document).ready(function(){
    inflate_pickup();
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

let citydata = {}

function inflate_pickup(){
    firebase.database().ref("place/city").on("value", snap => {
        citydata = snap.val();
        console.log(citydata)
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
    txt+='<div class="pickup_placeBox"><input class="pickup_place" value="" placeholder="Pickup Place" spellcheck="false"/><div class="pickup_place_possibleBox">'
    txt+='<input class="pickup_possible_new"/></div></div><p class="pickup_place_new">+ Add Pickup Place</p></div>'

    $(".pickup").append(txt)
}

function add_place(div){
    let txt = "";

    txt+='<div class="pickup_placeBox"><input class="pickup_place" value="" placeholder="Pickup Place" spellcheck="false"/><div class="pickup_place_possibleBox"><div class="pickup_place_possibleBox2">'
    txt+='</div><input class="pickup_possible_new"/></div></div>'

    $(div).siblings(".pickup_placebox2").append(txt)

}
