String.prototype.capitalizeFirst = function(){
    return this.charAt(0).toUpperCase + this.slice(1)
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


$('#logo').click(function(){
    event.preventDefault();
    location.href = './check.html';
})

$('.header_pageLinks').click(function(){
    if($(this).html() === "GUIDE"){
        // TODO: 드롭다운이 열리고 가이드 창 3개 선택지가 표시되어야 함
        location.href = 'guide_managing.html'
    }else{
        location.href = $(this).html().toLowerCase()+'.html'
    }
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
            if(month.length===1){
                month = "0" + month;
            }
            let day = nowDate.getDate();
            if(day.length===1){
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
            if(month.length===1){
                month = "0" + month;
            }
            let day = nowDate.getDate();
            if(day.length===1){
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
