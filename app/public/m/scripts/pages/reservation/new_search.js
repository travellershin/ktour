let productFocus = -1;
let pickupFocus = -1;
let nationalityFocus = -1;
let agencyFocus = -1;

$(".r_add_input_product").keyup(function(event){
    if(event.keyCode === 40){
        if(productFocus < $(".r_add_pitem").length-1){
            productFocus++;
            $(".r_add_pitem").eq(productFocus-1).removeClass("r_add_pitem--Focused");
            $(".r_add_pitem").eq(productFocus).addClass("r_add_pitem--Focused");
            $(".r_add_input_product").val($(".r_add_pitem--Focused").html())
        }
    }else if(event.keyCode === 38){
        if(productFocus > 0){
            productFocus--;
            $(".r_add_pitem").eq(productFocus+1).removeClass("r_add_pitem--Focused");
            $(".r_add_pitem").eq(productFocus).addClass("r_add_pitem--Focused");
            $(".r_add_input_product").val($(".r_add_pitem--Focused").html())
        }else if(productFocus === 0){
            productFocus--;
            $(".r_add_pitem").eq(productFocus+1).removeClass("r_add_pitem--Focused");
            $(".r_add_input_product").select()
        }
    }else if(event.keyCode === 13){
        $(".r_add_input_product").val($(".r_add_pitem--Focused").html());
        let rcity = $(".r_add_pitem--Focused").html().split("_")[0];
        console.log(rcity)

        let picktxt = ""

        let firstPlaceSeoul = ["Myungdong","Dongdaemoon","Hongdae"];
        let firstPlaceBusan = ["Busan Station","Seomyun","Haeundae"]

        if(rcity==="Seoul"){
            console.log("서울가자")
            for (let i = 0; i < firstPlaceSeoul.length; i++) {
                picktxt+='<p class="r_add_placeItem">'+firstPlaceSeoul[i]+'</p>'
            }
            for (let place in cityData[rcity]) {
                if(!firstPlaceSeoul.includes(place)){
                    picktxt+='<p class="r_add_placeItem">'+place+'</p>'
                }
            };
        }else if(rcity==="Busan"){
            console.log("부산가자")
            for (let i = 0; i < firstPlaceBusan.length; i++) {
                picktxt+='<p class="r_add_placeItem">'+firstPlaceBusan[i]+'</p>'
            }
            for (let place in cityData[rcity]) {
                if(!firstPlaceBusan.includes(place)){
                    picktxt+='<p class="r_add_placeItem">'+place+'</p>'
                }
            };
        }
        productFocus = -1;
        pickupFocus = -1;
        $(".r_add_pickDrop").html(picktxt)
        $(".r_add_input_pickupPlace").focus()
        $(".r_add_pitem--Focused").removeClass("r_add_pitem--Focused")

    }else{
        inputSearch($(".r_add_input_product").val().toLowerCase())
    }
})


$(".r_add_input_pickupPlace").keyup(function(event){
    if(event.keyCode === 40){
        if(pickupFocus < $(".r_add_placeItem").length-1){
            pickupFocus++;
            $(".r_add_placeItem").eq(pickupFocus-1).removeClass("r_add_pitem--Focused");
            $(".r_add_placeItem").eq(pickupFocus).addClass("r_add_pitem--Focused");
        }
            console.log(pickupFocus)
    }else if(event.keyCode === 38){
        if(pickupFocus > 0){
            pickupFocus--;
            $(".r_add_placeItem").eq(pickupFocus+1).removeClass("r_add_pitem--Focused");
            $(".r_add_placeItem").eq(pickupFocus).addClass("r_add_pitem--Focused");
        }else if(pickupFocus === 0){
            pickupFocus--;
            $(".r_add_placeItem").eq(pickupFocus+1).removeClass("r_add_pitem--Focused");
        }
            console.log(pickupFocus)
    }else if(event.keyCode === 13){
        $(".r_add_input_pickupPlace").val($(".r_add_pitem--Focused").html());
        $(".r_add_pitem--Focused").removeClass("r_add_pitem--Focused");
        $(".r_add_input_people").focus();
        pickupFocus = -1;
            console.log(pickupFocus)
    }else{
        inputSearch($(".r_add_input_product").val().toLowerCase())
    }
})

$(".r_add_input_nationality").keyup(function(event){
    if(event.keyCode === 40){
        if(nationalityFocus < $(".r_add_nitem").length-1){
            nationalityFocus++;
            $(".r_add_nitem").eq(nationalityFocus-1).removeClass("r_add_pitem--Focused");
            $(".r_add_nitem").eq(nationalityFocus).addClass("r_add_pitem--Focused");
        }
    }else if(event.keyCode === 38){
        if(nationalityFocus > 0){
            nationalityFocus--;
            $(".r_add_nitem").eq(nationalityFocus+1).removeClass("r_add_pitem--Focused");
            $(".r_add_nitem").eq(nationalityFocus).addClass("r_add_pitem--Focused");
        }else if(nationalityFocus === 0){
            nationalityFocus--;
            $(".r_add_nitem").eq(nationalityFocus+1).removeClass("r_add_pitem--Focused");
        }
    }else if(event.keyCode === 13){
        $(".r_add_input_nationality").val($(".r_add_pitem--Focused").html());
        $(".r_add_pitem--Focused").removeClass("r_add_pitem--Focused");
        $(".r_add_input_agency").focus();
        $(".r_add_natDrop").addClass("hidden")
        nationalityFocus = -1;
    }else{
        natSearch($(".r_add_input_nationality").val().toLowerCase())
    }
})


$(".r_add_input_agency").keyup(function(event){
    if(event.keyCode === 40){
        if(nationalityFocus < $(".r_add_aitem").length-1){
            nationalityFocus++;
            $(".r_add_aitem").eq(nationalityFocus-1).removeClass("r_add_pitem--Focused");
            $(".r_add_aitem").eq(nationalityFocus).addClass("r_add_pitem--Focused");
        }
    }else if(event.keyCode === 38){
        if(nationalityFocus > 0){
            nationalityFocus--;
            $(".r_add_aitem").eq(nationalityFocus+1).removeClass("r_add_pitem--Focused");
            $(".r_add_aitem").eq(nationalityFocus).addClass("r_add_pitem--Focused");
        }else if(nationalityFocus === 0){
            nationalityFocus--;
            $(".r_add_aitem").eq(nationalityFocus+1).removeClass("r_add_pitem--Focused");
        }
    }else if(event.keyCode === 13){
        $(".r_add_input_agency").val($(".r_add_pitem--Focused").html());
        $(".r_add_pitem--Focused").removeClass("r_add_pitem--Focused");
        $(".r_add_input_memo").focus();
        $(".r_add_agencyDrop").addClass("hidden")
        nationalityFocus = -1;
    }else{
        agencySearch($(".r_add_input_agency").val().toLowerCase())
    }
})

$(".r_add_input_product").focus(function(event){
    $(".r_add_drop").addClass("hidden")
    $(".r_add_productDrop").removeClass("hidden")
});
$(".r_add_input_product").click(function(event){
    event.stopPropagation();
});
$(".r_add_input_pickupPlace").focus(function(event){
    $(".r_add_drop").addClass("hidden")
    $(".r_add_pickDrop").removeClass("hidden")
});
$(".r_add_input_pickupPlace").click(function(event){
    event.stopPropagation();
});
$(".r_add_input_nationality").focus(function(event){
    $(".r_add_drop").addClass("hidden")
    $(".r_add_natDrop").removeClass("hidden")
});
$(".r_add_input_nationality").click(function(event){
    event.stopPropagation();
})
$(".r_add_input_people").focus(function(){
    $(".r_add_drop").addClass("hidden")
})
$(".r_add_input_agency").focus(function(event){
    $(".r_add_drop").addClass("hidden")
    $(".r_add_agencyDrop").removeClass("hidden")
});
$(".r_add_input_agency").click(function(event){
    event.stopPropagation();
})
