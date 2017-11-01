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
}


$(document).ready(function(){
    datepicker_init();
})




function collect_data(){
    account_NF = []
    firebase.database().ref("account").orderByChild("date").startAt(dateArray[0]).endAt(dateArray[dateArray.length - 1]).on("value",snap=>{
        snap.forEach(function(child){
            account_NF.push(child.val())
        })
        rev_obj = snap.val();
        console.log(account_NF)
        filter_account();
    })
}

function filter_account(){

    let filter_writer = new Set(); //필터 이름

    for (let i = 0; i < account_NF.length; i++) {
        filter_writer.add(account_NF[i].writer)
    }

    dynamicDrop($("#a_filter_category"),filter.category);
    dynamicDrop($("#a_filter_writer"),Array.from(filter_writer));

    inflate_data();
}

function inflate_data(){
    let txt = ""
    for (let i = 0; i < account_NF.length; i++) {
        let cardIncome = '-';
        let cardExpenditure = '-';
        let cashIncome = '-';
        let cashExpenditure = '-';
        if(account_NF[i].card>0){
            cardIncome = comma(account_NF[i].card)
        }
        if(account_NF[i].card<0){
            cardExpenditure = comma(-account_NF[i].card)
        }
        if(account_NF[i].cash>0){
            cashIncome = comma(account_NF[i].cash)
        }
        if(account_NF[i].cash<0){
            cashExpenditure = comma(-account_NF[i].cash)
        }
        if(account_NF[i].amount>0){
            cardIncome = comma(account_NF[i].amount)
        }

        txt+='<div class="a_item"><p class="a_item_date">'+account_NF[i].date+'</p><p class="a_item_category">'+account_NF[i].category+'</p>'
        txt+='<p class="a_item_writer">'+account_NF[i].writer+'</p><p class="a_item_contents" title="'+account_NF[i].detail+'">'+account_NF[i].detail+'</p>'
        txt+='<p class="a_item_cardIncome">'+cardIncome+'</p><p class="a_item_cardExpenditure">'+cardExpenditure+'</p><p class="a_item_cashIncome">'+cashIncome+'</p><p class="a_item_cashExpenditure">'+cashExpenditure+'</p></div>'
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
}
