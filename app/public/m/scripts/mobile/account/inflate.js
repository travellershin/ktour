function set_for_inflate(){
    let inflateArray = [];

    let adjFilter = {
        category : selFilter.category,
        writer : selFilter.writer
    }

    if(adjFilter.category.length === 0){
        adjFilter.category = filter.category
    }
    if(adjFilter.writer.length === 0){
        adjFilter.writer = filter.writer
    }


    for (let i = 0; i < account.length; i++) {
        if(adjFilter.writer.includes(account[i].writer)&&adjFilter.category.includes(account[i].category)){
            inflateArray.push(account[i])
        }
    }
    inflate_data(inflateArray)
}


function inflate_data(array){
    console.log(filter_adjusted)
    let cR = 1;
    let txt = ""

    let total = {
        card:{
            inc:0,
            exp:0
        },
        cash:{
            inc:0,
            exp:0
        }
    }


    for (let i = 0; i < array.length; i++) {

        let data = {
            card:{
                inc:"-",
                exp:"-"
            },
            cash:{
                inc:"-",
                exp:"-"
            }
        }

        switch (array[i].currency) {
            case "KRW":
                cR = 1;
                break;

            case "USD":
                cR = a_c_USD;
                break;

            case "CNY":
                cR = a_c_CNY;
                break;
        }
        for (let method in data) { //method = card인지 cash인지
            if(array[i][method]>0){
                data[method].inc = comma(array[i][method]*cR)
                total[method].inc += array[i][method]*cR
            }
            //else문 쓰면 안됨
            if(array[i][method]<0){
                data[method].exp = comma(-array[i][method]*cR)
                total[method].exp -= array[i][method]*cR
            }
        }

        $(".a_stat_card_indi_in_value").html(comma(total.card.inc));
        $(".a_stat_card_indi_ex_value").html(comma(total.card.exp));
        $(".a_stat_cash_indi_in_value").html(comma(total.cash.inc));
        $(".a_stat_cash_indi_ex_value").html(comma(total.cash.exp));

        if(total.card.inc-total.card.exp<0){
            $(".a_stat_card_total_value").addClass("value--red");
        }else{
            $(".a_stat_card_total_value").removeClass("value--red")
        }
        $(".a_stat_card_total_value").html(comma(total.card.inc-total.card.exp));

        if(total.cash.inc-total.cash.exp<0){
            $(".a_stat_cash_total_value").addClass("value--red");
        }else{
            $(".a_stat_cash_total_value").removeClass("value--red")
        }
        $(".a_stat_cash_total_value").html(comma(total.cash.inc-total.cash.exp));

        let totaltotal = total.card.inc-total.card.exp+total.cash.inc-total.cash.exp;

        if(totaltotal<0){
            $(".a_stat_total_value").addClass("value--red");
        }else{
            $(".a_stat_total_value").removeClass("value--red")
        }
        $(".a_stat_total_value").html(comma(totaltotal));

        txt+='<div class="a_item" aid="'+array[i].id+'"><div class="a_item_top"><p class="a_item_category">'+array[i].category+'</p>'
        txt+='<p class="a_item_writer">'+array[i].writer+'</p><p class="a_item_date">'+array[i].date+'</p></div><p class="a_item_contents" title="'+array[i].detail+'">'+array[i].detail+'</p>'
        txt+='<div class="a_item_liner"><p class="a_item_title">CARD</p><p class="a_item_cardExpenditure a_item--exp">'+data.card.exp+'</p><p class="a_item_cardIncome a_item--income">'+data.card.inc+'</p></div>'
        txt+='<div class="a_item_liner"><p class="a_item_title">CASH</p><p class="a_item_cashExpenditure a_item--exp">'+data.cash.exp+'</p><p class="a_item_cashIncome a_item--income">'+data.cash.inc+'</p></div></div>'
    }
    $(".a_contents").html(txt)
}
