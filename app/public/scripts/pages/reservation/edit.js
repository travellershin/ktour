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
$(document).on("click", ".re_footer_save", function(){
    r_save($(this).attr("id"));
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

    $('.re').addClass('hidden');
    $('.ri').removeClass('hidden');
    $("body").css("overflow","auto");
    $(".popUp").addClass("hidden")

    let iArray = ["date","product","area","pickupPlace","pickupTime","clientName","nationality","people","adult","kid","infant","tel","messenger","email","agencyCode","memo"]

    for (let i = 0; i < iArray.length; i++) {
        r_obj[id][iArray[i]] = $(".re .rv_info_"+iArray[i]).val();
        if(typeof r_obj[id][iArray[i]] == "undefined"){
            r_obj[id][iArray[i]] = ""
        }
    }
    console.log(r_obj[id].memo)
    let numberArray = ["people","adult","infant","kid"];
    for (let i = 0; i < numberArray.length; i++) {
        r_obj[id][numberArray[i]] = r_obj[id][numberArray[i]]*1
    }

    r_obj[id].option = []

    for (let i = 0; i < $(".rec_co_option_name").length; i++) {
        let optdata = {
            option:$(".rec_co_option_name").eq(i).val(),
            people:$(".rec_co_option_people").eq(i).val()*1
        }
        if(optdata.people>0){
            r_obj[id].option.push(optdata)
        }
    }


    new_revdata.people = r_obj[id].people;
    if(r_obj[id].option){
        new_revdata.option = r_obj[id].option
    }else{
        new_revdata.option = []
    }
    new_revdata.product = r_obj[id].product;
    new_revdata.date = r_obj[id].date;

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

    if(remake){
        toast(remakeArray+" 변경으로 인해 예약을 다시잡겠다")
    }else{
        toast("단순 예약변경")
    }

    //firebase.database().ref("operation/"+r_obj[id].date+"/"+r_obj[id].product+"/teams/"+r_obj[id].team+"/reservations/"+id).set(r_obj[id])
}

function re_close(){
    $('.popUp').addClass('hidden');
    $('.ri').removeClass('hidden');
    $('.re').addClass('hidden');
    $("body").css("overflow","auto");
}
