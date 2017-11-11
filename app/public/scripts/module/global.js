String.prototype.capitalizeFirst = function(){
    return this.charAt(0).toUpperCase + this.slice(1)
}
function comma(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


출처: http://fruitdev.tistory.com/160 [과일가게 개발자]

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

$('.header_singlelink').click(function(){
    location.href = $(this).html().toLowerCase()+'.html'
})
$(".header_setting>p").click(function(){
    location.href = $(this).html().toLowerCase()+'.html'
})

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
