let agency = new Agency();
let userStatus = 'normal'

$(document).ready(function(){
    agency.init()
})

$(document).on("click",".ag_add", function(){
    agency.add();
})
$('.ag_footer_save').click(function(){
    agency.save();
    toast("저장되었습니다")
})
$(document).on("click",".ag_agency",function(){
    if(!$(this).hasClass("ag_add")){
        $(".ag_agency").removeClass("ag_agency--selected");
        $(this).addClass("ag_agency--selected")
        agency.show($(this).attr("id"))
    }
})
$(".ag_footer_delete").click(function(){
    agency.delete();
})
$(".ag_auto_yes").click(function(){
    agency.putYes();
})
$(".ag_auto_no").click(function(){
    agency.putNo();
})
$(".ag_auto_mail").click(function(){
    agency.checkMail();
})
$(".ag_auto_click").click(function(){
    agency.checkClick();
})


function Agency(){

    this.init = function(){
        firebase.database().ref("agency").once("value", snap => {
            let data = snap.val();
            console.log(data)
            let txt = ""
            for (let keys in data) {
                txt+="<p class='ag_agency' id='"+keys+"'>"+data[keys].name+"</p>"
            }
            txt+="<p class='ag_agency ag_add'>+ ADD NEW AGENCY</p>"

            $(".ag_list").html(txt);

            $(".ag_agency").eq(0).addClass('ag_agency--selected')

            this.show($(".ag_agency").eq(0).attr("id"))

            $('.ag_info').removeClass('hidden')
        });
    }

    this.show = function(agencyID){

        firebase.database().ref("agency/"+agencyID).once("value", snap => {
            let data = snap.val();
            userStatus = agencyID;

            $(".ag_info").removeClass("hidden");
            $(".ag_info_name").val(data.name);
            if(data.auto){
                agency.putYes();
            };
            if(data.byClick){
                $(".ag_auto_click>radio").addClass("ag_info_auto2--selected")
                $(".ag_auto_click>radio").removeClass("ag_info_auto2--unselected")
            }else{
                $(".ag_auto_click>radio").removeClass("ag_info_auto2--selected")
                $(".ag_auto_click>radio").addClass("ag_info_auto2--unselected")
            };
            if(data.byMail){
                $(".ag_auto_mail>radio").addClass("ag_info_auto2--selected")
                $(".ag_auto_mail>radio").removeClass("ag_info_auto2--unselected")
            }else{
                $(".ag_auto_mail>radio").removeClass("ag_info_auto2--selected")
                $(".ag_auto_mail>radio").addClass("ag_info_auto2--unselected")
            };
            $(".ag_info_domain").val(data.domain);
            $(".ag_info_subject").val(data.subject);
            $(".ag_info_rule").val(data.rule);
            $(".ag_info_replySubject").val(data.replySubject);
            $(".ag_info_replyBody").val(data.replyBody);

        });
    }

    this.add = function(){
        userStatus = 'new';
        $(".ag_agency").removeClass("ag_agency--selected");
        $(".ag_add").addClass("ag_agency--selected")
        $(".ag_info").removeClass("hidden");
        $(".ag_info_name").val("NEW AGENCY NAME");
        this.putNo();
        $(".ag_info_domain").val("");
        $(".ag_info_subject").val("");
        $(".ag_info_rule").val("");
        $(".ag_auto_click>radio").removeClass("ag_info_auto2--selected")
        $(".ag_auto_click>radio").addClass("ag_info_auto2--unselected")
        $(".ag_auto_mail>radio").removeClass("ag_info_auto2--selected")
        $(".ag_auto_mail>radio").addClass("ag_info_auto2--unselected")
        $(".ag_info_replySubject").val("");
        $(".ag_info_replyBody").val("");
    }

    this.save = function(){

        let agencyKey = ""

        if(userStatus === "new"){
            agencyKey = firebase.database().ref().push().key;
            console.log("새로운 agencyid "+agencyKey+"를 생성해 기록합니다")
            userStatus = agencyKey
            this.nextStep(agencyKey)
        }else{
            agencyKey = userStatus;
            console.log("기존 agencyid "+agencyKey+"에 덮어씁니다")
            this.nextStep(agencyKey)
        }
    }

    this.nextStep = function(agencyKey){
        let checkAuto = true;
        let checkMail = true;
        let checkClick = true;

        if($(".ag_auto_yes>radio").hasClass("ag_info_auto--unselected")){
            checkAuto = false;
            console.log("오토싫어")
        }
        if($(".ag_auto_mail>radio").hasClass("ag_info_auto2--unselected")){
            checkMail = false;
            console.log("메일링싫어")
        }
        if($(".ag_auto_click>radio").hasClass("ag_info_auto2--unselected")){
            checkClick = false;
            console.log("클릭싫어")
        }

        firebase.database().ref("agency/"+agencyKey).set({
            name:$(".ag_info_name").val(),
            domain:$(".ag_info_domain").val(),
            subject:$(".ag_info_subject").val(),
            rule:$(".ag_info_rule").val(),
            replySubject:$(".ag_info_replySubject").val(),
            replyBody:$(".ag_info_replyBody").val(),
            auto: checkAuto,
            byMail: checkMail,
            byClick: checkClick
        })

        this.init();
    }

    this.delete = function(){
        if(confirm("Agency 관련 정보가 영구히 삭제됩니다. 지우시겠습니까?")){
            firebase.database().ref("agency/"+userStatus).remove();
            this.init();
        }
    }

    this.putYes = function(){
        $(".ag_auto_yes>radio").addClass("ag_info_auto--selected");
        $(".ag_auto_yes>radio").removeClass("ag_info_auto--unselected");
        $(".ag_auto_no>radio").removeClass("ag_info_auto--selected");
        $(".ag_auto_no>radio").addClass("ag_info_auto--unselected");
    }

    this.putNo = function(){
        $(".ag_auto_yes>radio").removeClass("ag_info_auto--selected");
        $(".ag_auto_yes>radio").addClass("ag_info_auto--unselected");
        $(".ag_auto_no>radio").addClass("ag_info_auto--selected");
        $(".ag_auto_no>radio").removeClass("ag_info_auto--unselected");
    }

    this.checkMail = function(){
        if($(".ag_auto_mail>radio").hasClass("ag_info_auto2--selected")){
            $(".ag_auto_mail>radio").removeClass("ag_info_auto2--selected")
            $(".ag_auto_mail>radio").addClass("ag_info_auto2--unselected")
        }else{
            $(".ag_auto_mail>radio").addClass("ag_info_auto2--selected")
            $(".ag_auto_mail>radio").removeClass("ag_info_auto2--unselected")
            $(".ag_auto_click>radio").removeClass("ag_info_auto2--selected")
            $(".ag_auto_click>radio").addClass("ag_info_auto2--unselected")
        }
    }
    this.checkClick = function(){
        if($(".ag_auto_click>radio").hasClass("ag_info_auto2--selected")){
            $(".ag_auto_click>radio").removeClass("ag_info_auto2--selected")
            $(".ag_auto_click>radio").addClass("ag_info_auto2--unselected")
        }else{
            $(".ag_auto_click>radio").addClass("ag_info_auto2--selected")
            $(".ag_auto_click>radio").removeClass("ag_info_auto2--unselected")
            $(".ag_auto_mail>radio").removeClass("ag_info_auto2--selected")
            $(".ag_auto_mail>radio").addClass("ag_info_auto2--unselected")
        }
    }
}
