let mailing = new Mailing
let setfilter = "total"

$(document).ready(function(){
    mailing.init();
})

$('.c_header_bottom_type').click(function(){
    $('.c_filter').toggleClass('hidden');
})
$(".exp_pop").click(function(e){
    return false;
})

$('.c_filter_btn').click(function(){
    mailing.setFilter($(this).attr("id"), $('.c_filter_btn').index($(this)));
    setfilter = $(this).attr("id");
})

$(".exp_pop_footer_close").click(function(){
    $(".insidePop").addClass("hidden");
    $("body").css("overflow","auto")
})

$(document).on("click", ".c_ct", function(){
    if($(this).attr("id").charAt(0)==="N"){
        $(".exp_pop_footer_mail").addClass("hidden")
    }else{
        $(".exp_pop_footer_mail").removeClass("hidden")
        $(".exp_pop_footer_mail").attr("id",$(this).attr("id"))
    }
    $(".insidePop").removeClass("hidden");
    $("body").css("overflow","hidden");
    $(".exp_pop_footer_delete").attr("id",$(this).attr("key"))
    console.log($(this).attr("key"))
    $(".exp_pop_contents").val(mailing.debugArray[$(".c_ct").index(this)].detail)
})

$(".exp_pop_footer_mail").click(function(){
    window.open("https://mail.google.com/mail/u/0/#inbox/"+$(this).attr("id"))
})

$(".c_header_top_gmail").click(function(){
    window.open("https://mail.google.com/mail/u/0/#inbox/")
})

$(".exp_pop_footer_delete").click(function(){
    let key = $(this).attr("id")
    console.log(key)
    firebase.database().ref("exception/"+key).remove();
    $(".insidePop").addClass("hidden")
    $("body").css("overflow","auto")
})
$("body").click(function(){
    $(".insidePop").addClass("hidden");
    $("body").css("overflow","auto")
})

function Mailing(){
    this.category = {
        green:["UNKNOWN_ADDRESS"],
        yellow:["UNKNOWN_SUBJECT","KKDAY"],
        orange:["UNKNOWN_CONTENT_TYPE","COMPLEX_CONTENT_TYPE","FAILED_PARSE_MAIL","PRIVATE_TOUR",
        "NOT_AUTO","FAILED_PARSE_RESERVATION","FAILED_CONFIRM_RESERVATION","FAILED_CHECK_INTEGRITY",
        "FAILED_CHECK_FUNKO","EMPTY_FUNKO","UNKNOWN_PRODUCT","UNKNOWN_PLACE","UNKNOWN_OPTION",
        "CLOSED_PRODUCT","WRONG_PERIOD","WRONG_DAY","LAST_MINUTE","NO_PRICE_INFO","NO_BUS_INFO"],
        red:["UNKNOWN_ERROR_BOT","UNKNOWN_ERROR_SERVER","NETWORK_ERR","GMAIL_LIMIT"]
    }

    this.exception = {
        total:[],
        green:[],
        yellow:[],
        orange:[],
        red:[]
    };

    this.debugArray = []

    this.init = function(){
        //데이터 분류
        firebase.database().ref("exception").on("value", snap => {
            this.exception = {total:[],green:[],yellow:[],orange:[],red:[]}

            let data = snap.val();

            for (var key in data) {
                let dateTime = data[key].date + " " + data[key].time
                data[key].newdate = Date.parse(dateTime);

                this.exception.total.push(data[key]);
                data[key].key = key;
                console.log(data[key].err + " 에러가 났습니다")

                for (let color in this.category) {
                    exArray = this.category[color];

                    if(exArray.includes(data[key].err)){
                        data[key].color = color;
                        this.exception[color].push(data[key])
                        console.log(color+ " 색으로 분류되었습니다")
                    }

                    if(this.exception[data[key].err]){
                        this.exception[data[key].err].push(data[key])
                    }else{
                        this.exception[data[key].err] = [data[key]]
                    }
                }
            }

            this.exception.total.sort(function(a,b){
                return a.newdate < b.newdate ? -1 : a.newdate > b.newdate ? 1 : 0;
            });
            console.log(this.exception)


            //$('.cc_low').html(this.exception.green.length);
            //$('.cc_mid').html(this.exception.yellow.length);
            //$('.cc_high').html(this.exception.orange.length);
            //$('.cc_vhigh').html(this.exception.green.length);

            //this.show(setfilter)

        });
        //데이터 분류
    }

    this.setFilter = function(filter, number){
        $('.c_filter').addClass('hidden');
        $('.c_filter_check').addClass('real_hidden')
        $(".c_filter_check").eq(number).removeClass('real_hidden')
        this.show(filter)
    }

    this.show = function(filter){
        let txt = ""
        this.debugArray = this.category[filter]

        for (var i = 0; i < this.category[filter].length; i++) {

            txt += '<div class="c_ct" key="'+this.category[filter][i].key+'" id="'+this.category[filter][i].id+'">'
            txt+='<div class="c_ct_type centering_hor"><div class="c_ct_type_circle bgco_'
            txt += this.category[filter][i].color + '"></div></div><p class="c_ct_date">' + this.category[filter][i].date + " " + this.category[filter][i].time
            txt += '</p><p class="c_ct_company">' + this.category[filter][i].err + '</p><p class="c_ct_title">' + this.category[filter][i].detail
            txt += '</p></div>'
        }
        $('.c_contents').html(txt)
        $(".c_st_box_total_number").html(this.category.total.length)
        $(".c_header_top_numbList").html("<p class='bold fl_left'>"+$(".c_ct").length + "</p><p class='fl_left'>&nbsp;/ " + this.category.total.length + " Exceptions</p>")
    }
}



function formatDT(parsedDateTime){
    let date = new Date(parsedDateTime)
    let forReturn = date.getFullYear() +"-"+ ("0" + (date.getMonth() + 1)).slice(-2) +"-"+ ("0" + date.getDate()).slice(-2) +" "+ ("0" + date.getHours()).slice(-2) +":"+ ("0" + date.getMinutes()).slice(-2)
    return forReturn;
}
