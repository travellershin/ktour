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

    this.category = {total : [],orange_all : [],red_all : [],agency : [],subject : [],product : [],pickup : [],multiple : [],malparsing : [],integrity : [],structure : []}

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

                    case "UNKNOWN_PICKUP":
                        this.category.total[i].color = "orange"
                        this.category.orange_all.push(this.category.total[i]);
                        this.category.pickup.push(this.category.total[i]);
                        break;

                    case "MULTIPLE_RESERVATION_CANNOT_DETERMINE":
                        this.category.total[i].color = "red"
                        this.category.red_all.push(this.category.total[i]);
                        this.category.multiple.push(this.category.total[i]);
                        break;

                    case "MALPARSING":
                        this.category.total[i].color = "red"
                        this.category.red_all.push(this.category.total[i]);
                        this.category.malparsing.push(this.category.total[i]);
                        break;

                    case "FAIL_IN_INTEGRITY":
                        this.category.total[i].color = "red"
                        this.category.red_all.push(this.category.total[i]);
                        this.category.integrity.push(this.category.total[i]);
                        break;

                    case "UNKNOWN_CONTENT_STRUCTURE":
                        this.category.total[i].color = "red"
                        this.category.red_all.push(this.category.total[i]);
                        this.category.structure.push(this.category.total[i]);
                        break;
                }
            }

            $('.cc_low').html(this.category.agency.length);
            $('.cc_mid').html(this.category.subject.length);
            $('.cc_high').html(this.category.product.length + this.category.pickup.length);
            $('.cc_vhigh').html(this.category.multiple.length + this.category.malparsing.length+this.category.integrity.length+this.category.structure.length);

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
