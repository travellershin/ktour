let account_NF = [];
let account_obg = {};
let filter = {
    writer : [],
    category : [
        "reservation",
        "tour",
        "office",
        "etc"
    ]
};
let filter_adjusted = { //사용자가 어떤 필터를 선택했나
    writer:[],
    category:[]
}
let account_filtered = { //사용자가 선택한 필터에 맞는 product들 모음
    writer:[],
    category:[]
}
let inflateArray = []; //필터링 완료된 product

let acc_obj = {};


console.log(datestring.yesterday())

$(document).ready(function(){
    datepicker_init();
})
$(".a_htop_add").click(function(){
    add_account()
})
$(".a_edit_header_close").click(function(){
    $(".lightBox_shadow").addClass("hidden")
    $("body").css("overflow","auto")
    $(".a_edit_footer_delete").removeClass("hidden")
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
$(document).on("click",".drp_quick_yesterday",function(){
    $(".drp_quick>p").removeClass("drp_quick--selected");
    $(this).addClass("drp_quick--selected");
    $(".a_set_date_txt").html(datestring.yesterday()+" ~ "+datestring.yesterday());
    dateArray = [datestring.yesterday()];
    collect_data();
})
$(document).on("click",".drp_quick_today",function(){
    $(".drp_quick>p").removeClass("drp_quick--selected");
    $(this).addClass("drp_quick--selected");
    $(".a_set_date_txt").html(datestring.today()+" ~ "+datestring.today());
    dateArray = [datestring.today()];
    collect_data();
})
$(document).on("click",".drp_quick_tomorrow",function(){
    $(".drp_quick>p").removeClass("drp_quick--selected");
    $(this).addClass("drp_quick--selected");
    $(".a_set_date_txt").html(datestring.tomorrow()+" ~ "+datestring.tomorrow());
    dateArray = [datestring.tomorrow()];
    collect_data();
})
$(".a_hbot").on("click",".drop_item",function(){ //드롭다운 하위 선택지(필터) 클릭
    set_filter($(this))
})

function delete_account(){
    let aid = $(".a_edit").attr("aid");
    if(confirm("정말로 정보를 삭제하시겠습니까?")){
        delete acc_obj[aid];
        firebase.database().ref("account/"+aid).remove();
        $(".lightBox_shadow").addClass("hidden");
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
        let data = acc_obj[aid]
        data.date = $(".a_edit_input_date").val();
        data.card = 0;
        data.cash = 0;
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
        $(".lightBox_shadow").addClass("hidden")
        $("body").css("overflow","auto")
    }
}

function show_account(aid){
    $(".a_edit").attr("aid",aid)
    $(".a_edit_header_title").html("ITEM DETAIL");
    $(".a_edit_footer_delete").removeClass("hidden")
    $(".lightBox_shadow").removeClass("hidden")
    $("body").css("overflow","hidden")
    let data = acc_obj[aid]
    console.log(data)
    $(".a_edit_input_date").val(data.date);
    $(".a_edit_input_category").val(data.category);
    $(".a_edit_input_writer").val(data.writer);
    $(".a_edit_input_contents").val(data.detail);
    if(data.card>0){
        $(".a_edit_input_cardincome").val(data.card);
    }
    if(data.card<0){
        $(".a_edit_input_cardexp").val(-data.card);
    }
    if(data.cash>0){
        $(".a_edit_input_cashincome").val(data.cash);
    }
    if(data.cash<0){
        $(".a_edit_input_cashexp").val(-data.cash);
    }
}

function add_account(){
    $(".lightBox_shadow").removeClass("hidden")
    $("body").css("overflow","hidden")
    $(".a_edit").attr("aid",firebase.database().ref().push().key)
    $(".a_edit_header_title").html("NEW ACCOUNT ITEM")
    $(".a_edit_footer_delete").addClass("hidden")
    $(".a_edit_input_date").val(datestring.today());
    $(".a_edit_input_category").val("office");
    $(".a_edit_input_writer").val("");
    $(".a_edit_input_contents").val("");
    $(".a_edit_input_cardincome").val(0);
    $(".a_edit_input_cardexp").val(0);
    $(".a_edit_input_cashincome").val(0);
    $(".a_edit_input_cashexp").val(0);
}

function collect_data(){
    firebase.database().ref("account").off("value")
    firebase.database().ref("account").orderByChild("date").startAt(dateArray[0]).endAt(dateArray[dateArray.length - 1]).on("value",snap=>{
        account_NF = []
        snap.forEach(function(child){
            let temp = child.val();
            temp.id = child.key
            account_NF.push(temp)
        })
        acc_obj = snap.val();
        if(!acc_obj){
            acc_obj = {}
        }
        console.log(account_NF)
        filter_account();
    })
}

function filter_account(){

    let filter_writer = new Set(); //필터 이름

    for (let i = 0; i < account_NF.length; i++) {
        filter_writer.add(account_NF[i].writer)
    }
    filter.writer = Array.from(filter_writer)

    dynamicDrop($("#a_filter_category"),filter.category);
    dynamicDrop($("#a_filter_writer"),Array.from(filter_writer));

    inflate_data(account_NF);
}


function set_filter(div){
    inflateArray = []
    account_filtered = { //사용자가 선택한 필터에 맞는 product들 모음 초기화
        writer:[],
        category:[]
    }

    let kind = $(div).parent().attr("id").split("_")[3] //어떤 종류의 필터가 선택되었는가!
    console.log(kind)
    $(div).toggleClass("drop_item--selected"); //필터를 선택한 상황인지 해제한 상황인지 체크
    if($(div).hasClass("drop_item--selected")){
        if(filter_adjusted[kind].length === filter[kind].length){ //모두 선택된 상태(=아무것도 선택 안 된 상태)에서 필터를 선택했다
            filter_adjusted[kind] = [$(div).html()]; //하나만 선택된 것으로
        }else{
            filter_adjusted[kind].push($(div).html()); //기존 선택되어 있던 필터들에 추가
        }
    }else{
        filter_adjusted[kind].splice(filter_adjusted[kind].indexOf($(div).html()),1); //기존 선택되어 있던 필터들에서 제거
    }
    for (let filters in filter_adjusted) {
        if(filter_adjusted[filters].length === 0){ //만약에 필터를 해제해서 선택된 것이 하나도 없게 된다면
            filter_adjusted[filters] = filter[filters]; //모두 다 선택한 것으로 간주함
        }
    }
    for (let filters in filter_adjusted) {
        for (let i = 0; i < account_NF.length; i++) {
            if(filter_adjusted[filters].indexOf(account_NF[i][filters])>-1){ //product 내의 필터 관련정보를 확인
                account_filtered[filters].push(account_NF[i])  //각 필터에 맞게 넣음
            }

        }
    }
    for (let i = 0; i < account_filtered.writer.length; i++) {
        if(account_filtered.category.indexOf(account_filtered.writer[i])>-1){
            inflateArray.push(account_filtered.writer[i])  //현재 선택된 필터에 맞게 보여줄 내용을 결정
        }
    }
    inflate_data(inflateArray)
}

function inflate_data(array){
    let txt = ""
    console.log(array)
    for (let i = 0; i < array.length; i++) {
        let cardIncome = '-';
        let cardExpenditure = '-';
        let cashIncome = '-';
        let cashExpenditure = '-';
        if(array[i].card>0){
            cardIncome = comma(array[i].card)
        }
        if(array[i].card<0){
            cardExpenditure = comma(-array[i].card)
        }
        if(array[i].cash>0){
            cashIncome = comma(array[i].cash)
        }
        if(array[i].cash<0){
            cashExpenditure = comma(-array[i].cash)
        }

        txt+='<div class="a_item" aid="'+array[i].id+'"><p class="a_item_date">'+array[i].date+'</p><p class="a_item_category">'+array[i].category+'</p>'
        txt+='<p class="a_item_writer">'+array[i].writer+'</p><p class="a_item_contents" title="'+array[i].detail+'">'+array[i].detail+'</p>'
        txt+='<p class="a_item_cardIncome a_item--income">'+cardIncome+'</p><p class="a_item_cardExpenditure a_item--exp">'+cardExpenditure+'</p><p class="a_item_cashIncome a_item--income">'+cashIncome+'</p><p class="a_item_cashExpenditure a_item--exp">'+cashExpenditure+'</p></div>'
    }
    $(".a_contents").html(txt)
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
