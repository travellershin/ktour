let mailing = new Mailing

$(document).ready(function(){
    mailing.init();
})

$('.c_header_bottom_type').click(function(){
    $('.c_filter').toggleClass('hidden');
})

$('.c_filter_btn').click(function(){
    mailing.setFilter($(this).attr("id"), $('.c_filter_btn').index($(this)));
})

//for debugging
$(document).on("click", ".c_ct", function(){
    // TODO: funko, 직접예약 등에서 오는 예약은 g메일에서 잡히면 안됨.
    if(confirm("mail id : "+$(this).attr("id")+"\n"+mailing.debugArray[$(".c_ct").index(this)].detail)){
        window.open("https://mail.google.com/mail/u/0/#inbox/"+$(this).attr("id"))
    }else{

    }
})

function Mailing(){

    this.category = {
        total : [],
        agency : [],
        subject : [],
        orange_all : [],
        product : [],
        product_closed : [],
        pickup : [],
        option : [],
        multiple : [],
        time : [],
        price : [],
        bus : [],
        red_all : [],
        process : [],
        bot : [],
        integrity : [],
        unparsable : [],
        unresponsible : [],
        network : [],
        type : []
    }

    this.debugArray = []

    this.init = function(){
        //데이터 분류
        firebase.database().ref("exception").on("value", snap => {
            let data = snap.val();

            for (var key in data) {
                let dateTime = data[key].date + " " + data[key].time
                data[key].id = key
                data[key].newdate = Date.parse(dateTime);
                this.category.total.push(data[key])
            }
            console.log(this.category.total)

            this.category.total.sort(function(a,b){
                return a.newdate < b.newdate ? -1 : a.newdate > b.newdate ? 1 : 0;
            });

            for (var i = 0; i < this.category.total.length; i++) {

                switch(this.category.total[i].err){
                    case "UNKNOWN_AGENCY":
                        this.category.total[i].color = "green"
                        this.category.agency.push(this.category.total[i]);
                        break;
                    case "UNKNOWN_SUBJECT":
                        this.category.total[i].color = "yellow"
                        this.category.subject.push(this.category.total[i]);
                        break;
                    case "UNKNOWN_PRODUCT":
                        this.category.total[i].color = "orange"
                        this.category.orange_all.push(this.category.total[i]);
                        this.category.product.push(this.category.total[i]);
                        break;

                    case "CLOSED_PRODUCT":
                        this.category.total[i].color = "orange"
                        this.category.orange_all.push(this.category.total[i]);
                        this.category.product_closed.push(this.category.total[i]);
                        break;

                    case "UNKNOWN_PICKUP":
                        this.category.total[i].color = "orange"
                        this.category.orange_all.push(this.category.total[i]);
                        this.category.pickup.push(this.category.total[i]);
                        break;

                    case "UNKNOWN_OPTION":
                        this.category.total[i].color = "orange"
                        this.category.orange_all.push(this.category.total[i]);
                        this.category.option.push(this.category.total[i]);
                        break;

                    case "NO_BUS_INFO":
                        this.category.total[i].color = "orange"
                        this.category.orange_all.push(this.category.total[i]);
                        this.category.bus.push(this.category.total[i]);
                        break;

                    case "LAST_MINUTE":
                        this.category.total[i].color = "orange"
                        this.category.orange_all.push(this.category.total[i]);
                        this.category.time.push(this.category.total[i]);
                        break;

                    case "NO_PRICE_INFO":
                        this.category.total[i].color = "orange"
                        this.category.orange_all.push(this.category.total[i]);
                        this.category.price.push(this.category.total[i]);
                        break;

                    case "CANNOT_DETERMINE":
                        this.category.total[i].color = "red"
                        this.category.red_all.push(this.category.total[i]);
                        this.category.multiple.push(this.category.total[i]);
                        break;

                    case "PROCESS_DIED":
                        this.category.total[i].color = "red"
                        this.category.red_all.push(this.category.total[i]);
                        this.category.process.push(this.category.total[i]);
                        break;

                    case "BOT_DIED":
                        this.category.total[i].color = "red"
                        this.category.red_all.push(this.category.total[i]);
                        this.category.bot.push(this.category.total[i]);
                        break;

                    case "FAIL_IN_INTEGRITY":
                        this.category.total[i].color = "red"
                        this.category.red_all.push(this.category.total[i]);
                        this.category.integrity.push(this.category.total[i]);
                        break;

                    case "UNKNOWN_CONTENT_TYPE":
                        this.category.total[i].color = "red"
                        this.category.red_all.push(this.category.total[i]);
                        this.category.type.push(this.category.total[i]);
                        break;

                    case "UNPARSABLE":
                        this.category.total[i].color = "red"
                        this.category.red_all.push(this.category.total[i]);
                        this.category.unresponsible.push(this.category.total[i]);
                        break;

                    case "UNRESPONSIBLE":
                        this.category.total[i].color = "red"
                        this.category.red_all.push(this.category.total[i]);
                        this.category.unparsable.push(this.category.total[i]);
                        break;

                    case "NETWORK_ERR":
                        this.category.total[i].color = "red"
                        this.category.red_all.push(this.category.total[i]);
                        this.category.network.push(this.category.total[i]);
                        break;
                }
            }


    
            $('.cc_low').html(this.category.agency.length);
            $('.cc_mid').html(this.category.subject.length);
            $('.cc_high').html(this.category.price.length + this.category.time.length + this.category.bus.length + this.category.option.length + this.category.product_closed.length + this.category.product.length + this.category.pickup.length);
            $('.cc_vhigh').html(this.category.bot.length+this.category.unresponsible.length+this.category.unparsable.length+this.category.network.length+this.category.process.length+this.category.multiple.length +this.category.integrity.length+this.category.type.length);

            this.show("total")

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
            this.category[filter][i]

            txt += '<div class="c_ct" id="'+this.category[filter][i].id+'"><div class="c_ct_type centering_hor"><div class="c_ct_type_circle bgco_'
            txt += this.category[filter][i].color + '"></div></div><p class="c_ct_date">' + this.category[filter][i].date + " " + this.category[filter][i].time
            txt += '</p><p class="c_ct_company">' + this.category[filter][i].err + '</p><p class="c_ct_title">' + this.category[filter][i].detail
            txt += '</p></div>'
        }
        $('.c_contents').html(txt)
        $(".c_st_box_total_number").html($(".c_ct").length)
    }
}



function formatDT(parsedDateTime){
    let date = new Date(parsedDateTime)
    let forReturn = date.getFullYear() +"-"+ ("0" + (date.getMonth() + 1)).slice(-2) +"-"+ ("0" + date.getDate()).slice(-2) +" "+ ("0" + date.getHours()).slice(-2) +":"+ ("0" + date.getMinutes()).slice(-2)
    return forReturn;
}
