$(".pe_save").click(function(){
    save_product();
})

function save_product(){
    let key = $(".pe").attr("pid")
    let data = {
        info:{
            available:[],
            language:[],
            pickup:[]
        },
        agency:{},
        price:{},
        cost:{
            item:[],
            bus:[]
        },
        possibles:[],
        option:[],
        id:""
    };
    let info = ["name","area","category","status","period","description","deadline","itinerary",
                "cancellation","include","exclude","others"];

    for (let i = 0; i < info.length; i++) {
        data.info[info[i]] = $(".input_info_"+info[i]).val()
    }
    for (let i = 0; i < $(".pei_available_cb").length; i++) {
        data.info.available.push($(".pei_available_cb").eq(i).hasClass('cb_checked'))
    }
    for (let i = 0; i < $(".pei_language_cb").length; i++) {
        data.info.language.push($(".pei_language_cb").eq(i).hasClass('cb_checked'))
    }
    for (let i = 0; i < $(".pei_meeting").length; i++) {
        data.info.pickup.push($(".pei_meeting").eq(i).val())
    }
    data.info.memo = $(".pe_memo_txt").val()

    //info 저장완료

    for (let i = 0; i < $(".pea_agency").length; i++) {
        data.agency[$(".pea_title").eq(i).html()] = $(".pea_agency").eq(i).attr("rstat")
    }

    //agency 저장완료

    for (let i = 0; i < $(".pep_p_tab").length-1; i++) { //-1을 한 이유는 마지막 탭은 addtab이므로

        let tid = $(".pep_p_tab").eq(i).attr("tid");
        console.log($("."+tid+"_reservation"))
        let rev = $("."+tid+"_reservation").val().split("-");
        revfrom = rev[0]+"-"+rev[1]+"-"+rev[2]
        revto = rev[3]+"-"+rev[4]+"-"+rev[5]
        let tour = $("."+tid+"_tour").val().split("-");
        tourfrom = tour[0]+"-"+tour[1]+"-"+tour[2]
        tourto = tour[3]+"-"+tour[4]+"-"+tour[5]

        data.price[tid] = {
            byAgencies:[],
            description:$(".pep_description_"+tid).val(),
            forAll:false,
            reservationDate_from:revfrom,
            reservationDate_to:revto,
            tourDate_from:tourfrom,
            tourDate_to:tourto,
            title:$(".pep_title_"+tid).val()
        }

        for (let j = 0; j < $("."+tid+"_byAgenciesBox>div").length; j++) {
            let age_adult = $("."+tid+"_pei_price_age_adult_"+j).val().split("-");
            let age_kid = $("."+tid+"_pei_price_age_kid_"+j).val().split("-");
            let age_infant = $("."+tid+"_pei_price_age_infant_"+j).val().split("-");
            let agencyArray = [];
            for (let k = 0; k < $("."+tid+"_pep_p_ag_box_agencies_"+j+">p").length; k++) {
                agencyArray.push($("."+tid+"_pep_p_ag_box_agencies_"+j+">p").eq(k).html())
            }

            data.price[tid].byAgencies.push({
                adultAge_min:age_adult[0].trim()*1,
                adultAge_max:age_adult[1].trim()*1,
                kidAge_min:age_kid[0].trim()*1,
                kidAge_max:age_kid[1].trim()*1,
                infantAge_min:age_infant[0].trim()*1,
                infantAge_max:age_infant[1].trim()*1,
                adult_gross:$("."+tid+"_pei_price_gross_adult_"+j).val(),
                kid_gross:$("."+tid+"_pei_price_gross_kid_"+j).val(),
                infant_gross:$("."+tid+"_pei_price_gross_infant_"+j).val(),
                adult_net:$("."+tid+"_pei_price_net_adult_"+j).val(),
                kid_net:$("."+tid+"_pei_price_net_kid_"+j).val(),
                infant_net:$("."+tid+"_pei_price_net_infant_"+j).val(),
                agency:agencyArray,
                currency:$(".pep_currency_"+tid+"_"+j).attr("rstat")
            })
        }
    }

    //product price 저장완료

    for (let i = 0; i < $(".pep_p_op").length; i++) {
        let optname = $(".pep_p_op_name").eq(i).val()
        let optprice = $(".pep_p_op_price").eq(i).val()
        let optpossibles = $(".pep_p_op_possibles").eq(i).val().split(";")

        for (let j = 0; j < optpossibles.length; j++) {
            optpossibles[j] = optpossibles[j].trim();
        }

        data.option.push({
            option:optname,
            price:optprice,
            possibles:optpossibles
        })
    }

    //option price 저장완료

    for (let i = 0; i < $(".pep_p_as").length; i++) {
        let itemData = {};
        let adultAge = $(".pei_age_adult_"+i).val().split("-")
        itemData.adultAge_max = adultAge[1].trim()*1;
        itemData.adultAge_min = adultAge[0].trim()*1;
        let youngAge = $(".pei_age_young_"+i).val().split("-")
        itemData.youngAge_max = youngAge[1].trim()*1;
        itemData.youngAge_min = youngAge[0].trim()*1;
        let kidAge = $(".pei_age_young_"+i).val().split("-")
        itemData.kidAge_max = kidAge[1].trim()*1;
        itemData.kidAge_min = kidAge[0].trim()*1;
        itemData.adult_cost = $(".pei_price_adult_"+i).val()*1;
        itemData.young_cost = $(".pei_price_young_"+i).val()*1;
        itemData.kid_cost = $(".pei_price_kid_"+i).val()*1;
        itemData.item = $(".pep_p_as_title").eq(i).val();
        itemData.free_cost = 0;
        itemData.pre = false;

        data.cost.item.push(itemData)
    }

    //asset 저장완료

    let bus = [];
    for (let i = 0; i < $(".pep_p_bus").length; i++) {
        let busData = {};
        busData.name = $(".pep_p_bus_name").eq(i).val();
        busData.size = [];

        for (let j = 0; j < $(".pei_bus_"+i).length; j++) {
            let indata = {}
            let people = $(".pei_bus_"+i+"_people_"+j).val().split("-");
            indata.max = people[1].trim()*1;
            indata.min = people[0].trim()*1;
            indata.cost = $(".pei_bus_"+i+"_price_"+j).val();
            busData.size.push(indata)
        }
        let maxArray = []
        for (let no = 0; no < busData.size.length; no++) {
            maxArray.push(busData.size[no].max)
        }
        busData.max = Math.max.apply(null,maxArray)
        bus.push(busData)
    }

    data.cost.bus = bus


    data.id = data.info.area+"_"+data.info.category+"_"+data.info.name;
    data.possibles = $(".pei_possibles").val().split(";")

    for (let i = 0; i < data.possibles.length; i++) {
        data.possibles[i] = data.possibles[i].trim();
    }
    console.log(data)

    firebase.database().ref("product/"+key).set(data)

}
