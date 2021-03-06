let mailing = new Mailing
let setfilter = "total"
let filterInflated = false;

$(document).ready(function(){
    if(window.localStorage["ktlkey"]){
        let loginKey = window.localStorage["ktlkey"];
        let loginToken = window.localStorage["ktltoken"];
        firebase.database().ref("auth").once("value", snap => {
            adata = snap.val();
            if(adata[loginKey].token === loginToken && adata[loginKey].validdate === datestring.today() && adata[loginKey].grade>0){
                mailing.init();
                console.log("login okay");
                if(adata[loginKey].grade === 4){
                    $(".header>ul").append("<li class='header_pageLinks header_singlelink'>MASTERPAGE</li>")
                }
            }else{
                location.href = './index.html'
            }

        });
    }else{
        location.href = './index.html'
    }
})

$('.c_header_bottom_type').click(function(){
    $('.c_filter').toggleClass('hidden');
})
$(".exp_pop").click(function(e){
    return false;
})

$(".c_filter").on("click",".c_filter_btn",function(){
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
        "FAILED_CHECK_FUNKO","EMPTY_FUNKO","UNKNOWN_PRODUCT","UNKNOWN_PICKUP","UNKNOWN_OPTION",
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

                for (let color in this.category) {
                    exArray = this.category[color];

                    if(exArray.includes(data[key].err)){
                        data[key].color = color;
                        this.exception[color].push(data[key])
                    }
                }
                if(this.exception[data[key].err]){
                    this.exception[data[key].err].push(data[key])
                }else{
                    this.exception[data[key].err] = [data[key]]
                }
            }

            this.exception.total.sort(function(a,b){
                return a.newdate < b.newdate ? -1 : a.newdate > b.newdate ? 1 : 0;
            });
            console.log(this.exception)


            $('.cc_low').html(this.exception.green.length);
            $('.cc_mid').html(this.exception.yellow.length);
            $('.cc_high').html(this.exception.orange.length);
            $('.cc_vhigh').html(this.exception.red.length);
            $('.c_st_box_total_number').html(this.exception.total.length);

            if(!filterInflated){
                this.inflateFilter();
            }
            this.show(setfilter)
        });
        //데이터 분류
    }

    this.inflateFilter = function(){
        let txt = "";
        txt+='<div class="c_filter_all c_filter_btn" id="total"><img class="c_filter_all_check c_filter_check" src="./assets/icon-input-check.svg"/><p>All</p></div>'
        txt+='<div class="c_filter_btn" id="UNKNOWN_ADDRESS"><img class="c_filter_check real_hidden" src="./assets/icon-input-check.svg"/><div class="c_filter_circle bgco_green"></div><p class="c_filter_txt">UNKNOWN_ADDRESS</p></div>'
        txt+='<div class="c_filter_btn" id="yellow"><img class="c_filter_check real_hidden c_filter_check--smallMargin" src="./assets/icon-input-check.svg"/><div class="c_filter_circle bgco_yellow"></div><p class="c_filter_txt">YELLOW_ALL</p></div>'
        for (let i = 0; i < this.category.yellow.length; i++) {
            txt+='<div class="c_filter_btn" id="'+this.category.yellow[i]+'"><img class="c_filter_company_check c_filter_check real_hidden" src="./assets/icon-input-check.svg"/><div class="c_filter_circle bgco_yellow"></div><p class="c_filter_txt">'+this.category.yellow[i]+'</p></div>'
        }
        txt+='<div class="c_filter_btn" id="orange"><img class="c_filter_check real_hidden c_filter_check--smallMargin" src="./assets/icon-input-check.svg"/><div class="c_filter_circle bgco_orange"></div><p class="c_filter_txt">ORANGE_ALL</p></div>'
        for (let i = 0; i < this.category.orange.length; i++) {
            txt+='<div class="c_filter_btn" id="'+this.category.orange[i]+'"><img class="c_filter_check real_hidden" src="./assets/icon-input-check.svg"/><div class="c_filter_circle bgco_orange"></div><p class="c_filter_txt">'+this.category.orange[i]+'</p></div>'
        }
        txt+='<div class="c_filter_btn" id="red"><img class="c_filter_check real_hidden c_filter_check--smallMargin" src="./assets/icon-input-check.svg"/><div class="c_filter_circle bgco_red"></div><p class="c_filter_txt">RED_ALL</p></div>'
        for (let i = 0; i < this.category.red.length; i++) {
            txt+='<div class="c_filter_btn" id="'+this.category.red[i]+'"><img class="c_filter_check real_hidden" src="./assets/icon-input-check.svg"/><div class="c_filter_circle bgco_red"></div><p class="c_filter_txt">'+this.category.red[i]+'</p></div>'
        }

        $(".c_filter").html(txt)
        filterInflated = true;
    }

    this.setFilter = function(filter, number){
        if(this.exception[filter]){
            if(this.exception[filter].length>0){
                $('.c_filter').addClass('hidden');
                $('.c_filter_check').addClass('real_hidden')
                $(".c_filter_check").eq(number).removeClass('real_hidden')
                this.show(filter)
            }else{
                toast(filter+" 관련 Exception은 없습니다")
            }
        }else{
            toast(filter+" 관련 Exception은 없습니다")
        }
    }

    this.show = function(filter){
        let txt = ""
        this.debugArray = this.exception[filter]

        for (var i = 0; i < this.exception[filter].length; i++) {

            txt += '<div class="c_ct" key="'+this.exception[filter][i].key+'" id="'+this.exception[filter][i].id+'">'
            txt+='<div class="c_ct_type centering_hor"><div class="c_ct_type_circle bgco_'
            txt += this.exception[filter][i].color + '"></div></div><p class="c_ct_date">' + this.exception[filter][i].date + " " + this.exception[filter][i].time
            txt += '</p><p class="c_ct_company">' + this.exception[filter][i].err + '</p><p class="c_ct_title">' + this.exception[filter][i].detail
            txt += '</p></div>'
        }
        $('.c_contents').html(txt)
        $(".c_st_box_total_number").html(this.exception.total.length)
        $(".c_header_top_numbList").html("<p class='bold fl_left'>"+$(".c_ct").length + "</p><p class='fl_left'>&nbsp;/ " + this.exception.total.length + " Exceptions</p>")
    }
}



function formatDT(parsedDateTime){
    let date = new Date(parsedDateTime)
    let forReturn = date.getFullYear() +"-"+ ("0" + (date.getMonth() + 1)).slice(-2) +"-"+ ("0" + date.getDate()).slice(-2) +" "+ ("0" + date.getHours()).slice(-2) +":"+ ("0" + date.getMinutes()).slice(-2)
    return forReturn;
}
