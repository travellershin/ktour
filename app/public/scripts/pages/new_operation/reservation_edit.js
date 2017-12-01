let old_revdata = {
    date:"",
    product:"",
    option:[],
    people:0
}
let new_revdata = {
    date:"",
    product:"",
    option:[],
    people:0
}


$(".ri_footer_edit").click(function(){
    $('.ri').addClass('hidden');
    $('.re').removeClass('hidden');
})
$(document).on("click", ".re_header_close", function(){
    re_close();
})
$(".ri_footer_gmail").click(function(){
    window.open("https://mail.google.com/mail/u/0/#inbox/"+$(this).attr("id").split("-")[0])
})
$(".ri_header_close").click(function(){
    $('.lightBox_shadow').addClass('hidden');
    $('.ri').removeClass('hidden');
    $('.re').addClass('hidden');
    $("body").css("overflow","auto");
})
$(document).on("click", ".re_footer_save", function(){
    r_save($(this).attr("id"));
})
$(".ri_footer_cancel").click(function(){
    show_cancel_confirm();
})

$(".alert_footer_yes").click(function(){
    cancel_reservation($(this).attr("id"),$(this).attr("pid"),"Canceled Reservation");
})

$(".alert_footer_no").click(function(){
    cancel_cancel();
})
$(".r_add_input--drop").click(function(){
    $(".r_add_productDrop").removeClass("hidden")
    return false;
})
$(".rec").on("click",".r_add_pitem",function(){
    $(".r_add_input--drop").val($(this).html());
})
$(".rv_info_peopleCount").keyup(function(){
    calculate_people();
})
$(".rv_info_product").keyup(function(e){
    if(e.keyCode === 13){
        e.stopImmediatePropagation();
        $(".r_add_productDrop").addClass("hidden")
    }
})
$(document).click(function(){
    $(".r_add_productDrop").addClass("hidden")
})

function calculate_people(){
    let adult = $(".rec_co_box .rv_info_adult").val();
    let kid = $(".rec_co_box .rv_info_kid").val();
    $(".rv_info_people").html(adult*1+kid*1+" (adult "+adult+" / kid "+kid+")")
}

function r_add_option(id){
    let edittxt = ""
    edittxt+='<div class="rec_co_option_box"><input class="rec_co_option_name" placeholder="Option Name">'
    edittxt+='<input type="number" value="0" class="rec_co_option_people"/></div>'
    $(".rec_co_option--add").before(edittxt)
}

$(".ol").on("click",".rv_content_star",function(){
    $(this).parent().children(".rv_content_star").toggleClass("rv_content_star--on");
    let pid = $(".ol_title").html()
    let tid = $(this).parent().attr("tid")
    let id = $(this).parent().attr("id")
    if($(this).parent().children(".rv_content_star").hasClass("rv_content_star--on")){
        firebase.database().ref("operation/"+date+"/"+pid+"/teams/"+tid+"/reservations/"+id+"/star").set(true)
    }else{
        firebase.database().ref("operation/"+date+"/"+pid+"/teams/"+tid+"/reservations/"+id+"/star").set(false)
    }
    return false
})
$(document).on("click",".o_rv_guideCheckZone",function(){

    $(this).parent().children(".op_content_oCheck").toggleClass("oCkeck--checked");
    let pid = $(".ol_title").html()
    let tid = $(this).parent().attr("tid")
    let id = $(this).parent().attr("id")
    if($(this).parent().children(".op_content_oCheck").hasClass("oCkeck--checked")){
        firebase.database().ref("operation/"+date+"/"+pid+"/teams/"+tid+"/reservations/"+id+"/oCheck").set(true)
    }else{
        firebase.database().ref("operation/"+date+"/"+pid+"/teams/"+tid+"/reservations/"+id+"/oCheck").set(false)
    }
    return false
})

$(".ol_selectAll").click(function(){
    selectArray = []

    $(".rv_content").addClass("rev--selected");
    for (let i = 0; i < $(".rv_content").length; i++) {
        if($(".rv_content").eq(i).hasClass("rev--selected")){
            selectArray.push([$(".rv_content").eq(i).attr("tid"),$(".rv_content").eq(i).attr("id")])
        }
    }
    $(".ol_busEdit_number_txt").html(selectArray.length)
})

$(".ol_unSelect").click(function(){
    selectArray = []

    $(".rv_content").removeClass("rev--selected");
    $(".ol_busEdit_number_txt").html(selectArray.length)
})

$(document).on("click",".o_rv_clickZone",function(){
    if(isEditing){
        selectArray = []

        $(this).parent().toggleClass("rev--selected");
        for (let i = 0; i < $(".rv_content").length; i++) {
            if($(".rv_content").eq(i).hasClass("rev--selected")){
                selectArray.push([$(".rv_content").eq(i).attr("tid"),$(".rv_content").eq(i).attr("id")])
            }
        }
        $(".ol_busEdit_number_txt").html(selectArray.length)
    }else{
        rev_detail($(".ol_title").html(),$(this).parent().attr("id"))
        $(".ri_footer_gmail").attr("id",$(this).parent().attr("id"));
        $(".re_footer_save").attr("id",$(this).parent().attr("id"));
    }
})

$(".rec_co_option").on("click",".rec_co_option--add",function(){
    r_add_option($(".re_footer_save").attr("id"))
})

function r_add_option(id){
    let edittxt = ""
    edittxt+='<div class="rec_co_option_box"><input class="rec_co_option_name" placeholder="Option Name">'
    edittxt+='<input type="number" value="0" class="rec_co_option_people"/></div>'
    $(".rec_co_option--add").before(edittxt)
}



function r_save(id){
    console.log(r_obj);
    console.log(id);
    let pid = [$(".ol_title").html()];

    $('.re').addClass('hidden');
    $('.ri').removeClass('hidden');
    $("body").css("overflow","auto");
    $(".popUp").addClass("hidden");
    $('.lightBox_shadow').addClass('hidden');


    let iArray = ["date","product","area","pickupPlace","pickupTime","clientName","nationality","adult","kid","infant","tel","messenger","email","agencyCode","memo"]

    for (let i = 0; i < iArray.length; i++) {
        r_obj[pid][id][iArray[i]] = $(".re .rv_info_"+iArray[i]).val();
        if(typeof r_obj[pid][id][iArray[i]] == "undefined"){
            r_obj[pid][id][iArray[i]] = ""
        }
    }
    console.log(r_obj[pid][id].memo)
    let numberArray = ["adult","infant","kid"];
    for (let i = 0; i < numberArray.length; i++) {
        r_obj[pid][id][numberArray[i]] = r_obj[pid][id][numberArray[i]]*1
    }

    r_obj[pid][id].people = r_obj[pid][id].adult + r_obj[pid][id].kid

    r_obj[pid][id].option = []

    for (let i = 0; i < $(".rec_co_option_name").length; i++) {
        let optdata = {
            option:$(".rec_co_option_name").eq(i).val(),
            people:$(".rec_co_option_people").eq(i).val()*1
        }
        if(optdata.people>0){
            r_obj[pid][id].option.push(optdata)
        }
    }

    new_revdata.people = r_obj[pid][id].people;
    if(r_obj[pid][id].option){
        new_revdata.option = r_obj[pid][id].option
    }else{
        new_revdata.option = []
    }
    new_revdata.product = r_obj[pid][id].product;
    new_revdata.date = r_obj[pid][id].date;



    console.log(old_revdata)
    console.log(new_revdata)
    let remake = false;
    let remakeArray = []
    let optionChange = false;

    for (let key in new_revdata) {
        if(key !== "option"){
            if(new_revdata[key] !== old_revdata[key]){
                remake = true;
                remakeArray.push(key)
            }
        }else{
            for (let i = 0; i < new_revdata.option.length; i++) {
                if(old_revdata.option.length === new_revdata.option.length){
                    if(new_revdata.option[i].option !== old_revdata.option[i].option){
                        remake = true;
                        optionChange = true;
                    }
                    if(new_revdata.option[i].people !== old_revdata.option[i].people){
                        remake = true;
                        optionChange = true;
                    }
                }else{
                    remake = true;
                    optionChange = true;
                }
            }

            if(optionChange){
                remakeArray.push("option")
            }
        }
    }

    let optTxt

    if(remake){
        toast(remakeArray+" 변경으로 예약을 다시 잡습니다.");

        let durl = "https://intranet-64851.appspot.com/v1/reservation/edit?"

        for (let key in r_obj[pid][id]) {
            if(key !== "option"&&key !== "ref"){
                durl+=key+"="+r_obj[pid][id][key]+"&"
            }else if(key === "option"){
                for (let i = 0; i < r_obj[pid][id].option.length; i++) {
                    durl+="o"+i+"="+r_obj[pid][id].option[i].option+"&"+"p"+i+"="+r_obj[pid][id].option[i].people+"&"
                }
            }
        }

        durl += `ref=${old_revdata.date}/${old_revdata.product}/teams/${old_revdata.team}/reservations/${old_revdata.id}`;
        console.log(durl)

        // Using YQL and JSONP
        $.ajax({
            url: durl,
            // Tell jQuery we're expecting JSONP
            dataType: "jsonp",
            // Work with the response
            error: function(xhr, exception){
                if( xhr.status === 200|| xhr.status === 201|| xhr.status === 202){
                    toast("예약이 정상적으로 잡혔습니다");
                    reReservationSuccess = true;
                }else{
                    console.log('Error : ' + xhr.responseText)
                    toast("문제가 발생했습니다")
                }
            }
        });

        setTimeout(function () {
            if(!reReservationSuccess){
                toast("예약 변경에 실패했습니다. 문제가 지속되면 개발자를 호출해주세요.")
                reReservationSuccess = false;
            }
        }, 8000);


    }else{
        toast("단순 예약변경")
        firebase.database().ref("operation/"+r_obj[pid][id].date+"/"+r_obj[pid][id].product+"/teams/"+r_obj[pid][id].team+"/reservations/"+id).set(r_obj[pid][id])
    }
}

function re_close(){
    $('.popUp').addClass('hidden');
    $('.ri').removeClass('hidden');
    $('.re').addClass('hidden');
    $("body").css("overflow","auto");
}


function show_cancel_confirm(){
    $(".alert_contents").html("<p>Are you sure you want to cancel this reservation?</p>")
    $(".alert_background").removeClass("hidden");
    $(".alert_why").val("")
}

function cancel_reservation(sid,pid,msg){
    toast("예약을 취소합니다");
    $(".alert_background").addClass("hidden");
    $("body").css("overflow","auto")
    $(".popUp").addClass("hidden");
    $(".lightBox_shadow").addClass("hidden");
    r_obj[pid][sid].why = $(".alert_why").val()
    r_obj[pid][sid].canceledDate = datestring.today()
    console.log(r_obj[pid][sid])
    let data = {
        writer : r_obj[pid][sid].agency,
        card: - r_obj[pid][sid].sales,
        category:"reservation",
        currency:r_obj[pid][sid].currency,
        date:r_obj[pid][sid].date,
        id:sid,
        detail:msg + ". Reason : "+$(".alert_why").val()
    }
    firebase.database().ref("canceled/"+sid).set(r_obj[pid][sid]);
    firebase.database().ref("operation/"+r_obj[pid][sid].date+"/"+r_obj[pid][sid].product+"/teams/"+r_obj[pid][sid].team+"/reservations/"+sid).remove();


    firebase.database().ref("account/"+sid).set(data)
    console.log(data)
}

function cancel_cancel(){
    $(".alert_background").addClass("hidden");
}

function rev_detail(pid,id){
    console.log(r_obj)
    let data = r_obj[pid][id]

    for (var key in data) {
        if(data[key] == "N/A"){
            $('.rv_info_'+key).html("-");
            $('.rv_info_'+key).val("-");
        }else{
            $('.rv_info_'+key).html(data[key]);
            $('.rv_info_'+key).val(data[key]);
        }
    }
    console.log(data)
    if(data.agencyCode){$('.rv_info_agencyCode').html(data.agencyCode)}
    if(data.code){$('.rv_info_code').html(data.code)}
    if(data.agency){$('.rv_info_agency').html(data.agency)}

    $(".rv_info_date--picker").data('daterangepicker').setStartDate(data.date);
    $(".rv_info_date--picker").data('daterangepicker').setEndDate(data.date);

    let infant = data.people*1 - data.adult*1 - data.kid*1;
    $(".rv_info_adult").val(data.adult*1)
    $(".rv_info_kid").val(data.kid*1)
    $(".rv_info_infant").val(infant)
    $(".rv_info_people").html(data.adult*1+data.kid*1+" (adult "+data.adult+" / kid "+data.kid+")")
    $(".alert_footer_yes").attr("id",id);
    $(".alert_footer_yes").attr("pid",pid);
    let edittxt = ""
    if(data.option){
        let txt = ""
        for (let i = 0; i < data.option.length; i++) {
            txt+=data.option[i].option+" : "
            txt+=data.option[i].people +"<br>"

            edittxt+='<div class="rec_co_option_box"><input class="rec_co_option_name" value="'+data.option[i].option+'" readonly>'
            edittxt+='<input type="number" value='+data.option[i].people+' class="rec_co_option_people" placeholder="people"/></div>'
        }
        txt = txt.slice(0,-4);
        $(".rv_info_option").html(txt)
    }else{
        $(".rv_info_option").html("")
    }

    old_revdata.people = data.people;
    if(data.option){
        old_revdata.option = data.option
    }else{
        old_revdata.option = []
    }
    old_revdata.product = data.product;
    old_revdata.date = data.date;
    old_revdata.team = data.team;
    old_revdata.id = data.id;

    edittxt+='<div class="rec_co_option_box rec_co_option--add btn">+</div>'

    $(".rec_co_option").html(edittxt)

    //팝업창을 띄우고 높이를 조정
    $('.lightBox_shadow').removeClass('hidden');
    $('.ric_name').height($('.rv_info_clientName').height())
    $('.ric_product').height($('.rv_info_product').height())
    $('.ric_option').height($('.rv_info_option').height())
    $('.ric_pick').height($('.rv_info_pickupPlace').height())
    $('.rv_info_memo').width($('.ric').width())
}




$(document).on("click",".ol_busEdit_bus",function(){
    let target_team = $(this).attr("tid") // 선택된(옮겨질) team id
    let s_product = $(".ol_title").html(); // 프로덕트명
    let reservationData = {}
    for (let i = 0; i < selectArray.length; i++) {
        let s_team = selectArray[i][0];  //원 소속 팀
        let s_rev = selectArray[i][1];  //reservation id

        reservationData = operation[s_product].teams[s_team].reservations[s_rev] //복사해둠
        delete operation[s_product].teams[s_team].reservations[s_rev] // 지움
        if(operation[s_product].teams[target_team].reservations){
            operation[s_product].teams[target_team].reservations[s_rev] = reservationData //붙여넣기
        }else{
            operation[s_product].teams[target_team].reservations = {};
            operation[s_product].teams[target_team].reservations[s_rev] = reservationData;
        }
    }
    toast("예약을 이동했습니다")
    firebase.database().ref("operation/"+date+"/"+s_product).set(operation[s_product])
    if(lastRendering.product.length>0){
        inflate_listTop(s_product)
    }

})

$(".ol_busEdit_done").click(function(){
    let dataset = operation[$(".ol_title").html()]
    for (let team in dataset.teams) {
        if(dataset.teams[team].people === 0){
            delete operation[$(".ol_title").html()].teams[team];
            operation[$(".ol_title").html()].teamArgArray.splice(operation[$(".ol_title").html()].teamArgArray.indexOf(team),1)
        }
    }
    firebase.database().ref("operation/"+date+"/"+$(".ol_title").html()).set(operation[$(".ol_title").html()])

    if(lastRendering.product.length>0){
        inflate_listTop($(".ol_title").html())
    }

})

$(document).on("click",".ol_bus_add",function(){
    addbus();

})



function addbus(){
    $(".pop_blackScreen").removeClass("hidden");
    $(".obe").removeClass("hidden");
    $(".obe_header_title").html($(".ol_title").html().split("_")[2])

    let pid = $(".ol_title").html();
    let tid = firebase.database().ref("operation/"+date+"/"+pid+"/teams").push().key;
    let time = new Date();
    time = time.getTime()
    $(".omp_edit").attr("pid",pid);


    let teamdata = {};
    firebase.database().ref("product").orderByChild("id").equalTo(pid).on("value",snap => {
        let data = snap.val();
        let productdata = {}
        for (let key in data) {
            productdata = data[key]
        }
        let busno = $(".ol_bus_team").length + 1
        let busnameArray = []
        let bussizeno = 0;
        for (let i = 0; i < productdata.cost.bus.length; i++) {
            busnameArray.push(productdata.cost.bus[i].name);
            if($("#op_bus_company").val() === productdata.cost.bus[i].name){
                bussizeno = i
            }
        }
        let bussizeArray = []
        for (let i = 0; i < productdata.cost.bus[bussizeno].size.length; i++) {
            bussizeArray.push(productdata.cost.bus[bussizeno].size[i].max + "인승(" + productdata.cost.bus[bussizeno].size[i].cost+"원)")
        }
        $(".obe_footer_save").attr("tid",tid);
        $(".obe_footer_save").attr("pid",pid);
        $("#op_bus_company").attr("dropitem",busnameArray.toString())
        $("#op_bus_size").attr("dropitem",bussizeArray.toString())
        $(".pop_blackScreen").removeClass("hidden");
        $(".obe").removeClass("hidden");
        $(".obe_header_title").html([pid.split("_")[2]]+" "+busno);
        $("#op_bus_company").val("Not Selected Yet");
        $("#op_bus_size").val("Not Selected Yet")
        $("#op_guide").val("Unassigned");
        $("#op_message").val(teamdata.message);
        let guidenameArray = []
        guidenameArray.push("Unassigned")
        for (let guidekey in guideData) {
            guidenameArray.push(guideData[guidekey].name)
        }

        let guidetxt = '<input class="obe_body_input dw_dropdown op_guide0" value="Unassigned" id="op_guide0" readonly/>'
        $("#op_guide").val("Unassigned");
        $(".obe_body_guide").html(guidetxt);

        $(".obe_body_guide>input").attr("dropitem",guidenameArray.toString())

        if(lastRendering.product.length>0){
            inflate_listTop();
        }

    });
}
