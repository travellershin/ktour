let account_NF = [];
let account_obg = {};
let filter_adjusted = { //사용자가 어떤 필터를 선택했나
    writer:[],
    category:[]
}
let account_filtered = { //사용자가 선택한 필터에 맞는 product들 모음
    writer:[],
    category:[]
}
let a_c_USD = 1150;
let a_c_CNY = 168;
if(localStorage["a_c_USD"]){
    a_c_USD = localStorage["a_c_USD"]
}
if(localStorage["a_c_CNY"]){
    a_c_CNY = localStorage["a_c_CNY"]
}


console.log(datestring.yesterday())


$(".a_htop_add").click(function(){
    add_account()
})
$(".a_edit_header_close").click(function(){
    $(".addnewbox").addClass("hidden")
    $("body").css("overflow","auto")
    $(".a_edit_footer_delete").removeClass("hidden")
})
$(".a_set_exchange").click(function(){
    show_exchange()
})
$(".a_ex_header_close").click(function(){
    close_exchange()
})
$(".a_ex_footer_save").click(function(){
    save_exchange()
})
$(document).on("click",".a_item",function(){
    show_account($(this).attr("aid"));
})
$(".a_edit_footer_save").click(function(){
    save_account();
})
$(".a_edit_footer_delete").click(function(){
    delete_account();
})

function delete_account(){
    let aid = $(".a_edit").attr("aid");
    if(confirm("정말로 정보를 삭제하시겠습니까?")){
        delete acc_obj[aid];
        firebase.database().ref("account/"+aid).remove();
        $(".addnewbox").addClass("hidden");
        $("body").css("overflow","auto")
    }
}

function save_account(){
    if($(".a_edit_input_cardincome").val()>0&&$(".a_edit_input_cardexp").val()>0){
        alert("카드 항목의 Income과 Expenditure가 동시에 입력되었습니다.")
    }else if($(".a_edit_input_cashincome").val()>0&&$(".a_edit_input_cashexp").val()>0){
        alert("현금 항목의 Income과 Expenditure가 동시에 입력되었습니다.")
    }else{
        let aid = $(".a_edit").attr("aid");
        if(!acc_obj[aid]){acc_obj[aid]={}}
        let data = acc_obj[aid]
        console.log(data)
        data.date = $(".a_edit_input_date").val();
        data.card = 0;
        data.cash = 0;
        data.currency = $(".a_edit_input_currency").val();
        data.category = $(".a_edit_input_category").val();
        data.detail = $(".a_edit_input_contents").val();
        data.writer = $(".a_edit_input_writer").val();

        if($(".a_edit_input_cardincome").val()>0){
            data.card = $(".a_edit_input_cardincome").val()*1
        }
        if($(".a_edit_input_cardexp").val()>0){
            data.card = -$(".a_edit_input_cardexp").val()*1
        }
        if($(".a_edit_input_cashincome").val()>0){
            data.cash = $(".a_edit_input_cashincome").val()*1
        }
        if($(".a_edit_input_cashexp").val()>0){
            data.cash = -$(".a_edit_input_cashexp").val()*1
        }

        firebase.database().ref("account/"+aid).set(data)
        $(".addnewbox").addClass("hidden")
        $("body").css("overflow","auto");

        toast("정상적으로 입력되었습니다.")
    }
}

function show_account(aid){
    $(".a_edit").attr("aid",aid)
    $(".a_edit_header_title").html("ITEM DETAIL");
    $(".a_edit_footer_delete").removeClass("hidden")
    $(".addnewbox").removeClass("hidden")
    $("body").css("overflow","hidden")
    let data = acc_obj[aid]
    console.log(data)
    $(".a_edit_input_date").val(data.date);
    $(".a_edit_input_category").val(data.category);
    $(".a_edit_input_writer").val(data.writer);
    $(".a_edit_input_contents").val(data.detail);
    $(".a_edit_input_currency").val(data.currency);
    if(data.card>0){
        $(".a_edit_input_cardincome").val(data.card);
    }else{
        $(".a_edit_input_cardincome").val("");
    }
    if(data.card<0){
        $(".a_edit_input_cardexp").val(-data.card);
    }else{
        $(".a_edit_input_cardexp").val("");
    }
    if(data.cash>0){
        $(".a_edit_input_cashincome").val(data.cash);
    }else{
        $(".a_edit_input_cashincome").val("");
    }
    if(data.cash<0){
        $(".a_edit_input_cashexp").val(-data.cash);
    }else{
        $(".a_edit_input_cashexp").val("");
    }
}

function add_account(){
    $(".addnewbox").removeClass("hidden")
    $("body").css("overflow","hidden")
    $(".a_edit").attr("aid",firebase.database().ref().push().key)
    $(".a_edit_header_title").html("NEW ACCOUNT ITEM")
    $(".a_edit_footer_delete").addClass("hidden")
    $(".a_edit_input_currency").val("KRW");
    $(".a_edit_input_date").val(datestring.today());
    $(".a_edit_input_category").val("office");
    $(".a_edit_input_writer").val("");
    $(".a_edit_input_contents").val("");
    $(".a_edit_input_cardincome").val(0);
    $(".a_edit_input_cardexp").val(0);
    $(".a_edit_input_cashincome").val(0);
    $(".a_edit_input_cashexp").val(0);
}


function datepicker_init(){
    $(".a_set_date_txt").html(datestring.today()+" ~ "+datestring.today())
    dateArray = [datestring.today()];
    collect_data();

    $('.a_set_date_txt').daterangepicker(drp_config,function(start, end, label){
        //날짜가 선택되면 필터를 초기화하고 드롭다운들을 닫는다
        $(".dw_dropdown").removeClass("drop_appended");
        $(".dropbox").addClass("display_none");
        dw_drp(start,end,label);
        collect_data();
    });

    $(".a_edit_input_date").daterangepicker({
        "autoApply": true,
        singleDatePicker: true,
        locale: { format: 'YYYY-MM-DD'},
        startDate: $(datestring.today()),
        endDate: $(datestring.today())
    });
}


function show_exchange(){
    $(".exchangebox").removeClass("hidden");
    $("body").css("overflow","hidden");
    $(".a_ex_input_usd").val(a_c_USD);
    $(".a_ex_input_cny").val(a_c_CNY);
}

function close_exchange(){
    $(".exchangebox").addClass("hidden");
    $("body").css("overflow","auto")
}

function save_exchange(){
    if($(".a_ex_input_usd").val()>0){
        a_c_USD = $(".a_ex_input_usd").val();
        localStorage["a_c_USD"] = $(".a_ex_input_usd").val();
    }
    if($(".a_ex_input_cny").val()>0){
        a_c_CNY = $(".a_ex_input_cny").val();
        localStorage["a_c_CNY"] = $(".a_ex_input_cny").val();
    }

    $(".exchangebox").addClass("hidden");
    $("body").css("overflow","auto")
    inflate_data(inflateArray)

}
