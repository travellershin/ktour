String.prototype.capitalizeFirst = function(){
    return this.charAt(0).toUpperCase + this.slice(1)
}
function comma(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(".header_pageLinks_guide").hover(function(){
    $(".header_guide").css("display","block")
},function(){
    $(".header_guide").css("display","none")
})

$(".header_guide").hover(function(){
    $(".header_guide").css("display","block")
},function(){
    $(".header_guide").css("display","none")
})

$(".header_pageLinks_setting").hover(function(){
    $(".header_setting").css("display","block")
},function(){
    $(".header_setting").css("display","none")
})

$(".header_setting").hover(function(){
    $(".header_setting").css("display","block")
},function(){
    $(".header_setting").css("display","none")
})

$('#logo').click(function(){
    event.preventDefault();
    location.href = './check.html';
})
$(".header").on("click",".header_singlelink",function(){
    location.href = $(this).html().toLowerCase()+'.html'
})
$(".header_setting>p").click(function(){
    if($(this).html()==="CHANGE PASSWORD"){
        cPPop();
    }else{
        location.href = $(this).html().toLowerCase()+'.html';
    }
})

$(document).on("click",".cPPop_cancel",function(){
    $(".cPPop_wrapper").remove()
})
$(document).on("click",".cPPop_save",function(){
    let old = $(".cPPop_current").val();
    let change = $(".cPPop_new").val();
    let key = window.localStorage["ktlkey"];

    firebase.database().ref("auth/"+key+"/password").once("value", snap => {
        oldCheck = snap.val();
        if(old === oldCheck){
            if(change.length<6){
                toast("새 비밀번호는 6자 이상으로 입력해주세요")
            }else{
                firebase.database().ref("auth/"+key+"/password").set(change);
                toast("비밀번호가 성공적으로 변경되었습니다");
                $(".cPPop_wrapper").remove()
            }
        }else{
            toast("현재 비밀번호를 잘못 입력하셨습니다")
        }
    })
})

function cPPop(){
    //styles/modules/header.css
    let txt = "<div class='cPPop_wrapper'><div class='cPPop'><p class='cPPop_title'>CHANGE PASSWORD</p><div class='cPPop_liner'><p class='cPPop_txt'>현재 비밀번호</p><input type='password' class='cPPop_current'></div>"
    txt+="<div class='cPPop_liner'><p class='cPPop_txt'>새 비밀번호</p><input type='password' class='cPPop_new'></div><div class='cPPop_footer'><p class='cPPop_save'>CHANGE</p><p class='cPPop_cancel'>CANCEL</p></div></div></div>"
    $("body").append(txt)
}

//startDate와 endDate(YYYY-MM-DD 스타일), listDate(Array)를 인자로 받아 사이에 있는 날을 구한다.
function getDateRange(startDate, endDate, listDate){
    let dateMove = new Date(startDate);
    let strDate = startDate;

    if (startDate === endDate){
        listDate = [startDate]
    }else{
        while (strDate < endDate){
            strDate = dateMove.toISOString().slice(0, 10);
            listDate.push(strDate);
            dateMove.setDate(dateMove.getDate() + 1);
        }
    }
    return listDate;
};

var datestring = new DateString();
console.log(datestring.today())


function DateString(){

        this.today = function(){
            let date = new Date();
            let year = date.getFullYear();
            let month = new String(date.getMonth()+1);
            if(month.length===1){
                month = "0" + month;
            }
            let day = new String(date.getDate());
            if(day.length===1){
                day = "0" + day;
            }
            return  year +"-"+ month +"-"+ day;

        }

        this.yesterday = function(){
            let nowDate = new Date();
            let yesterDate = nowDate.getTime() - (1 * 24 * 60 * 60 * 1000);
            nowDate.setTime(yesterDate);

            let year = nowDate.getFullYear();
            let month = String(nowDate.getMonth() + 1);
            if((month+"").length===1){
                month = "0" + month;
            }
            let day = nowDate.getDate();
            if((day+"").length===1){
                day = "0" + day;
            }

            return  year +"-"+ month +"-"+ day;
        }

        this.tomorrow = function(){
            let nowDate = new Date();
            let yesterDate = nowDate.getTime() + (1 * 24 * 60 * 60 * 1000);
            nowDate.setTime(yesterDate);

            let year = nowDate.getFullYear();
            let month = String(nowDate.getMonth() + 1);
            if((month+"").length===1){
                month = "0" + month;
            }
            let day = nowDate.getDate();
            if((day+"").length===1){
                day = "0" + day;
            }
            return  year +"-"+ month +"-"+ day;
        }
        this.add = function(no){
            let nowDate = new Date();
            let yesterDate = nowDate.getTime() + (1 * 24 * 60 * 60 * 1000)*no;
            nowDate.setTime(yesterDate);

            let year = nowDate.getFullYear();
            let month = String(nowDate.getMonth() + 1);
            if((month+"").length===1){
                month = "0" + month;
            }
            let day = nowDate.getDate();
            if((day+"").length===1){
                day = "0" + day;
            }
            return  year +"-"+ month +"-"+ day;
        }

        this.today_uni = function(){
            let date = new Date();
            let year = date.getFullYear();
            let month = new String(date.getMonth()+1);
            let day = new String(date.getDate());

            return  year +"-"+ month +"-"+ day;
        }

        this.yesterday_uni = function(){
            let nowDate = new Date();
            let yesterDate = nowDate.getTime() - (1 * 24 * 60 * 60 * 1000);
            nowDate.setTime(yesterDate);
            let year = nowDate.getFullYear();
            let month = String(nowDate.getMonth() + 1);
            let day = nowDate.getDate();

            return  year +"-"+ month +"-"+ day;
        }
}
